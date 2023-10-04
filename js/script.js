"use strict";

/**
 * Toma la cantidad de partidas ganadas y perdidas. Devuelve el porcentaje redondeado de partidas ganadas.
 *
 * @param {number} partidasGanadas - Cantidad de partidas ganadas
 * @param {number} partidasPerdidas - Cantidad de partidas ganadas
 * @return {number} El porcentaje redondeado de partidas ganadas
 */
const porcentajeDeVictorias = (partidasGanadas, partidasPerdidas) => { // Toma la cantidad de partidas ganadas y perdidas. Devuelve el porcentaje redondeado de partidas ganadas
    return (partidasGanadas + partidasPerdidas == 0) ? 0 : Math.round(partidasGanadas*100/(partidasGanadas + partidasPerdidas))
}

/**
 * Muestra un cartel pequeño arriba a la derecha con Toastify. Lo uso para indicar valores erroneos ingresados en los inputs
 *
 * @param {string} mensajeError - Texto del cartel
 * @param {number} duracionSegundos - Tiempo que tarda en irse (en segundos)
 */
const inputIncorrecto = (mensajeError, duracionSegundos) => {
    Toastify({
        text: mensajeError,
        duration: duracionSegundos*1000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, rgb(0, 0, 0), rgb(80, 80, 80))",
            border: "2px solid rgb(255, 255, 255)",
            borderRadius: "10px",
        }
    }).showToast();
}

/**
 * Muestra un cartel con un texto distinto según sea el error del input ingresado
 *
 * @param {number} filas - El número de filas ingresado
 * @param {number} columnas - El número de columnas ingresado
 */
const mostrarError = (filas, columnas) => {
    if (filas < 0 || columnas < 0) {
        inputIncorrecto(`No es posible colocar filas o columnas negativas`, 4)

    } else if (filas*columnas <= 9) {
        inputIncorrecto(`Alto ahí listillo! Se necesita un mínimo de 10 casilleros`, 4)

    } else if (filas*columnas > 2500) {
        inputIncorrecto(`¿En serio quieres ${filas*columnas} casilleros? Para no forzar a tu dispositivo se permiten 2500 como máximo`, 7)

    } else { // Se ejecuta si porcent <= 0 || porcent > 90 ya que es el último caso posible por el cual se ejecutó esta función
        inputIncorrecto('"Gatos aproximados (%)" establece el porcentaje de gatos aproximado que deseas tener en el tablero. Se permite un valor entre 1 y 90"', 9)
    }
}

/**
 * Recibe un número natural y le coloca un cero a la izquierda si es menor que 10
 * @param {number} numero
 * @returns {string | number}
 */
const agregarCero = numero => {
    return (numero < 10) ? "0"+numero : numero
}

const iniciarCronometro = () => {
    clearInterval(interval) // Estas dos líneas detienen el cronómetro y colocan "00:00:00" en su cartel correspondiente. Sirve en caso de que no sea la primera vez que iniciamos el juego
    cronometro.innerText = "00:00:00"
    let segundos = 0, minutos = 0, horas = 0
    interval = setInterval( () => { // Cada vez que se ejecuta esto, se agrega un segundo
        segundos += 1
        if (segundos == 60) { // Si los segundos llegan a 60, entonces vuelven a cero y se agrega un minuto
            segundos = 0
            minutos += 1

            if (minutos == 60) {
                minutos = 0
                horas += 1
            }
        }
        cronometro.innerText = `${agregarCero(horas)}:${agregarCero(minutos)}:${agregarCero(segundos)}` // Cada un segundo se actualiza el cronómetro
    }, 1000)
}

/**
 * Crea un tablero HTML vacío con el número especificado de filas y columnas
 *
 * @param {number} filas - El número de filas
 * @param {number} columnas - El número de columnas
 */
