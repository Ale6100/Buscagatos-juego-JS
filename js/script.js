const tableroHTML = document.getElementById("tablero")

let datosInputs
if (localStorage.getItem("datosInputs") != null) { // En caso de que exista información con clave "datosInputs" la agrega a los valores de los inputs
    datosInputs = JSON.parse(localStorage.getItem("datosInputs")) // Devuelve un objeto js
    let filasInput = document.getElementById("cantFilas")
    filasInput.value = datosInputs.filas
    let columnasInput = document.getElementById("cantColumnas")
    columnasInput.value = datosInputs.columnas
    let porcentInput = document.getElementById("dificPorcent")
    porcentInput.value = datosInputs.porcentGatos
}

function inputIncorrecto(etiquetaP) { // Agrega un texto distinto según sea el error del input ingresado. También borra el contenido del tablero
    cartelInicial.innerHTML = etiquetaP
    tableroHTML.innerHTML = ""
}

function crearTableroVacioHTML(filas, columnas) { // Crea un tablero vacío en el HTML
    tableroHTML.innerHTML = ""                    // Primero vacío el tablero
    for (let i=0; i<filas; i++) { 
        let filai = document.createElement("tr"); // Creo la cantidad de filas pedidas mediante etiquetas tr
        for (let j=0; j<columnas; j++) { 
            filai.innerHTML += `<td id=fila-${i+1}-columna-${j+1} class="casilleroOculto"> </td>` // Dentro de cada fila agrego la cantidad de columnas pedidas
        }
        tableroHTML.append(filai) // Agrego cada fila dentro del tablero, una por una
    }
}

function crearTableroVacioJuego(filas, columnas) { // Crea un tablero con casilleros ocultos en JS
    let tablero = []              // El tablero es un array
    for (let i=0; i<filas; i++) { 
        let filai = []            // Cada fila pedida es un array
        for (let j=0; j<columnas; j++) { 
            const casillero = new Casillero() // Cada casillero lo represento con un objeto 
            filai.push(casillero) // Cada elemento del tablero es una fila distinta
        }
        tablero.push(filai)
    }
    return tablero
}

function crearTableros(filas, columnas) { // Crea ambos tableros
    crearTableroVacioHTML(filas, columnas)
    return crearTableroVacioJuego(filas, columnas)
}

function perteneceAlTablero(filas, columnas, i, j) { // Devuelve true si tablero[i][j] pertenece al tablero. La uso para evitar errores a la hora de analizar los bordes
    let res = true
    if (i < 0 || j < 0 || i >= filas || j >= columnas) {
        res = false
    }
    return res
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
    (cantidadDeGatosVecinos == 0) && (cantidadDeGatosVecinos = "")
    return cantidadDeGatosVecinos
}

function expandirLineaArribaYAbajo(tablero, i, j, direccion) { // Esta función expande arriba o abajo el área cuando se hace un click
    let n = (direccion == "arriba") ? -1 : 1 // si dirección es "arriba" entonces n=-1, sino n=1
    let cambio = n
    let repetir = true
    do {
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j)) {
            if (tablero[i+n][j].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }

            tablero[i+n][j].visible(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`))

            expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "izquierda")
            expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "derecha")

            n += cambio
        } else {
            repetir = false
        }
    } while (repetir)
}

function expandirLineaIzquierdaYDerecha(tablero, i, j, direccion) { // Esta función expande izquierda o derecha el área cuando se hace un click
    let n = (direccion == "izquierda") ? -1 : 1 
    let cambio = n
    let repetir = true
    do {
        if (perteneceAlTablero(tablero.length, tablero[0].length, i, j+n)) {
            if (tablero[i][j+n].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }
            tablero[i][j+n].visible(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`))
            
            expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba")
            expandirLineaArribaYAbajoRama(tablero, i, j+n, "abajo")

            n += cambio
        } else {
            repetir = false
        }
    } while (repetir)
}

function expandirLineaArribaYAbajoRama(tablero, i, j, direccion) { // Esta función y la de abajo se llaman una y otra vez hasta que todo área se expanda correctamente
    let n = (direccion == "arriba") ? -1 : 1
    let cambio = n
    try {
        let p = 0
        if (tablero[i+n][j].gatosVecinos == ""){
            p += 1
        } else { // Quiero que esto se ejecute sólo si en tablero[i+n][j] hay gatos, aunque también haya en tablero[i][j+n-cambio]
            tablero[i+n][j].visible(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`))
        }

        while (tablero[i+n-cambio][j].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia

            (p != 0) && (tablero[i+n][j].visible(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`)))
            p += 1
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+1)) {
                (tablero[i+n][j+1].estado != "visible") && (expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "derecha"))
            }
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j-1)) {
                (tablero[i+n][j-1].estado != "visible") && (expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "izquierda"))
            }
            n += cambio
        }
    } catch {}
}

