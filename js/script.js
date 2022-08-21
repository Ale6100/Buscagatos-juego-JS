"use strict";

function porcentajeDeVictorias(partidasGanadas, partidasPerdidas) { // Toma la cantidad de partidas ganadas y perdidas, devuelve el porcentaje de partidas ganadas
    return (partidasGanadas + partidasPerdidas == 0) ? 0 : Math.round(partidasGanadas*100/(partidasGanadas + partidasPerdidas))
}

function inputIncorrecto(mensajeError, duracionSegundos) { // Muestra un cartel pequeño arriba a la derecha con Toastify. Lo uso para indicar valores erroneos ingresados en los inputs
    Toastify({
        text: mensajeError, // Texto del cartel
        duration: duracionSegundos*1000, // Tiempo que tarda en irse
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 127, 0))",
        }
    }).showToast();
}

function mostrarError(filas, columnas, porcent) { // Muestra un cartel con un texto distinto según sea el error del input ingresado
    if (filas < 0 || columnas < 0) {
        inputIncorrecto(`No es posible colocar filas o columnas negativas`, 4)

    } else if (filas*columnas <= 9) {
        inputIncorrecto(`Alto ahí listillo! Se necesita un mínimo de 10 casilleros`, 4)

    } else if (filas*columnas > 2500) {
        inputIncorrecto(`¿En serio quieres ${filas*columnas} casilleros? Para no forzar a tu dispositivo se permiten 2500 como máximo`, 6)

    } else { // Se ejecuta si porcent <= 0 || porcent >= 100 ya que es el último caso posible por el cual se ejecutó esta función
        inputIncorrecto(`"Gatos aproximados (%)" establece el porcentaje de gatos aproximado que deseas tener en el tablero, por lo tanto no se permite colocar ${porcent}%`, 8)
    }
}

function agregarCero(numero) { // Recibe un número y le coloca un cero adelante si es menor que 10
    return (numero < 10) ? "0"+numero : numero
}