const crearTableroVacioHTML = (filas, columnas) => {
    tablero.classList.add("bordeTablero")
    tableroHTML.innerHTML = "" // Primero vacío el tablero, en caso de que estemos iniciando una nueva partida
    for (let i=0; i<filas; i++) {
        const filai = document.createElement("tr"); // Creo la cantidad de filas pedidas mediante etiquetas tr
        for (let j=0; j<columnas; j++) {
            filai.innerHTML += `
            <td id="fila-${i+1}-columna-${j+1}" class="casilleroOculto">
                <p></p>
                <p></p>
            </td>
            ` // Dentro de cada fila agrego la cantidad de columnas pedidas. Las etiquetas p las voy a usar para agregar un número o una bandera
        }
        tableroHTML.append(filai) // Agrego cada fila dentro del tablero, una por una
    }
}

/**
 * Crea un tablero de juego con casilleros "ocultos"
 *
 * @param {number} filas - El número de filas
 * @param {number} columnas - El número de columnas
 * @return {array} El tablero de juego
 */
const crearTableroVacioJuego = (filas, columnas) => {
    const tablero = []
    for (let i=0; i<filas; i++) {
        const filai = []
        for (let j=0; j<columnas; j++) {
            const casillero = new Casillero() // Cada casillero lo represento con un objeto
            filai.push(casillero)
        }
        tablero.push(filai)
    }
    return tablero
}

/**
 * Crea ambos tableros. Devuelve el tablero de JS para su posterior manipulación
 *
 * @param {number} filas - El número de filas para los tableros
 * @param {number} columnas - El número de columnas para los tableros
 * @return {Array} El tablero de JS vacío
 */
const crearTableros = (filas, columnas) => {
    crearTableroVacioHTML(filas, columnas)
    return crearTableroVacioJuego(filas, columnas)
}

const mostrarConsejos = async () => { // Cada vez que se hace click izquierdo sobre un casillero hay un 10% de probabilidades de que se muestre un consejo al azar debajo del tablero
    if (Math.random()*100 < 10) {
        try {
            const response = await fetch('./json/data.json') // Accedo al json donde están los consejos. Esto me obliga a ejecutar el código desde un servidor para que funcione correctamente. Estoy consciente de que no era necesario hacer un json para esto, pero era mi primera vez haciendo uno y quería demostrar que podía darle uso
            const data = await response.json()
            consejosRandom.innerText = `Consejo random: ${data[Math.floor(Math.random()*data.length)].consejo}` // Accedo a un consejo al azar y lo agrego en la página web
        } catch {
            console.error("Error! Para utilizar este sitio correctamente debes ejecutar el proyecto desde un servidor. Te recomiendo la extensión Live Server en caso de que uses Visual Studio Code o visitar la última versión oficial en https://buscagatos.netlify.app")
        }
    }
}

/**
 * Devuelve true si tablero[i][j] pertenece al tablero. Se utiliza para evitar errores al analizar los bordes
 *
 * @param {number} filas - El número de filas en el tablero
 * @param {number} columnas - El número de columnas en el tablero
 * @param {number} i - El índice de fila
 * @param {number} j - El índice de columna
 * @return {boolean} true si la celda pertenece al tablero, false en caso contrario
 */
const perteneceAlTablero = (filas, columnas, i, j) => { // Devuelve true si tablero[i][j] pertenece al tablero. Lo uso para evitar errores a la hora de analizar los bordes
    return i >= 0 && j >= 0 && i < filas && j < columnas
}

/**
 * Recibe un tablero y una ubicación. Dicha ubicación será en un casillero sin gato. La función devuelve su cantidad de gatos vecinos
 *
 * @param {array} tablero - El tablero de juego
 * @param {number} i - El índice de fila de la ubicación
 * @param {number} j - El índice de columna de la ubicación
 * @return {number | ""} La cantidad de gatos vecinos
 */
const contarGatosVecinos = (tablero, i, j) => {
    let cantidadDeGatosVecinos = 0
    for (let n=-1; n<=1; n++) {
        for (let m=-1; m<=1; m++) {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                (tablero[i+n][j+m].gato == true) && (cantidadDeGatosVecinos += 1) // Si encontramos un gato vecino aumentamos el contador
            }
        }
    }
    (cantidadDeGatosVecinos == 0) && (cantidadDeGatosVecinos = "") // Si el contador quedó en cero, lo definimos como un string vacío
    return cantidadDeGatosVecinos
}

