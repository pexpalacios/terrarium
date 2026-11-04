# terrarium
WIP. A small browser game. La idea es un lifesim sobre coleccionar bichos. EL bucle se basa en buscar y capturar bichos -> vender o quedar -> gestionar terrario -> avanzar básicamente. 

----

### Objetivos

- Crear una UI vistosa y que funcionen bien los links

- Crear primer boceto de como sería el loop del juego (1 zona, 5 bichos, 1 ciclo de tiempo/clima simple, 1 tienda, guardado y carga)

### Idea de arquitectura

```
src/
	main.jsx
	App.jsx
	core/		//código plano sin react. estado, guardado/carga, rng, clima, reloj
	systems/	//funciones para sistemas del juego. economia, catalogo, captura, terrario
	content/	//datos. lugares, npcs, eventos
	actions/	//catalogo de acciones, sigue lo que hace el jugador y avanza reloj, valida reglas
	assets/		//sprites, placeholder /imgs
	ui/			//componentes y patallas de react. canva? menus (catalogo, tiendas)
	minigames/	//registro, juegos (cada un su carpeta)
```


###  Features:

- coleccionar bichos

		un catálogo con entradas. se puede ver en cualquier momento. sería un menú aparte que se sobrepone sobre la partida.
		algunos bichos necesitan condiciones de reloj y clima para aparecer
		una habilidad para desbloquear bichos más difíciles de conseguir? o dejamos eso a otras circunstancias?
		bichos encompasa todos los artropodos, no solo insectos. aracnidos, cefalopodos, crustaceos, etc estarán incluidos

- customización de personaje

		sprites de cara, pelo y atuendo. habrá que hacer una lista de que incluir, auqne me parece fácil ir añadiendo cosas
	
- diálogos, escenas y eventos

		planteados diractamente en JSON o con InkJS. deberán estar en minimo ES y EN
		escena a escena funciona con links y redirecciones dentro del proyecto
		algunos funcionaran por rng, otros por eventos previos y flags

- terrario

		un espacio en casa del jugador donde poner los bichos que quiera
		upgrades para tener más espacio, mejores condiciones y bonus
		a lo mejor la curva de dificultad viene por el terrario en vez de una habilidad
		podría tener varios?

- ciudad

		un pequeño mapa con puntos de interés. las zonas tendrán bichos específicos
		npcs y eventos al rededor de la ciudad
		una tienda de ropa, cosmetica y peluqueria
		una tienda de mascotas para comprar cosas del terrario
		un bosque, una playa y un claro rodean la ciudad como zonas especificas para bichos

- economía

		el jugador puede ganar dinero por medio de completar tareas (coleccionar x bichos, hacer x eventos)
		o trabajando. los trabajos son pequeños juegos flash, típicos de los 2000 (tipo trabajar como camarero sirviendo mesas)

- trabajos/minijuegos

		tienen su propio leveleo. puedes obtener ascensos y asi hacer mas dinero por turno
		cada juego necesita su ppropia carpeta con su logica, estado i assets

- exportación y guardado

		se crean un JSON con las variables, flags y estado de la partida.
		escena debe incluir lugar, tiempo y clima actuales, asi como la apariencia del PC
		las variables incluyen el dinero que tiene el jugador, cualquier nivel de habilidad, su nivel de relacion 
		con los NPCs y la cantidad de colección que tiene registrada
		las flags se pueden referir a eventos especificos que han pasado o cosas que el juego este trackeando en el fondo para crear esos eventos

	
### Features muy extra que podrían funcionar pero que no están planteados de verdad:

- bicho compañero. podría ofrecer bonus cuando activo
- jardín para farmear bichos específicos
- pesca para los bichos especificos de mar
