import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import locations from '../text/locations.json'

library.add(fas, far, fab)

// load scene and dialogue nodes only
const modules = import.meta.glob('../text/{scenes_*.json,dialogues_*.json}', {
	eager: true,
	import: 'default'
})
const nodes = Object.assign({}, ...Object.values(modules))
const init_id = Object.keys(nodes).find((id) => nodes[id].init)

const idFromHash = () => {
	const id = decodeURIComponent(window.location.hash.slice(1))
	return nodes[id] ? id : init_id
}

// a choice shows only if requirements are met
const hasRequirements = (requires = {}, state) =>
	Object.entries(requires).every(([key, value]) => state[key] === value)

function HomePage() {
	const { t } = useTranslation()
	const [nodeId, setNodeId] = useState(idFromHash)
	const [state, setState] = useState({})
	const sceneRef = useRef(null)
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [activeLocation, setActiveLocation] = useState(() => {
		const firstNodeId = idFromHash()
		return nodes[firstNodeId]?.location ?? null
	})

	// get current node from hash
	useEffect(() => {
		const changeHash = () => setNodeId(idFromHash())
		window.addEventListener('hashchange', changeHash)
		return () => window.removeEventListener('hashchange', changeHash)
	}, [])

	// keep focus on changing content
	useEffect(() => {
		sceneRef.current?.focus()
	}, [nodeId])

	const currentNode = nodes[nodeId]

	// preserve location background while in dialogue nodes with no location
	useEffect(() => {
		if (currentNode?.location)
			setActiveLocation(currentNode.location)
	}, [currentNode?.location])

	const choose = (choice) => {
		if (choice.effects)
			setState((previous) => ({ ...previous, ...choice.effects }))
		window.location.hash = choice.target
	}

	const restart = () => {
		setState({})
		window.location.hash = init_id
	}

	if (!currentNode) {
		return (
			<main>
				<p>Error: {nodeId} doesn't exist</p>
			</main>
		)
	}

	const paragraphs = [].concat(currentNode.text)
	const choices = (currentNode.choices ?? []).filter((e) => hasRequirements(e.requires, state))
	const finish = choices.length === 0
	const isDialogue = !!currentNode.speaker

	//get background image
	const locationKey = currentNode.location ?? activeLocation
	const locationDefaultImage = locations[locationKey]?.image ?? null
	const sceneImage = currentNode.image && currentNode.image.trim() !== ''
		? currentNode.image
		: locationDefaultImage
	const sceneBackground = sceneImage
		? { backgroundImage: 'url(/img/' + sceneImage + ')' }
		: undefined
	const spriteSrc = currentNode.sprite ? '/img/' + currentNode.sprite : null

	return (
		<main className="min-h-screen m-0 flex flex-row gap-0 text-text-normal">
			{sidebarOpen && (
				<button
					type="button"
					aria-label="Close menu"
					className="fixed inset-0 z-30 bg-black/40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				></button>
			)}

			<aside id="side-menu"
				className={[
					'fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-slate-200 border-r-4 border-slate-400',
					'flex flex-col overflow-auto transition-transform duration-300',
					sidebarOpen 
					? 'translate-x-0' 
					: '-translate-x-full',
					'md:static md:translate-x-0 md:w-[22rem] md:min-h-screen md:flex-shrink-0'
				].join(' ')}
			>
				<div id="pc-image" className="min-h-1/4 border-b-6 border-slate-400 md:shrink-0">
					<img></img>
				</div>
				<div id="menu" className="flex flex-col justify-center text-center p-4 gap-2">
					<button className="button-side-menu font-chango">Catalogue</button>
					<button className="button-side-menu font-chango">Bag</button>
					<button className="button-side-menu font-chango">Save</button>
					<button className="button-side-menu font-chango">Export</button>
				</div>
				<div id="minimap" className="border-t-6 border-slate-400 ">
					<img></img>
				</div>
			</aside>

			<section id="game" className="bg-slate-50 min-h-screen w-full flex flex-col">
				<header className="bg-slate-800 flex flex-row gap-4 min-h-12 justify-start items-center p-2">
					<button
						type="button"
						className="md:hidden rounded bg-slate-700 px-3 py-2 text-white"
						onClick={() => setSidebarOpen(true)}
					>
						<FontAwesomeIcon icon="fa-solid fa-bars" />
					</button>
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon="fa-solid fa-clock" />
						<p>11:00 AM</p>
					</div>
					<p> | </p>
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon="fa-solid fa-cloud" />
						<p>Cloudy</p>
					</div>
				</header>

				{isDialogue ? (
					<div id="story" className="relative p-8 flex-1 overflow-hidden">
						{/* background. stays the same for now */}
						<div className="relative w-full min-h-48 bg-slate-300 bg-cover bg-cover bg-repeat-x overflow-hidden" style={sceneBackground}></div>
						<div className="absolute inset-0 bg-black/30"></div>
						{spriteSrc && (
							<img
								src={spriteSrc}
								alt={currentNode.spriteAlt ?? currentNode.alt ?? ''}
								className="absolute bottom-0 left-1/2 h-[70%] -translate-x-1/2 object-contain"
							/>
						)}
						<article ref={sceneRef} tabIndex={-1}
							className="absolute inset-x-4 bottom-4 gap-0"
						>
							<header className="w-fit">
								<h1 className="font-chango text-lg rounded-xl border-2 border-slate-300 bg-slate-100/95 p-6">{currentNode.speaker}</h1>
							</header>
							<div className="font-balsamiq text-slate-800 rounded-xl border-2 border-slate-300 bg-slate-100/95 p-6">
								{paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
								<nav aria-label="options" className="mt-4">
									<ul className="flex flex-row gap-2 text-txt-normal">
										{choices.map((choice) => (
											<li key={choice.target + choice.text}>
												<button type="button" onClick={() => choose(choice)}>
													{choice.text}
												</button>
											</li>
										))}
										{finish && (
											<li>
												<button type="button" onClick={restart}>
													restart
												</button>
											</li>
										)}
									</ul>
								</nav>
							</div>
						</article>
					</div>
				) : (
					<>
						<div id="story" className="bg-slate-200 p-8 shrink-0">
							<article id="scene-image" className="relative w-full min-h-48 bg-slate-300 bg-cover bg-cover bg-repeat-x overflow-hidden"
								style={sceneBackground}
							>
							</article>
							<article ref={sceneRef} tabIndex={-1} aria-live="polite" className="mt-4 h-auto overflow-auto">
								{paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
							</article>
						</div>

						<div id="buttons" className="bg-slate-100 flex flex-col justify-start text-uppercase p-4 gap-4 flex-1 overflow-auto">
							<nav aria-label="options">
								<ul className="text-txt-normal">
									{choices.map((choice) => (
										<li key={choice.target + choice.text}>
											<button type="button" onClick={() => choose(choice)}>
												{choice.text}
											</button>
										</li>
									))}
									{/* to be deleted */}
									{finish && (
										<li>
											<button type="button" onClick={restart}>
												restart
											</button>
										</li>
									)}
								</ul>
							</nav>
						</div>
					</>
				)}

				<footer className="bg-slate-300 mt-auto">
					<p className="uppercase font-balsamiq text-sm text-center">Link or credits or something. Version 0.0.0 {t('footer')}</p>
				</footer>
			</section>
		</main>
	)
}

export default HomePage