/**
 * Expande el área de un casillero y sus vecinos sin bandera cuando se analiza un casillero que no tiene gatos ni gatos a su alrededor
 *
 * @param {array} tablero - El tablero en el que se encuentra el casillero
 * @param {number} i - El índice de fila del casillero
 * @param {number} j - El índice de columna del casillero
 */
const expandirArea = (tablero, i, j) => {
    for (let n=-1; n<=1; n++) {
        for (let m=-1; m<=1; m++) {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                if (tablero[i+n][j+m].bandera == false) {
                    if ((tablero[i+n][j+m].gatosVecinos == "") && !(n==0 && m==0) && tablero[i+n][j+m].estado == "oculto")  {
                        expandirArea(tablero, i+n, j+m)
                    }
                    tablero[i+n][j+m].estado = "visible"
                    const casillero = document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`)
                    if (!casillero.classList.contains("visibleTexto")) { // Quiero que se borre el texto en los casilleros que todavía no fueron coloreados
                        casillero.children[0].classList.add("textoOculto")
                    }
                }
            }
        }
    }
}

/**
 * Entra a la función expandirArea para analizar los casilleros vecinos de la ubicación del primer click. Recordemos que el primer casillero siempre será visible y no habrá ningún gato, al igual que sus vecinos
 *
 * @param {Array} tablero - El tablero de juego
 * @param {number} i - El índice de fila de la primera celda clickeada
 * @param {number} j - El índice de columna de la primera celda clickeada
 */
const expandirAreaPrimerClick = (tablero, i, j) => { 
    for (let n=-1; n<=1; n++) {
        for (let m=-1; m<=1; m++) {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                if ((tablero[i+n][j+m].gatosVecinos == "") && !(n==0 && m==0) && (tablero[i+n][j+m].bandera == false))  {
                    expandirArea(tablero, i+n, j+m)
                }
            }
        }
    }
}

/**
 * Esta función expande el área de manera análoga a la función "expandirArea", con la diferencia de que pinta los casilleros con un retraso para dar un efecto de animación
 * La llamo "Area falsa" porque el área afectada es la del DOM, no la del tablero JS que maneja la lógica importante (de esa ya se encarga la función expandirArea)
 *
 * @param {array} tablero - El tablero del juego
 * @param {number} i - El índice de la fila actual
 * @param {number} j - El índice de la columna actual
 */
const expandirAreaFalsa = (tablero, i, j) => {
    for (let n=-1; n<=1; n++) {
        for (let m=-1; m<=1; m++) {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                if (tablero[i+n][j+m].bandera == false) {
                    setTimeout(() => {
                        const casillero = document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`)
                        if ((tablero[i+n][j+m].gatosVecinos == "") && !(n==0 && m==0) && casillero.classList.contains("casilleroOculto")) {
                            expandirAreaFalsa(tablero, i+n, j+m)
                        }
                        tablero[i+n][j+m].visibleTexto(tablero, i+n, j+m, casillero)
                    }, 20);
                }
            }
        }
    }
}

/**
 * Verifica si se ganó el juego
 *
 * @param {array} tablero - El tablero del juego
 * @param {number} filas - El número de filas
 * @param {number} columnas - El número de columnas
 * @param {number} cantGatos - El número de gatos
 * @return {boolean} - true si se ha ganado el juego, false en caso contrario
 */
const juegoGanado = (tablero, filas, columnas, cantGatos) => {
    let casillerosVisibles = 0
    tablero.forEach( fila => {
        fila.forEach( bloque => {
            (bloque.estado == "visible") && (casillerosVisibles += 1)
        })
    });
    return (filas*columnas - cantGatos == casillerosVisibles) ? true : false
}

/**
 * Actualiza el localStorage donde se almacena la cantidad de partidas ganadas, perdidas y perdidas continuamente
 *
 * @param {Object} partidas - El objeto que contiene la información de las partidas
 * @param {"ganar" | "perder"} resultado - El resultado de la partida
 * @return {Array} - El nuevo porcentaje de victorias y el objeto "partidas" actualizado
 */