function expandirLineaIzquierdaYDerechaRama(tablero, i, j, direccion) {
    let n = (direccion == "izquierda") ? -1 : 1
    let cambio = n
    try {
        let p = 0
        if (tablero[i][j+n].gatosVecinos == "") {
            p += 1
        } else { 
            tablero[i][j+n].visible(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`))
        }

        while (tablero[i][j+n-cambio].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia

            (p != 0) && (tablero[i][j+n].visible(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`)))
            p += 1
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+1, j+n)) {
                (tablero[i+1][j+n].estado != "visible") && (expandirLineaArribaYAbajoRama(tablero, i, j+n, "abajo"))
            }
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i-1, j+n)) {
                (tablero[i-1][j+n].estado != "visible") && (expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba"))   
            }
            n += cambio
        }
    } catch {}
}

function expandirArea(tablero, i, j) {
    expandirLineaArribaYAbajo(tablero, i, j, "arriba") // Expande el area arriba
    expandirLineaArribaYAbajo(tablero, i, j, "abajo") // Expande el area abajo
    expandirLineaIzquierdaYDerecha(tablero, i, j, "izquierda") // Expande el area a la izquierda
    expandirLineaIzquierdaYDerecha(tablero, i, j, "derecha") // Expande el area a la derecha
}

function juegoGanado(tablero, filas, columnas, cantGatos) { // Devuelve true si ganamos el juego
    let res = false
    let casillerosVisibles = 0
    for (let i=0; i<filas; i++) { 
        for (let j=0; j<columnas; j++) {
            (tablero[i][j].estado == "visible") && (casillerosVisibles += 1)
        }
    }
    (filas*columnas - cantGatos == casillerosVisibles) && (res = true)
    return res
}

function despedida(tablero, filas, columnas, condicion, mensaje) {
    for (let k=0; k<filas; k++) {
        for (let l=0; l<columnas; l++) {
            if (tablero[k][l].gato == true) {
                let casilleroConGato = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                casilleroConGato.classList.remove("textoOculto")
                casilleroConGato.classList.remove("casilleroOculto")
                
                if (condicion == "perder") {
                    casilleroConGato.classList.add("colorPerdedorFondo")
                } else {
                    casilleroConGato.classList.add("colorGanadorFondo")
                }
            }
        }
    }
    mensajeFinal.innerText = mensaje    
}

const botonIniciarJuego = document.getElementById("form")

