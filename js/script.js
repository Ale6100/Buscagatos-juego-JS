const tableroHTML = document.getElementById("tablero")

let datosInputs
if (localStorage.getItem("datosInputs") != null) { // En caso de que exista información con clave "datosInputs" la agrega a los valores de los inputs
    datosInputs = JSON.parse(localStorage.getItem("datosInputs")) // Devuelve un objeto js
    document.getElementById("cantFilas").value = datosInputs.filas
    document.getElementById("cantColumnas").value = datosInputs.columnas
    document.getElementById("dificPorcent").value = datosInputs.porcentGatos
}

function inputIncorrecto(mensajeError, duracionSegundos) { // Agrega un texto distinto según sea el error del input ingresado
    Toastify({
        text: mensajeError,
        duration: duracionSegundos*1000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 127, 0))",
        }
    }).showToast();
}

function mostrarError(filas, columnas, porcent) {
    if (filas < 0 || columnas < 0) { // Varios condicionales que impiden que el programa se ejcute si el usuario ingresó datos que no tienen sentido
        inputIncorrecto(`No es posible colocar filas o columnas negativas`, 4)
    
    } else if (filas*columnas <= 9) { 
        inputIncorrecto(`Alto ahí listillo! Se necesita un mínimo de 10 casilleros`, 4)
    
    } else if (filas*columnas > 2500) {
        inputIncorrecto(`¿En serio quieres ${filas*columnas} casilleros? Para que no forzar a tu computadora se permiten 2500 como máximo`, 6)

    } else { // se ejecuta si porcent <= 0 || porcent >= 100 ya que es el último caso posible por el cual se ejecutó esta función
        inputIncorrecto(`"Gatos aproximados (%)" establece el porcentaje de gatos aproximado que deseas tener en el tablero, por lo tanto no se permite colocar ${porcent}%`, 8)
    }
}