const actualizarRegistroPartidas = (partidas, resultado) => {
    if (resultado == "ganar") {
        partidas.ganadas += 1
        partidas.perdidasContinuas = 0 // partidas.perdidasContinuas es el número de partidas que se perdieron continuamente
    } else if (resultado == "perder") {
        partidas.perdidas += 1
        partidas.perdidasContinuas += 1
    } else {
        console.error("No se ha podido actualizar el registro de partidas");
    }
    const porcentajePartidasGanadas = porcentajeDeVictorias(partidas.ganadas, partidas.perdidas)
    localStorage.setItem("partidasPasadas", JSON.stringify(partidas))
    victorias.innerText = `${porcentajePartidasGanadas}%`
    return [porcentajePartidasGanadas, partidas]
}

/**
 * Alertas especiales al finalizar cada partida
 *
 * @param {"ganar" | "perder"} resultado - El resultado de la partida
 * @param {number} cantidadDeClicks - La cantidad de clicks realizados
 * @param {object} partidas - El objeto que contiene la información de las partidas
 * @param {boolean} inputsOriginales - Indica si se usaron los valores originales de los inputs
 */
const alertasEspeciales = (resultado, cantidadDeClicks, partidas, inputsOriginales) => {
    let porcentajePartidasGanadas, mensaje
    [porcentajePartidasGanadas, partidas] = actualizarRegistroPartidas(partidas, resultado)
    if (resultado == "ganar") { // Alerta especial en caso de haber ganado
        if (cantidadDeClicks == 1) {
            mensaje = `Has terminado luego de... ¿un click? Qué suerte! Prueba de nuevo pero con unas condiciones iniciales distintas. Tu porcentaje de victorias es del ${porcentajePartidasGanadas}%`
        } else {
            mensaje = `Has terminado luego de ${cantidadDeClicks} clicks! Tu porcentaje de victorias es del ${porcentajePartidasGanadas}%`
        }

        Swal.fire({
            title: 'Bien hecho! Remy te lo agradece ❤️',
            text: mensaje,
            imageUrl: './img/remy.webp',
            imageWidth: 250,
            imageHeight: 250,
            imageAlt: 'Custom image',
            confirmButtonText: 'OK',
            showDenyButton: true,
            denyButtonText: `Eliminar registro`,
            customClass: {
                confirmButton: 'completedGame', // Clase para facilitarle el seguimiento a Tag Manager
            },
        }).then( result => { // Reinicia el registro de partidas, en caso de que el usuario lo decida
            if (result.isDenied) {
                Swal.fire({
                icon: 'success',
                title: 'Registro de victorias eliminado',
                timer: 3000,
                timerProgressBar: true})
                localStorage.setItem("partidasPasadas", JSON.stringify({ganadas : 0, perdidas : 0, perdidasContinuas : 0}))
                victorias.innerText = "0%"
            }
        })
    } else { // Alerta especial en caso de haber perdido
        Swal.fire({
            icon: 'error',
            title: 'Te descubrieron! 😔',
            text: "No te preocupes y vuelve a intentarlo",
            customClass: {
                confirmButton: 'failedGame',
            },
        }).then( result => {
            // Si perdiste 5 veces seguidas o más, hay un 10% de probabilidades de que te sugiera colocar los inputs por defecto, en caso de que no estén puestos
            if (result.isConfirmed && partidas.perdidasContinuas >= 5 && Math.random()*100 < 10 && inputsOriginales == false) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Alto! Estás perdiendo muy seguido',
                    text: "Deseas restablecer el número de filas (11), columnas (11) y gatos aproximados (15%) en la siguiente partida?",
                    confirmButtonText: 'Aceptar',
                    showDenyButton: true,
                    denyButtonText: `Rechazar`
                }).then( result => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Valores restablecidos',
                            timer: 3000,
                            timerProgressBar: true
                        })
                        document.getElementById("cantFilas").value = 11 // Deben coincidir con los parámetros por defecto en el index.html
                        document.getElementById("cantColumnas").value = 11
                        document.getElementById("dificPorcent").value = 15
                    }
                })
            }
        })
    }
}

