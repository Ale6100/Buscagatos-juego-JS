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

* Se pueden personalizar las dimensiones del tablero siempre y cuando tenga entre 10 y 2500 casilleros.

El límite máximo se colocó para evitar que alguien coloque un número muy grande, provocando que su dispositivo no responda con fluidez. Sin embargo puede modificarse en el condicional ```if``` que ejecuta la función ```mostrarError```.

* Se puede establecer un porcentaje de gatos aproximado entre 1% y 99%, siempre y cuando sea un número entero

* Si se intenta personalizar el tablero con parámetros fuera de los rangos mencionados anteriormente, el juego no se inicia y te enseña el problema usando la librería Toastify.

* Los parámetros válidos se almacenan cada vez que una partida se inició de tal manera que, si el jugador sale del sitio y entra en otro momento, dichos parámetros quedan guardados gracias al localstorage.

* El botón con valor "INICIAR" es el que inicia gran parte del código ya que ese sería el punto de partida (el que inicia el juego). Está configurado para poder volver a empezar con un tablero distinto en cualquier momento en caso de que así lo queramos.

* Con el click derecho se puede colocar banderas como en un buscaminas de verdad. Hacer click izquierdo sobre un casillero con bandera no produce ningún efecto. En móvil o tablet se puede simular dejando presionado el dedo un par de segundos sobre un casillero. Hice responsive la página motivado por este hecho.

* A medida que el juego avanza aparecen pequeños consejos al azar debajo del tablero (actualmente son 15). No aparecen siempre para no ser pesado con el jugador.

* Las áreas se expanden con un efecto animado.

* Cuando el juego termina claramente hay dos opciones: perder o ganar. Los casilleros con gatos aparecen con un color claro de fondo y una alerta especial con Sweet Alert 2 felicitándote si el jugador ganó, o con color de fondo oscuro y una alerta similar a la anterior pero tratando de darte ánimos para hacerlo de nuevo si se perdió. Además cuando se pierde se marca con fondo negro el casillero con gato donde se presionó.

* La alerta que aparece cuando el usuario ganó tiene dos funcionalidades extra: la primera funcionalidad te dice la cantidad de clicks que te tomó ganar la partida (se contabilizan los clicks izquierdos sobre casilleros ocultos en el tablero), la segunda funcionalidad es que te dice el porcentaje de veces que ganaste el juego, utilizando una base de datos guardada en el localstorage que almacena la cantidad de veces que ganaste y perdiste una partida (iniciar una partida y no terminarla no modifica esa base de datos, ya que en esos casos no se pierde ni gana). Que esté en el localstorage también implica que ese porcentaje se guarda en caso de que volvamos a la página en otro momento. Esa base de datos puede reiniciarse apretando en el botón "Eliminar registro" en esta misma alerta que estoy mencionando.

* Si el juego detecta que perdiste 5 veces seguidas o más, hay un 10% de probabilidades de que te sugiera colocar los inputs por defecto, en caso de que no estén puestos. Si aceptás la oferta se colocan por sí solos los inputs que vienen por defecto (11 filas, 11 columnas y 15% de gatos aproximados)

* Hay dos carteles al lado del botón que inicia el juego: uno que representa a un cronómetro y otro el porcentaje de victorias. El primero inicia (y se reinicia) cada vez que el usuario aprieta en el botón "INICIAR", y se detiene cuando el juego termina para que pueda ver cuanto tiempo le tomó esa partida. Por otro lado el cartel de victorias se actualiza cada vez que se termina el juego.

* No es posible continuar jugando cuando el juego ya terminó (parece obvio pero aclaro que eso también lo tuve en cuenta). Esto quiere decir que los clicks que hacemos en el tablero ya no tienen ningún efecto sobre él. En caso de querer iniciar de nuevo es necesario apretar en el botón "INICIAR".

## Autores ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)

## Expresiones de Gratitud 🎁

* [Francisco Pugh](https://www.linkedin.com/in/francisco-pugh/) - Profesor JavaScript
* [Juan Haag](https://www.linkedin.com/in/juan-haag-2054aa1b4/) - Tutor JavaScript