function crearTableroVacioHTML(filas, columnas) { // Crea un tablero vacío en el HTML
    tableroHTML.innerHTML = ""                    // Primero vacío el tablero
    for (let i=0; i<filas; i++) { 
        let filai = document.createElement("tr"); // Creo la cantidad de filas pedidas mediante etiquetas tr
        for (let j=0; j<columnas; j++) { 
            filai.innerHTML += `
            <td id=fila-${i+1}-columna-${j+1} class="casilleroOculto">
                <p></p> 
                <p></p>
            </td>
            ` // Dentro de cada fila agrego la cantidad de columnas pedidas. Las etiquetas p las voy a usar para agregar un número y/o una bandera respectivamente
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

function mostrarConsejos(){ // Cada vez que se hace un click izquierdo hay un 10% de probabilidades de que se muestre un consejo random abajo del tablero
    if (Math.random()*100 < 10) { 
        let arrayConsejos = [
            `Coloca banderas con click izquierdo para dejar marcada una posición donde sepas que hay un gato`,
            `Los casilleros con números indican la cantidad de gatos a su alrededor`,
            `El primer casillero visible y sus vecinos nunca tendrán un gato`,
            `No uses tu primer click en los bordes`,
            `Si estás en móvil o tablet debes mantener el dedo sobre un casillero para simular el click izquierdo`]
        consejosRandom.innerText = `Consejo random: ${arrayConsejos[parseInt(Math.random()*arrayConsejos.length)]}`
    } 
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
    (cantidadDeGatosVecinos == 0) && (cantidadDeGatosVecinos = "") // Si el contador quedó en cero, lo definimos como un string vacío
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

            tablero[i+n][j].visibleTexto(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`))

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
            tablero[i][j+n].visibleTexto(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`))
            
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
    let p = 0
    if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j)) {
        if (tablero[i+n][j].gatosVecinos == ""){
            p += 1
        } else { // Quiero que esto se ejecute sólo si en tablero[i+n][j] hay gatos, aunque también haya en tablero[i][j+n-cambio]
            tablero[i+n][j].visibleTexto(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`))
        }
    }
    while (tablero[i+n-cambio][j].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j)) {
            (p != 0) && (tablero[i+n][j].visibleTexto(tablero, i+n, j, document.getElementById(`fila-${i+1+n}-columna-${j+1}`)))
        }
        p += 1
        
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j+1)) {
            (tablero[i+n][j+1].estado != "visible") && (expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "derecha"))
        }
        
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+n, j-1)) {
            (tablero[i+n][j-1].estado != "visible") && (expandirLineaIzquierdaYDerechaRama(tablero, i+n, j, "izquierda"))
        }
        n += cambio
        if (!(perteneceAlTablero(tablero.length, tablero[0].length, i+n-cambio, j))) {
            break
        }
    }
}

function expandirLineaIzquierdaYDerechaRama(tablero, i, j, direccion) {
    let n = (direccion == "izquierda") ? -1 : 1
    let cambio = n
    let p = 0
    if (perteneceAlTablero(tablero.length, tablero[0].length, i, j+n)) {
        if (tablero[i][j+n].gatosVecinos == "") {
            p += 1
        } else { 
            tablero[i][j+n].visibleTexto(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`))
        }
    }
    while (tablero[i][j+n-cambio].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while se reinicia
        if (perteneceAlTablero(tablero.length, tablero[0].length, i, j+n)) {
            (p != 0) && (tablero[i][j+n].visibleTexto(tablero, i, j+n, document.getElementById(`fila-${i+1}-columna-${j+1+n}`)))
        }
        p += 1
        
        if (perteneceAlTablero(tablero.length, tablero[0].length, i+1, j+n)) {
            (tablero[i+1][j+n].estado != "visible") && (expandirLineaArribaYAbajoRama(tablero, i, j+n, "abajo"))
        }
        
        if (perteneceAlTablero(tablero.length, tablero[0].length, i-1, j+n)) {
            (tablero[i-1][j+n].estado != "visible") && (expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba"))   
        }
        n += cambio
        if (!(perteneceAlTablero(tablero.length, tablero[0].length, i, j+n-cambio))) {
            break
        }
    }
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

function actualizarRegistroPartidas(partidas, resultado) { // Actualiza la base de datos donde se guarda la cantidad de partidas ganadas y perdidas
    if (resultado == "ganar") {
        partidas.ganadas += 1
    } else {
        partidas.perdidas += 1
    }
    localStorage.setItem("partidasPasadas", JSON.stringify(partidas))
    return Math.round(partidas.ganadas*100/(partidas.ganadas + partidas.perdidas)) // Devuelve el porcentaje de victorias obtenidas
}

function despedida(tablero, filas, columnas, resultado, cantidadDeClicks, partidas) { // Código que se ejecuta cuando terminó el juego
    let porcentajePartidasGanadas = actualizarRegistroPartidas(partidas, resultado)
    let mensaje
    for (let k=0; k<filas; k++) {
        for (let l=0; l<columnas; l++) {
            if (tablero[k][l].gato == true) { // Hago que los gatos aparezcan con un color de fondo u otro en caso de haber perdido o ganado
                let casilleroConGato = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                tablero[k][l].visibleTexto(tablero, k, l, casilleroConGato)                
                
                if (resultado == "perder") { 
                    casilleroConGato.classList.add("colorPerdedorFondo")
                } else {
                    casilleroConGato.classList.add("colorGanadorFondo")
                }
            }
        }
    }
    if (resultado == "ganar") { // Alerta especial en caso de haber ganado
        if (cantidadDeClicks == 1) {
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
        }).then( (result) => { // Elimina el registro de partidas ganadas y perdidas, en caso de que el usuario lo decida
            if (result.isDenied) {
                Swal.fire({
                title: 'Registro de victorias eliminado',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true})
                localStorage.removeItem("partidasPasadas")
            }
        })
    } else { // Alerta especial en caso de haber perdido
        Swal.fire({
            title: 'Te descubrieron! 😔',
            text: "No te preocupes y vuelve a intentarlo!",
            icon: 'error',
            timer: 4000,
            timerProgressBar: true,
        })
    }
    let juegoTerminado = true
    return juegoTerminado
}