/**
 * Se ejecuta cuando terminó el juego
 *
 * @param {Array} tablero - El tablero del juego
 * @param {"ganar" | "perder"} resultado - El resultado del juego
 * @param {number} cantidadDeClicks - La cantidad de clicks realizados durante el juego
 * @param {number} partidas - El objeto que contiene la información de las partidas
 * @param {number} porcent - El porcentaje de celdas con gatos solicitados por el usuario
 * @return {boolean} true
 */
const despedida = (tablero, resultado, cantidadDeClicks, partidas, porcent) => {
    tablero.forEach( (fila, k) => {
        fila.forEach( (bloque, l) => {
            if (bloque.gato == true) { // Hago que los gatos aparezcan con un color de fondo u otro en caso de haber perdido o ganado
                const casilleroConGato = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                bloque.visibleTexto(tablero, k, l, casilleroConGato)

                if (resultado == "perder") {
                    casilleroConGato.classList.add("colorPerdedorFondo")
                } else {
                    casilleroConGato.classList.add("colorGanadorFondo")
                }
            }
        })
    })
    let inputsOriginales = tablero.length == 11 && tablero[0].length == 11 && porcent == 15 // Devuelve true si los inputs colocados son los que vienen por defecto en el index.html
    alertasEspeciales(resultado, cantidadDeClicks, partidas, inputsOriginales)
    clearInterval(interval)
    return true
}

/**
 * Comportamiento del primer click izquierdo sobre el tablero. El primer click es especial
 *
 * @param {array} tablero - El tablero del juego
 * @param {number} filas - La cantidad de filas
 * @param {number} columnas - La cantidad de columnas
 * @param {number} i - El índice de la fila actual
 * @param {number} j - El índice de la columna actual
 * @param {number} porcent - El porcentaje de celdas con gatos solicitados por el usuario
 * @param {number} cantidadDeClicks - La cantidad de clicks realizados en el juego
 * @param {number} partidas - El objeto que contiene la información de las partidas
 * @return {array} - Un arreglo con la cantidad de gatos, un valor true y un valor booleano que indica si el juego terminó
 */
const primerClick = (tablero, filas, columnas, i, j, porcent, cantidadDeClicks, partidas) => {
    let cantGatos
    do { // Este do...while hace que siempre haya por lo menos un gato en el tablero
        cantGatos = 0
        tablero.forEach( fila => { // Recorro el tablero y pido que cada casillero tenga un porcent% de probabilidades de que haya un gato
            fila.forEach( bloque => {
                if (Math.random()*100 < porcent) {
                    bloque.gato = true
                    cantGatos += 1
                }
            })
        })

        for (let n=-1; n<=1; n++) { // Hago que tanto el primer casillero descubierto como sus vecinos no tengan gato. También pido que sean visibles siempre y cuando no tengan bandera
            for (let m=-1; m<=1; m++) {
                if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                    if (tablero[i+n][j+m].gato == true) {
                        tablero[i+n][j+m].gato = false
                        cantGatos -= 1
                    }
                }
            }
        }
    } while (cantGatos == 0)

    tablero.forEach( (fila, k) => { // Recorro el tablero colocando en cada casillero su número correspondiente o el símbolo de un gato
        fila.forEach( (bloque, l) => {
            const cluster = document.getElementById(`fila-${k+1}-columna-${l+1}`)
            if (bloque.gato == true) {
                cluster.children[0].innerText = `🐱`
            } else {
                const cantidadGatosVecinos = contarGatosVecinos(tablero, k, l)
                bloque.gatosVecinos = cantidadGatosVecinos
                cluster.children[0].innerText = `${cantidadGatosVecinos}`
                if (cantidadGatosVecinos <= 2) { // Le asigno colores a los números
                    cluster.children[0].classList.add("colorVerde")

                } else if (cantidadGatosVecinos <= 4) {
                    cluster.children[0].classList.add("colorAmarillo")

                } else {
                    cluster.children[0].classList.add("colorRojo")
                }
            }
        })
    })
    expandirAreaPrimerClick(tablero, i, j)
    expandirAreaFalsa(tablero, i, j)

    tablero.forEach( (fila, k) => { // Oculto todos los casilleros que no se deben descubrir con el primer click
        fila.forEach( (bloque, l) => {
            const cluster = document.getElementById(`fila-${k+1}-columna-${l+1}`)
            if (bloque.estado == "oculto") {
                cluster.children[0].classList.add("textoOculto")
            }
        })
    })

    let juegoTerminado = false
    if (juegoGanado(tablero, filas, columnas, cantGatos)) {
        juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas, porcent)
    }
    return [cantGatos, true, juegoTerminado] // Retorno los datos que necesitaré después y no se almacenan solos en otro lado
}

