import { useEffect, useState, useRef } from 'react'
import { useTranslation, initReactI18next } from 'react-i18next';


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
		<main>
			<header>
				<h1>{t("header")}</h1>
			</header>
			<aside id="side-menu">
				<p>Player and stats here  {t("aside")}</p>
			</aside>
			<section id="game">
				<div id="story" className="p-2">
					<p>Import corresponding JSON here  {t("section")}</p>
						<article ref={sceneRef} tabIndex={-1} aria-live="polite">
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

				<div id="buttons" className="flex flex-row justify-center text-uppercase p-4 gap-4">
					<p>Map button choices here  {t("buttons")}</p>
					<nav aria-label="Opciones">
							<ul>
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
			</section>
			<footer>
				<p>Link or credits or something. Version 0.0.0  {t("footer")}</p>
			</footer>
		</main>
	)
}

export default HomePage