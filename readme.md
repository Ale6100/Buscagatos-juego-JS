# Juego Buscagatos

Bienvenido! Te presento mi primer juego creado con HTML, CSS y JavaScript.

Se trata de un buscaminas muy personalizado. Ve a **Funcionalidades** para ver las características que considero más relevantes.

## Deploy 🌎

Utiliza la versión más reciénte subida a la web [aquí](https://buscagatos.netlify.app/)

## Contexto 📌

Hice este proyecto en mi curso de JavaScript con el propósito de enfrentarme un desafío fuera de lo común para un principiante, utilizando mi experiencia previa en Python.

## Comenzando 🚀

Descarga el archivo comprimido .zip desde el botón verde "code" o haz click [aquí](https://github.com/Ale6100/Buscagatos-juego-JS/archive/refs/heads/main.zip)

Alternativamente puedes _Forkear_ el repositorio

### Pre-requisitos 📋

Se hace uso de un archivo json local traido con fetch, por lo tanto Necesitas ejecutar el archivo desde un servidor. En caso de que tengas Visual Studio Code puedes utilizar la extensión Live Server.

### Instalación 🔧

Ninguna!

## Despliegue 📦

Ejecuta el código con Live Server y listo!

## Construido con 🛠️

* HTML5
* CSS
* JavaScript
* [Sweet Alert 2](https://sweetalert2.github.io/)
* [Toastify](https://apvarun.github.io/toastify-js/)

## Funcionalidades

* Se pueden personalizar las dimensiones del tablero siempre y cuando tenga entre 10 y 2500 casilleros._

El límite máximo se colocó para evitar que alguien coloque un número muy grande, provocando que su dispositivo no responda con fluidez. Sin embargo puede modificarse en el condicional ```if``` que ejecuta la función ```mostrarError```.

* Se puede establecer un porcentaje de gatos aproximado entre 1% y 99%, siempre y cuando sea un número entero
* Si se intenta personalizar el tablero con parámetros fuera de los rangos mencionados anteriormente, el juego no se inicia y te enseña el problema.
* Los parámetros válidos se almacenan cada vez que una partida se inició de tal manera que, si el jugador sale del sitio y entra en otro momento, dichos parámetros quedan guardados gracias al localstorage.
* Con el click derecho se puede colocar banderas como en un buscaminas de verdad. En móvil o tablet se puede simular dejando presionado el dedo un par de segundos sobre un casillero.
* A medida que el juego avanza aparecen pequeños consejos al azar debajo del tablero (actualmente son 15). No aparecen siempre para no ser pesado con el jugador.
* Hay un cronómetro integrado.
* Cuando se gana te aparece un cartel felicitándote y mostrándote la cantidad de clicks que te tomó ganar esa partida.
* El juego te muestra el porcentaje de partidas ganadas. Se te da la opción de reiniciar dicho porcentaje cada vez que se gana.
* Si el juego detecta que estás perdiendo muy seguido, eventualmente te sugerirá colocar los parámetros que coloqué por defecto (11 filas, 11 columnas, y 15% de gatos aproximados) en caso de que no estén puestos.

## Autores ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)

## Expresiones de Gratitud 🎁

* [Francisco Pugh](https://www.linkedin.com/in/francisco-pugh/) - Profesor JavaScript
* [Juan Haag](https://www.linkedin.com/in/juan-haag-2054aa1b4/) - Tutor JavaScript
