let tableroHTML = document.getElementById("tablero")

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

function crearTableroVacioHTML(filas, columnas){ //Crea un tablero vacío en el HTML
    tableroHTML.innerHTML = ""                   // Primero vacío el tablero
    for (let i=0; i<filas; i++) { 
        let filai = document.createElement("tr");
        for (let j=0; j<columnas; j++) { 
            filai.innerHTML += `<td id=fila-${i+1}-columna-${j+1} class="casilleroOculto"> </td>`
        }
        tableroHTML.append(filai)
    }
}

function crearTableroVacioJuego(filas, columnas) { // Crea un tablero con casilleros ocultos en JS
    let tablero = []
    for (let i=0; i<filas; i++) { 
        let filai = []
        for (let j=0; j<columnas; j++) { 
            let casillero = new Casillero("oculto")
            filai.push(casillero)
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
    if ((i < 0 || j < 0 || i >= filas || j >= columnas)) {
        res = false
    }
    return res
}

function analizarCasillerosVecinos(tablero, i, j) { // Recibe un tablero y una ubicación. Devuelve la cantidad de vecinos con gatos
    let cantidadDeGatosVecinos = 0
    for (let n=-1; n<=1; n++) {
        for (let m=-1; m<=1; m++) {
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                if (tablero[i+n][j+m].gato == true) {
                    cantidadDeGatosVecinos += 1
                }
            }
        }
    }
    if (cantidadDeGatosVecinos == 0) {
        cantidadDeGatosVecinos = ""
    }
    return cantidadDeGatosVecinos
}

function expandirLineaArribaYAbajo(tablero, i, j, direccion) { // Esta función expande arriba y abajo el área cuando se hace un click
    let n
    if (direccion == "arriba") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    let repetir = true
    do {
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j)) {
            if (tablero[i+n][j].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }

            tablero[i+n][j].estado = "visible"
            document.getElementById(`fila-${i+1+n}-columna-${j+1}`).classList.add("casilleroSinBomba")

            expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "izquierda")
            expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "derecha")

            n += cambio
        } else {
            repetir = false
        }
    } while (repetir)
}

function expandirLineaIzquierdaYDerecha(tablero, i, j, direccion) { // Esta función expande izquierda y derecha el área cuando se hace un click
    let n
    if (direccion == "izquierda") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    let repetir = true
    do {
        if (perteneceAlTablero(tablero.length, tablero[0].length, i, j+n)) {
            if (tablero[i][j+n].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }

            tablero[i][j+n].estado = "visible"
            document.getElementById(`fila-${i+1}-columna-${j+1+n}`).classList.add("casilleroSinBomba")
            
            expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba")
            expandirLineaArribaYAbajoRama(tablero, i, j+n, "abajo")

            n += cambio
        } else {
            repetir = false
        }
    } while (repetir)
}

function expandirLineaArribaYAbajoRama(tablero, i, j, direccion) { // Esta función y la de abajo se llaman una y otra vez hasta que todo área se expanda correctamente
    let n
    if (direccion == "arriba") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    try {
        let p = 0
        if (tablero[i+n][j].gatosVecinos == ""){
            p += 1
        } else { // Quiero que esto se ejecute sólo si en tablero[i+n][j] hay gatos, aunque también haya en tablero[i][j+n-cambio]
            tablero[i+n][j].estado = "visible"
            document.getElementById(`fila-${i+1+n}-columna-${j+1}`).classList.add("casilleroSinBomba")
        }

        while (tablero[i+n-cambio][j].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia

            if (p != 0) {
                tablero[i+n][j].estado = "visible"
                document.getElementById(`fila-${i+1+n}-columna-${j+1}`).classList.add("casilleroSinBomba")
            }
            p += 1
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+1)) {
                if (tablero[i+n][j+1].estado != "visible") {
                    expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "derecha")
                }
            }
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j-1)) {
                if (tablero[i+n][j-1].estado != "visible"){
                    expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "izquierda")
                }
            }
            
            n += cambio
        }
    } catch {}
}

function expandirLineaIzquierdaYDerechaRama(tablero, i, j, direccion) {
    let n
    if (direccion == "izquierda") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    try {
        let p = 0
        if (tablero[i][j+n].gatosVecinos == "") {
            p += 1
        } else { 
            tablero[i][j+n].estado = "visible"
            document.getElementById(`fila-${i+1}-columna-${j+1+n}`).classList.add("casilleroSinBomba")
        }

        while (tablero[i][j+n-cambio].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia

            if(p != 0) {
                tablero[i][j+n].estado = "visible"
                document.getElementById(`fila-${i+1}-columna-${j+1+n}`).classList.add("casilleroSinBomba")
            }
            p += 1
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i+1, j+n)) {
                if (tablero[i+1][j+n].estado != "visible") {
                    expandirLineaArribaYAbajoRama(tablero, i, j+n, "abajo")
                }
            }
            
            if (perteneceAlTablero(tablero.length, tablero[0].length, i-1, j+n)) {
                if(tablero[i-1][j+n].estado != "visible") {
                    expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba")
                }
            }

            n += cambio
        }
    } catch {}
}

