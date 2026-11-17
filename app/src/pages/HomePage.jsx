import { useEffect, useState, useRef } from 'react'
import { useTranslation, initReactI18next } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)



//load json files
const modules = import.meta.glob('../text/*.json', { eager: true, import: 'default' });
const nodes = Object.assign({}, ...Object.values(modules));
const init_id = Object.keys(nodes).find((id) => nodes[id].init);

const idFromHash = () => {
	const id = decodeURIComponent(window.location.hash.slice(1));
	return (nodes[id] ? id : init_id);
}

// a choice shows only if requirements are met
const hasRequirements = (requires = {}, state) =>
	Object.entries(requires).every(([key, value]) => state[key] === value);

///// MAIN HOMEPAGE FUNCTION
function HomePage() {
	const { t } = useTranslation();
	const [nodeId, setNodeId] = useState(idFromHash);
	const [state, setState] = useState({});
	const sceneRef = useRef(null);

	// get current node's hash
	useEffect( () => {
		const changeHash = () => setNodeId(idFromHash());
		window.addEventListener('hashchange', changeHash);
		return (() => window.removeEventListener('hashchange', changeHash));
	}, []);

	//change content focus
	useEffect(() => {
		sceneRef.current?.focus();
	}, [nodeId]);

	const currentNode = nodes[nodeId];

	const choose = (choice) => {
		if (choice.effects)
			setState((previous) => ({ ...previous, ...choice.effects }));
		window.location.hash = choice.target;
	};

	//mostly for debugging. there will be no way to restart the game
	const restart = () => {
		setState({});
		window.location.hash = init_id;
	};

	if (!currentNode)
	{
		return (
			<main>
				<p>Error: {nodeId} doesn't exist</p>
			</main>
		);
	}

	const paragraphs = [].concat(currentNode.text);
	const choices = (currentNode.choices ?? []).filter((e) => hasRequirements(e.requires, state));
	const finish = choices.length === 0;

/////
	return (
		<main className="min-h-screen m-0 flex flex-row gap-0 text-text-normal">
			<aside id="side-menu" className="bg-slate-200 min-h-full flex flex-col font-balsamiq text-txt-normal overflow-auto w-1/4 border-r-4 border-slate-400">
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
			<section id="game" className="bg-slate-50 min-h-full w-full flex flex-col">
				<header className="bg-slate-800 flex flex-row gap-4 min-h-12 justify-start items-center p-2">
					{/* Clock component */}
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon="fa-solid fa-clock" />
						<p>11:00 AM</p>
					</div>
					<p> | </p>
					{/* Weather component */}
					<div className="flex flex-row gap-4 items-center">
						<FontAwesomeIcon icon="fa-solid fa-cloud" />
						<p>Cloudy</p>
					</div>

				</header>
				<div id="story" className="bg-slate-200 p-8 flex-auto overscroll-contain">
					<article id="scene-image" className="bg-blue-300 w-full min-h-48">
						{/* every scene image must have a couple anchor points that bugs can appear on. no idea how to do that though */}
					</article>
					{/* I want the scenes and dialogues to be a bit different html wise, so I may need to change this structure */}
						<article ref={sceneRef} tabIndex={-1} aria-live="polite" className="mt-4 h-auto overflow-auto">
							{currentNode.imagen && (
							<figure>
								<img src={`/img/${currentNode.imagen}`} alt={currentNode.alt ?? ''} />
							</figure>
							)}

							{currentNode.speaker && (
							<header>
								<h1>{currentNode.speaker}</h1>
							</header>
							)}

							{paragraphs.map((p, i) => (
							<p key={i}>{p}</p>
							))}
						</article>
				</div>

				<div id="buttons" className="bg-slate-100 flex flex-col justify-center text-uppercase p-4 gap-4 flex-auto">
					{/* add numbered navigation to choices, somehow */}
					<nav aria-label="Opciones">
							<ul className="text-txt-normal">
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
									Empezar de nuevo
								</button>
								</li>
							)}
							</ul>
						</nav>
				</div>
			<footer className="bg-slate-300 mt-auto">
				<p className="uppercase font-balsamiq text-sm text-center">Link or credits or something. Version 0.0.0  {t("footer")}</p>
			</footer>
			</section>
		</main>
	)
}

export default HomePage