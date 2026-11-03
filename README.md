# terrarium
WIP. A small browser game.


Stack/Como hacer ersto:
- En lugar de buscar un framework, será Vite + JS + React + CSS a pelo
- Será una VN con muchas imágenes
- Buscar forma de hacer menús y pantallas con React
- Existe un plugin de vite que deja exportar a .html -> vite-plugin-singlefile
  ```
  npm run build -> dist/index.html
  ```
En github pages sería subir /dist con una Action (npm ci && npm run build). La descarga sería el /dist empaqutado en .zip en releases
- Para animaciones y transiciones usar CSS (transition, @keyframes)
- Para guardar partida lo bueno sería guardar el estado del juego en un json, con la escena actual, variables y las flags necesarias.
- Para guardar podría usar IndexedDB en lugar de localStorage
- Añadir un campo de version al archivo de guardado por si la arquitectura cambia
- Los textos se podrían hacer con ink (npm i inkjs) pero necesiatría un .ink por cada idioma
- Los textos podrían tambier ser json, pero ink combiene para ramificaciones y aún no sé cuantas habrá