/**
 * Comportamiento del click izquierdo sobre la ubicación tablero[i][j] del tablero
 *
 * @param {array} tablero - El tablero del juego
 * @param {number} filas - El número de filas
 * @param {number} columnas - El número de columnas
 * @param {number} i - El índice de la fila actual
 * @param {number} j - El índice de la columna actual
 * @param {number} porcent - El porcentaje de celdas con gatos solicitados por el usuario
 * @param {object} casillero - El casillero en el que se hizo click
 * @param {number} cantidadDeClicks - La cantidad total de clicks realizados en el juego
 * @param {boolean} primerClickRealizado - Indica si se ha realizado el primer click en el juego
 * @param {number} cantGatos - La cantidad de gatos en el tablero
 * @param {boolean} juegoTerminado - Indica si el juego ha terminado
 * @param {number} partidas - El objeto que contiene la información de las partidas
 * @return {array} Un array que contiene varios valores pasados como parámetro pero modificados para llevarlos a otro lado
 */
const clickIzquierdo = (tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas) => {
    if (primerClickRealizado == false) { // Este if se ejecuta a la hora de hacer el primer click sobre el tablero
        cantidadDeClicks += 1;
        [cantGatos, primerClickRealizado, juegoTerminado] = primerClick(tablero, filas, columnas, i, j, porcent, cantidadDeClicks, partidas)

    } else if (juegoTerminado == false && casillero.classList.contains("casilleroOculto")) { // Esto se ejecuta si en el click anterior no se terminó el juego, y si estamos presionando sobre un casillero oculto
        cantidadDeClicks += 1
        mostrarConsejos()
        tablero[i][j].visibleTexto(tablero, i, j, casillero)

        if (tablero[i][j].gato == true) { // Esto se ejecuta si hicimos click sobre un casillero con un gato
            juegoTerminado = despedida(tablero, "perder", cantidadDeClicks, partidas, porcent)
            casillero.classList.add("colorMarcado")

        } else if(tablero[i][j].gatosVecinos == "") { // Esto se ejecuta si hicimos click sobre un casillero sin gatos y sin gatos a su alrededor
            expandirArea(tablero, i, j)
            expandirAreaFalsa(tablero, i, j)

            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas, porcent)
            }

        } else { // Esto se ejecuta si hicimos click sobre un casillero sin gatos pero con gatos a su alrededor
            casillero.classList.remove("textoOculto")
            casillero.classList.remove("casilleroOculto")
            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas, porcent)
            }
        }
    }
    return [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado]
}

/**
 * Comportamiento del click derecho sobre la ubicación tablero[i][j] del tablero. Agrega o quita banderas
 *
 * @param {array} tablero - El tablero de juego
 * @param {number} i - El índice de la fila actual
 * @param {number} j - El índice de la columna actual
 * @param {object} casillero - El casillero del tablero
 * @param {boolean} juegoTerminado - Indica si el juego ha terminado
 */
const clickDerecho = (tablero, i, j, casillero, juegoTerminado) => {
    if (casillero.classList.contains("casilleroOculto") && !juegoTerminado) {
        if (tablero[i][j].bandera == false) { // Si el casillero no tenía bandera, la coloca
            tablero[i][j].visibleBandera(tablero, i, j, casillero)
        } else {
            tablero[i][j].noVisibleBandera(tablero, i, j, casillero)
        }
    }
}