function iniciarCronometro() {
    clearInterval(interval)  // Estas dos líneas detienen el cronómetro y colocan "00:00:00" en el cartel del cronómetro. Sirve en caso de que no sea la primera vez que iniciamos el juego
    cronometro.innerText = "00:00:00"
    let segundos = 0 // El cronómetro siempre inicia en cero segundos
    let minutos = 0
    let horas = 0
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

function crearTableroVacioHTML(filas, columnas) { // Crea un tablero vacío en el HTML
    tableroHTML.innerHTML = ""                    // Primero vacío el tablero, en caso de que estemos iniciando una nueva partida
    for (let i=0; i<filas; i++) {
        const filai = document.createElement("tr"); // Creo la cantidad de filas pedidas mediante etiquetas tr
        for (let j=0; j<columnas; j++) {
            filai.innerHTML += `
            <td id=fila-${i+1}-columna-${j+1} class="casilleroOculto">
                <p></p>
                <p></p>
            </td>
            ` // Dentro de cada fila agrego la cantidad de columnas pedidas. Las etiquetas p las voy a usar para agregar un número o una bandera
        }
        tableroHTML.append(filai) // Agrego cada fila dentro del tablero, una por una
    }
}

function crearTableroVacioJuego(filas, columnas) { // Crea un tablero con casilleros ocultos en JS
    const tablero = []              // El tablero es un array
    for (let i=0; i<filas; i++) {
        const filai = []            // Cada fila pedida es un array
        for (let j=0; j<columnas; j++) {
            const casillero = new Casillero() // Cada casillero lo represento con un objeto
            filai.push(casillero)
        }
        tablero.push(filai)
    }
    return tablero
}

function crearTableros(filas, columnas) { // Crea ambos tableros. Devuelvo el tablero de js para manipularlo más adelante
    crearTableroVacioHTML(filas, columnas)
    return crearTableroVacioJuego(filas, columnas)
}

async function mostrarConsejos(){ // Cada vez que se hace click izquierdo sobre un casillero hay un 10% de probabilidades de que se muestre un consejo al azar debajo del tablero
    if (Math.random()*100 < 10) {
        const response = await fetch('./json/data.json') // Accedo al json donde están los consejos. Esto me obliga a ejecutar el código desde un servidor para que funcione correctamente
        const data = await response.json()
        consejosRandom.innerText = `Consejo random: ${data[parseInt(Math.random()*data.length)].consejo}` // Accedo a un consejo al azar y lo agrego en la página web
    }
}

function perteneceAlTablero(filas, columnas, i, j) { // Devuelve true si tablero[i][j] pertenece al tablero. La uso para evitar errores a la hora de analizar los bordes
    return (i < 0 || j < 0 || i >= filas || j >= columnas) ? false : true
}

function analizarCasillerosVecinos(tablero, i, j) { // Recibe un tablero y una ubicación. Devuelve la cantidad de vecinos con gatos
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

function definirParametrosIniciales(direccion) { // Define el n y m inicial que van a usar las funciones expandirLinea y expandirLineaRama
    let n, m
    if (direccion == "arriba") {
        n = -1
    } else if (direccion == "abajo") {
        n = 1
    } else {
        n = 0
    }

    if (direccion == "izquierda") {
        m = -1
    } else if (direccion == "derecha") {
        m = 1
    } else {
        m = 0
    }
    return [n, m]
}

function expandirLinea(tablero, i, j, direccion) { // Esta función expande arriba, abajo, derecha o izquierda el área cuando se hace un click izquierdo sobre un casillero oculto sin gatos y sin gatos a su alrededor
    let n, m
    [n, m] = definirParametrosIniciales(direccion)
    const cambioN = n
    const cambioM = m
    let repetir = true
    do {
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
            if (tablero[i+n][j+m].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }

            tablero[i+n][j+m].visibleTexto(tablero, i+n, j+m, document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`))

            if (direccion == "arriba" || direccion == "abajo") {
                expandirLineaRama(tablero, i+n, j, "izquierda") // Expande a la izquierda y derecha del casillero tablero[i+n][j], en caso de que en la rama principal estemos expandiendo arriba o abajo
                expandirLineaRama(tablero, i+n, j, "derecha")
                n += cambioN
            } else {
                expandirLineaRama(tablero, i, j+m, "arriba")
                expandirLineaRama(tablero, i, j+m, "abajo")
                m += cambioM
            }
        } else {
            repetir = false
        }
    } while (repetir)
}

function expandirLineaRama(tablero, i, j, direccion) { // Esta función sirve para expandir de una forma similar a la de arriba pero en ubicaciones distintas a la rama original, logrando una expansión grande
    let n, m
    [n, m] = definirParametrosIniciales(direccion)
    const cambioN = n
    const cambioM = m
    let p = 0
    if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
        if (tablero[i+n][j+m].gatosVecinos == ""){
            p += 1
        } else { // Esto se va a ejecutar si en tablero[i+n][j+m] hay gatos vecinos, aunque también haya en tablero[i+n-cambioN][j+m-cambioM]
            tablero[i+n][j+m].visibleTexto(tablero, i+n, j+m, document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`))
        }
    }
    while (tablero[i+n-cambioN][j+m-cambioM].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
            (p != 0) && (tablero[i+n][j+m].visibleTexto(tablero, i+n, j+m, document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`)))
        }
        p += 1

        if (direccion == "arriba" || direccion == "abajo") {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+1)) {
                (tablero[i+n][j+1].estado != "visible") && (expandirLineaRama(tablero, i+n, j, "derecha"))
            }
    
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j-1)) {
                (tablero[i+n][j-1].estado != "visible") && (expandirLineaRama(tablero, i+n, j, "izquierda"))
            }
            n += cambioN
        } else {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+1, j+m)) {
                (tablero[i+1][j+m].estado != "visible") && (expandirLineaRama(tablero, i, j+m, "abajo"))
            }
    
            if (perteneceAlTablero(tablero.length, tablero[0].length, i-1, j+m)) {
                (tablero[i-1][j+m].estado != "visible") && (expandirLineaRama(tablero, i, j+m, "arriba"))
            }
            m += cambioM    
        }

        if (!(perteneceAlTablero(tablero.length, tablero[0].length, i+n-cambioN, j+m-cambioM))) {
            break // Si el casillero tablero[i+n-cambio, j+m-cambioM] no pertenece al tablero, entonces no necesito reiniciar el while
        }
    }
}

function expandirArea(tablero, i, j) { // Las funciones expandirLinea y expandirLineaRama trabajan juntas para expandir correctamente el área cuando se hace click sobre un casillero que no tiene gatos ni gatos a su alrededor
    expandirLinea(tablero, i, j, "arriba")
    expandirLinea(tablero, i, j, "abajo")
    expandirLinea(tablero, i, j, "izquierda")
    expandirLinea(tablero, i, j, "derecha")
}

function juegoGanado(tablero, filas, columnas, cantGatos) { // Devuelve true si ganamos el juego
    let res = false
    let casillerosVisibles = 0
    tablero.forEach( (fila) => {
        fila.forEach( (bloque) => {
            (bloque.estado == "visible") && (casillerosVisibles += 1)
        })
    });
    (filas*columnas - cantGatos == casillerosVisibles) && (res = true)
    return res
}

function actualizarRegistroPartidas(partidas, resultado) { // Actualiza la base de datos donde se guarda la cantidad de partidas ganadas y perdidas
    if (resultado == "ganar") {
        partidas.ganadas += 1
    } else {
        partidas.perdidas += 1
    }
    const porcentajePartidasGanadas = porcentajeDeVictorias(partidas.ganadas, partidas.perdidas)
    localStorage.setItem("partidasPasadas", JSON.stringify(partidas))
    victorias.innerText = `${porcentajePartidasGanadas}%`
    return porcentajePartidasGanadas // Devuelve el nuevo porcentaje de victorias
}

function despedida(tablero, resultado, cantidadDeClicks, partidas) { // Código que se ejecuta cuando terminó el juego
    const porcentajePartidasGanadas = actualizarRegistroPartidas(partidas, resultado)
    let mensaje
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

    if (resultado == "ganar") { // Alerta especial en caso de haber ganado
        if (cantidadDeClicks == 1) { // Personalizo el mensaje de victoria
            mensaje = `Has terminado luego de... ¿un click? Que suerte! Prueba de nuevo pero con un porcentaje de gatos distinto. Tu porcentaje de victorias es del ${porcentajePartidasGanadas}%`
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
        }).then( (result) => { // Reinicia el registro de partidas ganadas y perdidas, en caso de que el usuario lo decida
            if (result.isDenied) {
                Swal.fire({
                title: 'Registro de victorias eliminado',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true})
                localStorage.setItem("partidasPasadas", JSON.stringify({ganadas : 0, perdidas : 0}))
                victorias.innerText = "0%"
            }
        })
    } else { // Alerta especial en caso de haber perdido
        Swal.fire({
            title: 'Te descubrieron! 😔',
            text: "No te preocupes y vuelve a intentarlo",
            icon: 'error',
            timer: 4000,
            timerProgressBar: true,
        })
    }
    let juegoTerminado = true
    clearInterval(interval)
    return juegoTerminado
}

function primerClick(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, partidas) { // Comportamiento del primer click sobre el tablero. El primer click es especial
    let cantGatos, primerClickRealizado
    do { // Este do...while hace que siempre haya por lo menos un gato en el tablero
        cantGatos = 0
        tablero.forEach( (fila) => { // Recorro el tablero y pido que cada casillero tenga un porcent% de probabilidades de que haya un gato
            fila.forEach( (bloque) => {
                if (Math.random()*100 < porcent) {
                    bloque.gato = true
                    cantGatos += 1
                }
            })
        })

        for (let n=-1; n<=1; n++) { // Hago que tanto el primer casillero como sus vecinos no tengan gato y sean visibles
            for (let m=-1; m<=1; m++) {
                if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                    tablero[i+n][j+m].visibleTexto(tablero, i+n, j+m, casillero)
                    if (tablero[i+n][j+m].gato == true) { // Si hay un gato en la zona de nueve casilleros iniciales, lo saco
                        tablero[i+n][j+m].gato = false
                        cantGatos -= 1
                    }
                }
            }
        }
    } while (cantGatos == 0)

    tablero.forEach( (fila, k) => { // Recorro el tablero colocandole a cada casillero su número correspondiente o el símbolo de un gato
        fila.forEach( (bloque, l) => {
            const cantidadGatosVecinos = analizarCasillerosVecinos(tablero, k, l)
            bloque.gatosVecinos = cantidadGatosVecinos

            const cluster = document.getElementById(`fila-${k+1}-columna-${l+1}`)
            if (bloque.gato == true) {
                cluster.children[0].innerText = `🐈`
            } else {
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
    expandirArea(tablero, i, j)

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
        juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas)
    }

    primerClickRealizado = true
    return [cantGatos, primerClickRealizado, juegoTerminado] // Retorno los datos que necesitaré después y no se almacenan solos en otro lado
}

function clickIzquierdo(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas) { // Comportamiento del click izquierdo sobre la ubicación tablero[i, j] del tablero
    if (primerClickRealizado == false) { // Esto se ejecuta a la hora de hacer el primer click sobre el tablero
        cantidadDeClicks += 1;
        [cantGatos, primerClickRealizado, juegoTerminado] = primerClick(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, partidas)

    } else if (juegoTerminado == false && tablero[i][j].estado == "oculto") { // Esto se ejecuta si en el click anterior no se terminó el juego, y si estamos presionando sobre un casillero oculto
        cantidadDeClicks += 1
        mostrarConsejos()
        tablero[i][j].visibleTexto(tablero, i, j, casillero)

        if (tablero[i][j].gato == true) { // Esto se ejecuta si hicimos click sobre un casillero con un gato
            juegoTerminado = despedida(tablero, "perder", cantidadDeClicks, partidas)

        } else if(tablero[i][j].gatosVecinos == "") { // Esto se ejecuta si hicimos click sobre un casillero sin gatos y sin gatos alrededor
            expandirArea(tablero, i, j)
            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas)
            }

        } else { // Esto se ejecuta si hicimos click sobre un casillero sin gatos pero con gatos alrededor
            casillero.classList.remove("textoOculto")
            casillero.classList.remove("casilleroOculto")
            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, "ganar", cantidadDeClicks, partidas)
            }
        }
    }
    return [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado]
}

function clickDerecho(tablero, i, j, casillero, juegoTerminado) { // Comportamiento del click derecho sobre la ubicación tablero[i, j] del tablero. Agrega o quita banderas
    if (tablero[i][j].estado == "oculto" && juegoTerminado == false) {
        if (tablero[i][j].bandera == false) {
            tablero[i][j].visibleBandera(tablero, i, j, casillero)
        } else {
            tablero[i][j].noVisibleBandera(tablero, i, j, casillero)
        }
    }
}

const cronometro = document.getElementById("cronometro")
const tableroHTML = document.getElementById("tablero")
const form = document.getElementById("form")
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

form.addEventListener("submit", (e) => { // El juego inicia (y se reinicia) una vez que apretamos en "INICIAR"
    e.preventDefault() // Primero impido que el botón haga lo que por defecto está hecho para hacer

    const filas = document.getElementById("cantFilas").value // Obtengo los valores de los inputs
    const columnas = document.getElementById("cantColumnas").value
    const porcent = document.getElementById("dificPorcent").value

    if (filas < 0 || columnas < 0 || filas*columnas <= 9 || filas*columnas > 2500 || porcent <= 0 || porcent >= 100) { // Varios condicionales que impiden que el programa se ejcute si el usuario ingresó datos que no tienen sentido
        mostrarError(filas, columnas, porcent)

    } else {
        iniciarCronometro() // Cada vez que se inicia una nueva partida inicia el cronómetro

        datosInputs = new InputsPasados(filas, columnas, porcent)    // Creo un objeto con los valores actuales de los inputs
        localStorage.setItem("datosInputs", JSON.stringify(datosInputs)) // Guardo los valores de los inputs en el localstorage (deben ser inputs válidos, por eso están en el "else")

        if (localStorage.getItem("partidasPasadas") == null) { // Si no hay un registro de las partidas pasadas, lo crea
            localStorage.setItem("partidasPasadas", JSON.stringify({ganadas : 0, perdidas : 0}))
        }
        partidas = JSON.parse(localStorage.getItem("partidasPasadas")) // Cada vez que se inicia un nuevo juego se accede al registro de partidas ganadas y perdidas

        const cartelInicial = document.getElementById("cartelInicial")
        if (cartelInicial != null) {
            cartelInicial.remove() // Elimino el cartel incial. El if verifica que esto se ejecute sólo si estamos iniciando el juego, no reiniciándolo
        }

        const tablero = crearTableros(filas, columnas)
        let primerClickRealizado = false // Establezco que todavía no se hizo el primer click sobre el tablero
        let juegoTerminado = false       // Se va a convertir a true cuando el juego haya termnado
        let cantGatos                    // Me va a servir para contar la cantidad de gatos en el tablero
        let cantidadDeClicks = 0         // Contador de clicks en el tablero
        const consejosRandom = document.getElementById(`consejosRandom`)
        consejosRandom.innerText = ""

        tablero.forEach( (fila, i) => {
            fila.forEach( (bloque, j) => {
                const casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)

                casillero.addEventListener("click", () => {  // Establezco lo que va a suceder cuando hago un click en un casillero ("tablero[i][j]"" es lo mismo que "bloque")
                    if (bloque.bandera == false) {
                        [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado] = clickIzquierdo(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas)
                    }
                })

                casillero.addEventListener("contextmenu", (e) => { // Código para agregar o quitar banderas
                    e.preventDefault()
                    clickDerecho(tablero, i, j, casillero, juegoTerminado)
                })
            })
        })
    }
})