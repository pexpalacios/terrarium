import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)

import locations from '../content/locations.json'
import { createClock, advanceClock, getPeriod, formatTime, formatDuration } from '../systems/clock.js'
import { INITIAL_WEATHER, advanceWeather, WEATHER_INFO } from '../systems/weather.js'
import { rollSpawns, ALL_BUGS } from '../systems/spawn.js'


// load scene and dialogue nodes only
const modules = import.meta.glob('../content/text/{scenes_*.json,dialogues_*.json}', {
	eager: true,
	import: 'default'
})
const nodes = Object.assign({}, ...Object.values(modules));
const init_id = Object.keys(nodes).find((id) => nodes[id].init);

const idFromHash = () => {
	const id = decodeURIComponent(window.location.hash.slice(1));
	return (nodes[id] ? id : init_id);
}

// a choice shows only if requirements are met
const hasRequirements = (requires = {}, state) =>
	Object.entries(requires).every(([key, value]) => state[key] === value);

//initial time + weather
const createWorld = () => ({
	clock: createClock(),
	weather: INITIAL_WEATHER
})

const choiceLabel = (choice) => {
	const duration = choice.time > 0 ? ` (${formatDuration(choice.time)})` : '';
	const hint = choice.hint ? ` | ${choice.hint}` : '';
	return (`${choice.text}${duration}${hint}`);
}