const cronometro = document.getElementById("cronometro")
const tableroHTML = document.getElementById("tablero")
const victorias = document.getElementById("victorias")

let datosInputs, interval, partidas

if (localStorage.getItem("datosInputs") != null) { // En caso de que ya exista información con clave "datosInputs" en el localstorage, la agrega a los valores de los inputs
    datosInputs = JSON.parse(localStorage.getItem("datosInputs"))
    document.getElementById("cantFilas").value = datosInputs.filas
    document.getElementById("cantColumnas").value = datosInputs.columnas
    document.getElementById("dificPorcent").value = datosInputs.porcentGatos
}

if (localStorage.getItem("partidasPasadas") != null) { // En caso de que ya exista el registro de las partidas pasadas, usa esos datos para escribir el porcentaje de victorias en el texto de la etiqueta con id "victorias"
    partidas = JSON.parse(localStorage.getItem("partidasPasadas"))
    victorias.innerText = `${porcentajeDeVictorias(partidas.ganadas, partidas.perdidas)}%`
}

document.getElementById("form").addEventListener("submit", e => { // El juego inicia (o se reinicia) una vez que apretamos en "INICIAR"
    e.preventDefault()

    const filas = document.getElementById("cantFilas").value // Obtengo los valores de los inputs
    const columnas = document.getElementById("cantColumnas").value
    const porcent = document.getElementById("dificPorcent").value

    if (filas < 0 || columnas < 0 || filas*columnas <= 9 || filas*columnas > 2500 || porcent <= 0 || porcent > 90) { // Varias condiciones que impiden que el programa se ejcute si el usuario ingresó datos erroneos en los inputs
        mostrarError(filas, columnas)

    } else {
        iniciarCronometro() // Cada vez que se inicia una nueva partida inicia el cronómetro

        datosInputs = new InputsPasados(filas, columnas, porcent)
        localStorage.setItem("datosInputs", JSON.stringify(datosInputs)) // Guardo los valores de los inputs en el localstorage (deben ser inputs válidos, por eso están en el "else")

        if (localStorage.getItem("partidasPasadas") == null) { // Si no hay un registro de las partidas pasadas, lo crea
            localStorage.setItem("partidasPasadas", JSON.stringify({ganadas : 0, perdidas : 0, perdidasContinuas : 0}))
        }
        partidas = JSON.parse(localStorage.getItem("partidasPasadas")) // Cada vez que se inicia un nuevo juego se accede al registro de partidas ganadas, perdidas y perdidas continuas

        const cartelInicial = document.getElementById("cartelInicial")
        if (cartelInicial != null) {
            cartelInicial.remove() // Elimino el cartel incial. El if verifica que esto se ejecute sólo si estamos iniciando el juego, no reiniciándolo
        }

        const tablero = crearTableros(filas, columnas)
        let primerClickRealizado = false // Establezco que todavía no se hizo el primer click sobre el tablero
        let juegoTerminado = false // Se va a convertir a true cuando el juego haya termnado
        let cantGatos // Me va a servir para contar la cantidad de gatos en el tablero
        let cantidadDeClicks = 0 // Contador de clicks izquierdos sobre el tablero
        const consejosRandom = document.getElementById(`consejosRandom`)
        consejosRandom.innerText = ""

        tablero.forEach( (fila, i) => {
            fila.forEach( (bloque, j) => {
                const casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)

                casillero.addEventListener("click", () => { // Establezco lo que va a suceder cuando hago un click en un casillero. Aclaro que "tablero[i][j]" es lo mismo que "bloque"
                    if (bloque.bandera == false) {
                        [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado] = clickIzquierdo(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas)
                    }
                })

                casillero.addEventListener("contextmenu", e => { // Código para agregar o quitar banderas
                    e.preventDefault()
                    clickDerecho(tablero, i, j, casillero, juegoTerminado)
                })
            })
        })
    }
})