function primerClick(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, partidas) { // Comportamiento del primer click sobre el tablero
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

    for (let k=0; k<filas; k++) { // Este for le asigna a cada casillero la cantidad de gatos vecinos
        for (let l=0; l<columnas; l++) {
            let cantidadGatosVecinos = analizarCasillerosVecinos(tablero, k, l)
            tablero[k][l].gatosVecinos = cantidadGatosVecinos
            
            let cluster = document.getElementById(`fila-${k+1}-columna-${l+1}`)
            if (tablero[k][l].gato == true) {
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
        }
    }
    expandirArea(tablero, i, j)

    for (let k=0; k<filas; k++) { // Este for "oculta" todos los números de los casilleros ocultos
        for (let l=0; l<columnas; l++) {
            let cluster = document.getElementById(`fila-${k+1}-columna-${l+1}`)
            if (tablero[k][l].estado == "oculto") {
                cluster.children[0].classList.add("textoOculto")
            }
        }
    }
    
    let juegoTerminado = false
    if (juegoGanado(tablero, filas, columnas, cantGatos)) {
        juegoTerminado = despedida(tablero, filas, columnas, "ganar", cantidadDeClicks, partidas)
    }
    
    primerClickRealizado = true
    return [cantGatos, primerClickRealizado, juegoTerminado] // Retorno los datos que necesitaré después y no se almacenan solos en otro lado
}

function clickDerecho(tablero, i, j, casillero, juegoTerminado) { // Comportamiento del click derecho sobre la ubicación (i, j) del tablero
    if (tablero[i][j].estado == "oculto" && juegoTerminado == false) {
        if (tablero[i][j].bandera == false) {
            tablero[i][j].visibleBandera(tablero, i, j, casillero)
        } else {
            tablero[i][j].noVisibleBandera(tablero, i, j, casillero)
        }
    }
}

function clickIzquierdo(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas) { // Comportamiento del click izquierdo sobre la ubicación (i, j) del tablero
    cantidadDeClicks += 1
    mostrarConsejos()
    if (primerClickRealizado == false) { // Esto se va a ejecutar a la hora de hacer el primer click sobre el tablero. El primer click es distinto a los demáses                                              
        [cantGatos, primerClickRealizado, juegoTerminado] = primerClick(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, partidas)

    } else if (juegoTerminado == false) { // Esto se ejecuta si en el click anterior no se terminó el juego
        tablero[i][j].visibleTexto(tablero, i, j, casillero)

        if (tablero[i][j].gato == true) { // Esto se ejecuta si hicimos click sobre un casillero con un gato
            juegoTerminado = despedida(tablero, filas, columnas, "perder", cantidadDeClicks, partidas)

        } else if(tablero[i][j].gatosVecinos == "") {  // Esto se ejecuta si hicimos click sobre un casillero sin gatos y sin gatos alrededor
            expandirArea(tablero, i, j)
            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, filas, columnas, "ganar", cantidadDeClicks, partidas)
            }

        } else {  // Esto se ejecuta si hicimos click sobre un casillero con gatos alrededor
            casillero.classList.remove("textoOculto")
            casillero.classList.remove("casilleroOculto")
            if (juegoGanado(tablero, filas, columnas, cantGatos)) {
                juegoTerminado = despedida(tablero, filas, columnas, "ganar", cantidadDeClicks, partidas)
            }
        }
    }
    return [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado]  // Retorno los datos que necesitaré después y no se almacenan solos en otro lado
}

const form = document.getElementById("form")

form.addEventListener("submit", (e) => { // Le creo un evento al botón "Iniciar Juego"
    e.preventDefault() // Primero prevengo que haga lo que por defecto está hecho para hacer. Prevengo que actualice la página

    const filas = document.getElementById("cantFilas").value // Obtengo los valores de los inputs
    const columnas = document.getElementById("cantColumnas").value
    const porcent = document.getElementById("dificPorcent").value

    if (filas < 0 || columnas < 0 || filas*columnas <= 9 || filas*columnas > 2500 || porcent <= 0 || porcent >= 100) { // Varios condicionales que impiden que el programa se ejcute si el usuario ingresó datos que no tienen sentido
        mostrarError(filas, columnas, porcent)

    } else {
        let partidas = {ganadas : 0, perdidas : 0} // Cantidad de partidas ganadas y partidas
        if (localStorage.getItem("partidasPasadas") != null) { // En caso de que ya exista el registro de las partidas, las obtiene
            partidas = JSON.parse(localStorage.getItem("partidasPasadas"))
        }

        let cartelInicial = document.getElementById("cartelInicial")
        if (cartelInicial != null) {
            cartelInicial.remove() // Elimino el cartel incial 
        }

        let datosInputs = new InputsPasados(filas, columnas, porcent)    // Creo un objeto con los valores actuales de los inputs
        localStorage.setItem("datosInputs", JSON.stringify(datosInputs)) // Esto guarda los valores de los inputs (deben ser inputs válidos, por eso están en el else) para la siguiente vez que se quiera abrir la página
        
        const tablero = crearTableros(filas, columnas) // Creo los tableros según la cantidad de filas y columnas en los inputs
        let primerClickRealizado = false // Establezco que todavía no se hizo el primer click en el tablero
        let juegoTerminado = false       // Se va a convertir a true cuando el juego haya termnado
        let cantGatos                    // Me va a servir para contar la cantidad de gatos en el tablero
        let cantidadDeClicks = 0         // Contador de clicks en el tablero
        const consejosRandom = document.getElementById(`consejosRandom`) 
        consejosRandom.innerText = ""

        for (let i=0; i<filas; i++) { 
            for (let j=0; j<columnas; j++) { 
                const casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)

                casillero.addEventListener("click", () => {  // Establezco lo que va a suceder cuando hago un click en un casillero cualquiera (en particular, en tablero[i][j])
                    [cantidadDeClicks, cantGatos, primerClickRealizado, juegoTerminado] = clickIzquierdo(tablero, filas, columnas, i, j, porcent, casillero, cantidadDeClicks, primerClickRealizado, cantGatos, juegoTerminado, partidas)
                })

                casillero.addEventListener("contextmenu", (e) => { // Comportamiento del click derecho para colocar o quitar banderas
                    e.preventDefault()
                    clickDerecho(tablero, i, j, casillero, juegoTerminado)
                })                
            }
        }
    }
})