botonIniciarJuego.addEventListener("submit", (e) => { // Le creo un evento al botón "Iniciar Juego"
    e.preventDefault() // Primero prevengo que haga lo que por defecto está hecho para hacer. Prevengo que actualice la página
    
    const cartelInicial = document.getElementById("cartelInicial")
    cartelInicial.innerHTML = "" // Borro el texto inicial
    
    const filas = document.getElementById("cantFilas").value // Obtengo los valores de los inputs
    const columnas = document.getElementById("cantColumnas").value
    const porcent = document.getElementById("dificPorcent").value

    if (filas < 0) { // Varios condicionales que impiden que el programa se ejcute si el usuario ingresó datos que no tienen sentido
        inputIncorrecto(`<p>¿${filas} filas? Ya quisieras. Por favor cambia ese número</p>`)
    
    } else if (columnas < 0) {
        inputIncorrecto(`<p>Acá habría una linda tabla si no me pidieras ${columnas} columnas</p>`)
    
    } else if (filas*columnas <= 9) { 
        inputIncorrecto(`<p>Alto ahí listillo! Se necesita un mínimo de 10 casilleros</p>`)
    
    } else if (filas*columnas > 2500) {
        inputIncorrecto(`<p>En serio quieres ${filas*columnas} casilleros? Para que tu compu no explote se permiten 2500 como máximo</p>`)

    } else if (porcent <= 0 || porcent >= 100) {
        inputIncorrecto(`<p>"Gatos aproximados (%)" establece el porcentaje de gatos aproximado que deseas tener en el tablero, por lo tanto no tiene sentido colocar ${porcent}%</p>`)

    } else {
        let datosInputs = new InputsPasados(filas, columnas, porcent)    // Creo un objeto con los valores actuales de los inputs
        localStorage.setItem("datosInputs", JSON.stringify(datosInputs)) // Esto guarda los valores de los inputs (deben ser inputs válidos, por eso están en el else) para la siguiente vez que se quiera abrir la página
        
        const tablero = crearTableros(filas, columnas) // Creo los tableros según la cantidad de filas y columnas en los inputs
        let primerClickRealizado = false // Establezco que todavía no se hizo el primer click en el tablero
        let juegoTerminado = false       // Se va a convertir a true cuando el juego haya termnado
        let cantGatos                    // Me va a servir para contar la cantidad de gatos en el tablero
        let cantidadDeClicks = 0         // Contador de clicks en el tablero
        const mensajeFinal = document.getElementById(`mensajeFinal`) // Mensaje final anunciando si perdimos o ganamos
        mensajeFinal.innerText = ""      // Cada vez que inicio el juego se vacía este texto

        for (let i=0; i<filas; i++) { 
            for (let j=0; j<columnas; j++) { 
                const casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)
                casillero.addEventListener("click", () => {  // Establezco lo que va a suceder cuando hago un click en un casillero cualquiera (en particular, en tablero[i][j])
                    cantidadDeClicks += 1
                    if (primerClickRealizado == false) { // Todo esto se va a ejecutar a la hora de hacer el primer click sobre el tablero. El primer click es distinto a los demáses
                        tablero[i][j].visible(tablero, i, j, casillero)
                        
                        do { // Este do hace que siempre haya por lo menos un gato en el tablero
                            cantGatos = 0
                            for (let k=0; k<filas; k++) { // Este for coloca gatos aleatoriamente
                                for (let l=0; l<columnas; l++) {
                                    if (Math.random()*100 < porcent) {
                                        tablero[k][l].gato = true
                                        cantGatos += 1
                                    }
                                    
                                }
                            }
                        
                            for (let n=-1; n<=1; n++) { // Hago que el primer casillero visible no tenga gato, ni sus vecinos
                                for (let m=-1; m<=1; m++) {
                                    if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                                        tablero[i+n][j+m].visible(tablero, i+n, j+m, casillero) // Aprovecho y hago visible a los casilleros al rededor de donde hago el primer click, ya que sabemos que ahí no hay gatos
                                        if (tablero[i+n][j+m].gato == true) { // Si hay un gato en la zona de nueve casilleros iniciales, lo saco
                                            tablero[i+n][j+m].gato = false
                                            cantGatos -= 1
                                        }
                                    }
                                }
                            }
                        } while (cantGatos == 0)

                        for (let k=0; k<filas; k++) { // Este for le asigna a cada casillero la cantidad de gatos vecinos
                            for (let l=0; l<columnas; l++) {
                                let cantidadGatosVecinos = analizarCasillerosVecinos(tablero, k, l)
                                tablero[k][l].gatosVecinos = cantidadGatosVecinos
                                
                                let textoCasilleros = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                                if (tablero[k][l].gato == true) {
                                    textoCasilleros.innerText = `🐈‍`
                                
                                } else {
                                    textoCasilleros.innerText = cantidadGatosVecinos
                                    if (cantidadGatosVecinos <= 2) { // Le asigno colores a los números
                                        textoCasilleros.classList.add("colorVerde")
                                    
                                    } else if (cantidadGatosVecinos <= 4) {
                                        textoCasilleros.classList.add("colorAmarillo")
                                    
                                    } else {
                                        textoCasilleros.classList.add("colorRojo")
                                    }
                                }                        
                            }
                        }
                        expandirArea(tablero, i, j)

                        for (let k=0; k<filas; k++) { // Este for "oculta" todos los números de los casilleros ocultos
                            for (let l=0; l<columnas; l++) {
                                (tablero[k][l].estado == "oculto") && (document.getElementById(`fila-${k+1}-columna-${l+1}`).classList.add("textoOculto"))
                            }
                        }

                        if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                            despedida(tablero, filas, columnas, "ganar", `Felicidades! Has terminado en... ¿un intento? Que suerte! Prueba de nuevo pero con un porcentaje de gatos distinto`, cantGatos)
                            juegoTerminado = true
                        }
                        primerClickRealizado = true
                    
                    } else if (juegoTerminado == false) { // Esto se ejecuta si en el click anterior no se terminó el juego
                        casillero.classList.add("casilleroVisible")
                        tablero[i][j].estado = "visible"
                        
                        if (tablero[i][j].gato == true) { // Esto se ejecuta si hicimos click sobre un casillero con un gato
                            despedida(tablero, filas, columnas, "perder", "Te detectaron los gatos! Juego terminado", cantGatos)
                            juegoTerminado = true

                        } else if(tablero[i][j].gatosVecinos == "") {  // Esto se ejecuta si hicimos click sobre un casillero sin gatos y sin gatos alrededor
                            expandirArea(tablero, i, j)
                            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                                despedida(tablero, filas, columnas, "ganar", `Felicidades! Has terminado en ${cantidadDeClicks} intentos! Tu promedio de victorias es del X%`, cantGatos)
                                juegoTerminado = true
                            }
                        
                        } else {  // Esto se ejecuta si hicimos click sobre un casillero con gatos alrededor
                            casillero.classList.remove("textoOculto")
                            casillero.classList.remove("casilleroOculto")
                            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                                despedida(tablero, filas, columnas, "ganar", `Felicidades! Has terminado en ${cantidadDeClicks} intentos! Tu promedio de victorias es del X%`, cantGatos)
                                juegoTerminado = true
                            }
                        }
                    }
                })
                // Acá voy a agregar los eventos del click derecho para colocar banderas
            }
        }
    }
})