function Game() {
	const { t } = useTranslation();
	const [nodeId, setNodeId] = useState(idFromHash);
	const [state, setState] = useState({});
	const [world, setWorld] = useState(createWorld);
	const sceneRef = useRef(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeLocation, setActiveLocation] = useState(() => {
		const firstNodeId = idFromHash();
		return (nodes[firstNodeId]?.location ?? null);
	});
	const [spawns, setSpawns] = useState([]);
	const [catalogue, setCatalogue] = useState({});
	const [announcement, setAnnouncement] = useState(null);
	const catalogueRef = useRef(null);

	// get current node from hash
	useEffect(() => {
		const changeHash = () => setNodeId(idFromHash())
		window.addEventListener('hashchange', changeHash);
		return () => window.removeEventListener('hashchange', changeHash);
	}, []);

	// keep focus on changing content
	useEffect(() => {
		sceneRef.current?.focus();
	}, [nodeId]);

	const currentNode = nodes[nodeId];

	// get location
	useEffect(() => {
		if (currentNode?.location)
			setActiveLocation(currentNode.location);
	}, [currentNode?.location]);

	const choose = (choice) => {
		if (choice.effects)
			setState((previous) => ({ ...previous, ...choice.effects }));
		if (choice.time > 0)
		{
			const clock = advanceClock(world.clock, choice.time);
			const weather = advanceWeather(world.weather, world.clock.total, clock.total);
			setWorld({clock, weather});
		}
		window.location.hash = choice.target;
	}

	// to be deleted
	const restart = () => {
		setState({});
		setWorld(createWorld());
		window.location.hash = init_id;
	}

	//global time and weather
	const locationKey = currentNode?.location ?? activeLocation;
	const location = locations[locationKey];
	const period = getPeriod(world.clock);
	const weatherInfo = WEATHER_INFO[world.weather];
	
	// bug spawn
	useEffect(() => {
		setSpawns(rollSpawns(location, locationKey, period, world.weather))
	}, [locationKey, period, world.weather])

	const catchBug = (spotId) => {
		const spawn = spawns.find((s) => s.spotId === spotId);
		if (!spawn)
			return;
		const { bug } = spawn;
		const isNew = !catalogue[bug.id];

		setSpawns((prev) => prev.filter((s) => s.spotId !== spotId));
		setCatalogue((prev) => ({...prev, [bug.id]: (prev[bug.id] ?? 0) + 1}));
		setAnnouncement({ bug, isNew });
	}

	// capture feedback
	useEffect(() => {
		if (!announcement)
			return;
		const id = setTimeout(() => setAnnouncement(null), 1000);
		return () => clearTimeout(id);
	}, [announcement]);

	if (!currentNode) {
		return (
			<main>
				<p>Error: {nodeId} doesn't exist</p>
			</main>
		)
	}

	const paragraphs = [].concat(currentNode.text);
	const choices = (currentNode.choices ?? []).filter((e) => hasRequirements(e.requires, state));
	const finish = choices.length === 0;
	const isDialogue = !!currentNode.speaker;

	//get background image
	const locationDefaultImage = location?.[`${world.weather}-${period}`] ?? null;
	const sceneImage = currentNode.image && currentNode.image.trim() !== ''
		? currentNode.image
		: locationDefaultImage;
	const sceneBackground = sceneImage
		? { backgroundImage: 'url(/img/' + sceneImage + ')' }
		: undefined;
	const spriteSrc = currentNode.sprite ? '/img/' + currentNode.sprite : null;

	return (
		<main className="min-h-screen m-0 flex flex-row gap-0 text-text-normal">
			{/* component for sidebar, only mobile */}
			{sidebarOpen && (
				<button
					type="button"
					aria-label="Close menu"
					className="fixed inset-0 z-30 bg-black/40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				></button>
			)}
			<dialog ref={catalogueRef}
				className="m-auto w-11/12 max-w-lg rounded-xl border-4 border-brown-light bg-background-tone-1-light p-6 text-brown-light backdrop:bg-black/50">
				<h2 className="font-chango text-xl">Catalogue</h2>
				<ul className="mt-4 flex justify-between gap-2 flex-wrap">
					{ALL_BUGS.map((bug) => {
						const count = catalogue[bug.id] ?? 0;
						return (
							<li key={bug.id} className="flex flex-col gap-3">
								<span
									className="h-20 w-20 flex-auto shrink-0 rounded"
									style={{ backgroundColor: count > 0 ? bug.color : '#999' }}
								></span>
								<span className="left-0 font-balsamiq">
									{count > 0 ? bug.name : '???'}
									{count > 0 && <span className="font-chango">×{count}</span>}
								</span>
							</li>
						);
					})}
				</ul>
				<button type="button" className="button-side-menu font-chango mt-6"
					onClick={() => catalogueRef.current?.close()}>
					Close
				</button>
			</dialog>

			{/* aside will be a sidebar with a menu button on mobile and fixed in tablet/pc */}
			<aside id="side-menu"
				className={[
					'fixed inset-y-0 left-0 z-40 w-3/4 bg-background-tone-2-light border-r-4 border-brown-light',
					'flex flex-col overflow-auto transition-transform duration-300',
					sidebarOpen 
					? 'translate-x-0' 
					: '-translate-x-full',
					'md:static md:translate-x-0 md:w-1/4 md:min-h-screen md:flex-shrink-0'
				].join(' ')}
			>
				<div id="pc-image" className="min-h-1/3 border-b-6 border-brown-light md:shrink-0">
					<img></img>
				</div>
				<div id="menu" className="flex flex-col justify-center text-center p-4 gap-2">
					<button className="button-side-menu font-chango"
						onClick={() => { setSidebarOpen(false); catalogueRef.current?.showModal(); }}>
						Catalogue
					</button>
					<button className="button-side-menu font-chango">Bag</button>
					<button className="button-side-menu font-chango">Save</button>
					<button className="button-side-menu font-chango">Export</button>
				</div>
				<div id="minimap" className="border-t-6 border-brown-light ">
					<img></img>
				</div>
			</aside>

			<section id="game" className="bg-background-tone-1-light min-h-screen w-full flex flex-col">
				<header className="bg-brown-light flex flex-row gap-4 min-h-12 justify-start items-center p-2 text-white">
					<button
						type="button"
						className="md:hidden rounded bg-brown-light px-3 py-2 text-white"
						onClick={() => setSidebarOpen(true)}
					>
						<FontAwesomeIcon icon="fa-solid fa-bars" />
					</button>
					{/* time component */}
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon="fa-solid fa-clock" />
						<p>{formatTime(world.clock)}</p>
					</div>
					<p> | </p>
					{/* weather component */}
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon={weatherInfo.icon} />
						<p>{weatherInfo.label}</p>
					</div>
				</header>

				{isDialogue ? (
					<div id="story" className="relative p-8 flex-1 overflow-hidden">
						<div className="relative w-full min-h-48 bg-background-tone-2-light bg-cover bg-cover bg-repeat-x overflow-hidden" style={sceneBackground}></div>
						<div className="absolute inset-0 bg-black/30"></div>
						{spriteSrc && (
							<img
								src={spriteSrc}
								alt={currentNode.spriteAlt ?? currentNode.alt ?? ''}
								className="absolute bottom-0 left-1/2 h-3/4 -translate-x-1/2 object-contain"
							/>
						)}
						<article ref={sceneRef} tabIndex={-1}
							className="absolute inset-x-4 bottom-4 gap-0"
						>
							<header className="w-fit">
								<h1 className="font-chango text-lg rounded-xl border-2 border-background-tone-2-light bg-background-tone-1-light/95 p-6">{currentNode.speaker}</h1>
							</header>
							<div className="font-balsamiq text-brown-light rounded-xl border-2 border-background-tone-2-light bg-background-tone-1-light/95 p-6">
								{paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
								<nav aria-label="options" className="mt-4">
									<ul className="flex flex-row gap-2 text-txt-normal">
										{choices.map((choice) => (
											<li key={choice.target + choice.text}>
												<button type="button" onClick={() => choose(choice)}
												className="w-full text-left text-wrap text-txt-normal"	
												>
													{choiceLabel(choice)}
												</button>
											</li>
										))}
									</ul>
								</nav>
							</div>
						</article>
					</div>
				) : (
					<>
					{/* bug catching announcement */}
					<div role="status" aria-live="polite"
						className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2">
						{announcement && (
							<p className="rounded-xl border-2 border-brown-light bg-background-tone-1-light p-4 font-balsamiq text-brown-light text-center slidein">
								{announcement.isNew
									? t('bug.first', { name: announcement.bug.name })
									: t('bug.caught', { name: announcement.bug.name })}
							</p>
						)}
					</div>
						<div id="story" className="bg-background-tone-2-light p-8 shrink-0">
							<article id="scene-image" className="relative w-full min-h-48 bg-background-tone-2-light bg-cover bg-cover bg-repeat-x overflow-hidden bg-blue-500"
								style={sceneBackground}>
								{(location?.spots ?? []).map((spot) => {
									const spawn = spawns.find((s) => s.spotId === spot.id);
									if (!spawn)
										return (null);
									return (
										<button
											key={spot.id}
											type="button"
											onClick={() => catchBug(spot.id)}
											style={{left: `${spot.x}%`, top: `${spot.y}%`, backgroundColor: spawn.bug.color}}
											className="absolute -translate-x-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-white"
										>
											{spawn.bug.name}
										</button>
									)
								})}
							</article>
							<article ref={sceneRef} tabIndex={-1} aria-live="polite" className="mt-4 h-auto overflow-auto">
								{paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
							</article>
						</div>

						<div id="buttons" className="bg-background-tone-1-light flex flex-col flex-1 p-4 gap-4 overflow-auto">
							<nav aria-label="options">
								<ul>
									{choices.map((choice) => (
										<li key={choice.target + choice.text}>
											<button type="button" onClick={() => choose(choice)}
											className="w-full text-left text-wrap text-txt-normal"	
											>
												{choiceLabel(choice)}
											</button>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</>
				)}

				<footer className="bg-background-tone-2-light mt-auto">
					<p className="uppercase font-balsamiq text-sm text-center">Link or credits or something. Version 0.0.0 {t('footer')}</p>
				</footer>
			</section>
		</main>
	)
}

export default Game