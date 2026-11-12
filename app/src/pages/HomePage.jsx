import { useEffect, useState } from 'react'
import { useTranslation, initReactI18next } from 'react-i18next';


function HomePage() {
	const { t } = useTranslation();

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
				</div>

				<div id="buttons" className="flex flex-row justify-center text-uppercase p-4 gap-4">
					<p>Map button choices here  {t("buttons")}</p>
				</div>
			</section>
			<footer>
				<p>Link or credits or something. Version 0.0.0  {t("footer")}</p>
			</footer>
		</main>
	)
}

export default HomePage