function expandirArea(tablero, i, j) {
    expandirLineaArribaYAbajo(tablero, i, j, "arriba") // Expande el area arriba
    expandirLineaArribaYAbajo(tablero, i, j, "abajo") // Expande el area abajo
    expandirLineaIzquierdaYDerecha(tablero, i, j, "izquierda") // Expande el area a la derecha
    expandirLineaIzquierdaYDerecha(tablero, i, j, "derecha") // Expande el area a la izquierda
}


function inputIncorrecto(etiquetaP) {
    cartelInicial.innerHTML = etiquetaP
    tableroHTML.innerHTML = ""
}

let botonIniciarJuego = document.getElementById("form")

botonIniciarJuego.addEventListener("submit", (e) => { // Le creo un evento al botón "Iniciar Juego"
    e.preventDefault() // Primero prevengo que haga lo que por defecto está hecho para hacer. Prevengo que actualice la página
    
    let cartelInicial = document.getElementById("cartelInicial")
    cartelInicial.innerHTML = "" // Borro el texto inicial
    
    primerClickRealizado = false // Establezco que todavía no se hizo el primer click en el tablero
    
    let filas = document.getElementById("cantFilas").value
    let columnas = document.getElementById("cantColumnas").value
    let dificultad = document.getElementById("dificPorcent").value

    if (filas < 0) { // Varios condicionales que impiden que el programa se ejcute si el usuario ingresó datos que no tienen sin sentido
        inputIncorrecto(`<p>¿${filas} filas? ¿En serio? Ya quisieras. Por favor cambia ese número</p>`)
    
    } else if (columnas < 0) {
        inputIncorrecto(`<p>Acá habría una linda tabla si no me pidieras ${columnas} columnas</p>`)
    
    } else if (filas*columnas <= 9) { 
        inputIncorrecto(`<p>Alto ahí listillo! Se necesita un mínimo de 10 casilleros</p>`)
    
    } else if (filas*columnas > 2500) {
        inputIncorrecto(`<p>En serio quieres ${filas*columnas} casilleros? Para que tu compu no explote se permiten 2500 como máximo</p>`)

    } else if (dificultad <= 0 || dificultad >= 100) {
        inputIncorrecto(`<p>"Gatos aproximados (%)" establece el porcentaje de gatos aproximado que deseas tener en el tablero, por lo tanto no tiene sentido colocar ${dificultad}%</p>`)

    } else {
        datosInputs = new InputsPasados(filas, columnas, dificultad) // Creo un objeto con los valores actuales de los inputs
        localStorage.setItem("datosInputs", JSON.stringify(datosInputs))  // Esto guarda los valores de los inputs (deben ser inputs válidos, por eso están en el else) para la siguiente vez que se quiera abrir la página
        
        tablero = crearTableros(filas, columnas) // Creo los tableros según la cantidad de filas y columnas en los inputs

        for (let i=0; i<filas; i++) { 
            for (let j=0; j<columnas; j++) { 
                let casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)
                casillero.addEventListener("click", () => {  // Establezco lo que va a suceder cuando hago un click en un casillero cualquiera
                    
                    if (primerClickRealizado == false) { // Todo esto se va a considerar a la hora de hacer el primer click. El primer click es especial ya que no debe caer donde haya un gato, y los ocho casilleros a su alrededor tampoco deben tener
                        casillero.classList.add("casilleroSinBomba")
                        tablero[i][j].estado = "visible"
                        
                        let cantGatos
                        do { // Este do hace que siempre haya por lo menos un gato en el tablero
                            cantGatos = 0
                            for (let k=0; k<filas; k++) { // Este for coloca gatos aleatoriamente
                                for (let l=0; l<columnas; l++) {
                                    if (Math.random()*100 < dificultad) {
                                        tablero[k][l].gato = true
                                        cantGatos += 1
                                    }
                                    
                                }
                            }
                        
                            for (let n=-1; n<=1; n++) { // Hago que el primer casillero visible no tenga gato, ni sus vecinos
                                for (let m=-1; m<=1; m++) {
                                    if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+m)) {
                                        document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`).classList.add("casilleroSinBomba") // Aprovecho y pinto los casilleros al rededor de donde hago el primer click, ya que sabemos que ahí no hay gatos
                                        if (tablero[i+n][j+m].gato == true) {
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
                                    textoCasilleros.innerText = `G` // Esto es provisorio. Luego colocaré un ícono
                                
                                } else {
                                    textoCasilleros.innerText = tablero[k][l].gatosVecinos
                                    if (cantidadGatosVecinos <= 2) { // Le asigno a cada número un color distinto
                                        textoCasilleros.classList.add("colorVerde")
                                    } else if (cantidadGatosVecinos <= 5) {
                                        textoCasilleros.classList.add("colorAmarillo")
                                    } else {
                                        textoCasilleros.classList.add("colorRojo")
                                    }
                                    
                                }                        
                            }
                        }
                        expandirArea(tablero, i, j)

                        for (let k=0; k<filas; k++) { // Este for "oculta" (borra) todos los números de los casilleros ocultos
                            for (let l=0; l<columnas; l++) {
                                if(tablero[k][l].estado == "oculto") {
                                    document.getElementById(`fila-${k+1}-columna-${l+1}`).classList.add("textoOculto")

                                }
                            }
                        }
                        primerClickRealizado = true
                    
                    } else {
                        // Acá se van a ejecutar los siguientes clicks en el tablero. Seguramente muchas de las cosas que están arriba las convierta en función y las ejecute acá un tanto distintas
                    }
                })
            }
        }
    }
})