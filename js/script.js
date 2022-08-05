let tableroHTML = document.getElementById("tablero")

function crearTableroVacioHTML(filas, columnas){ //Crea un tablero vacío en el HTML
    tableroHTML.innerHTML = "" // Primero vacío el tablero
    for(let i=0; i<filas; i++) { 
        let filai = document.createElement("tr");
        for(let j=0; j<columnas; j++) { 
            filai.innerHTML += `<td id=fila-${i+1}-columna-${j+1} class="casilleroOculto casillero"> </td>`
        }
        tableroHTML.append(filai)
    }
}

function crearTableroVacioJuego(filas, columnas) { // Crea un tablero con casilleros ocultos en JS
    let tablero = []
    for(let i=0; i<filas; i++) { 
        let filai = []
        for(let j=0; j<columnas; j++) { 
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

function analizarCasillerosVecinos(tablero, i, j){ // Recibe un tablero y una ubicación. Devuelve la cantidad de vecinos con gatos
    let cantidadDeGatosVecinos = 0
    for(let n=-1; n<=1; n++) {
        for(let m=-1; m<=1; m++) {
            try{
                if(tablero[i+n][j+m].gato == true) {
                    cantidadDeGatosVecinos += 1
                }
            }catch{}
        }
    }
    if(cantidadDeGatosVecinos == 0) {
        cantidadDeGatosVecinos = ""
    }
    return cantidadDeGatosVecinos
}

function expandirLineaArribaYAbajo(tablero, i, j, direccion) { // Esta función, al igual que las tres de abajo, trata de expandir el área cuando se hace un click
    let n
    if(direccion == "arriba") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    let repetir = true
    do{
        try{
            if(tablero[i+n][j].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }
            tablero[i+n][j].estado = "visible"
            let casillero = document.getElementById(`fila-${i+1+n}-columna-${j+1}`)
            casillero.classList.add("casilleroSinBomba")
            n = n + cambio
        } catch {repetir = false}
    }while(repetir)
}

function expandirLineaIzquierdaYDerecha(tablero, i, j, direccion) {
    let n
    if (direccion == "izquierda") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    let repetir = true
    do{
        try{
            if(tablero[i][j+n].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }
            tablero[i][j+n].estado = "visible"
            // expandirLineaArribaYAbajoRama(tablero, i, j+n, "arriba")
            let casillero = document.getElementById(`fila-${i+1}-columna-${j+1+n}`)
            casillero.classList.add("casilleroSinBomba")
            n = n + cambio
        } catch {repetir = false}
    }while(repetir)
}

function expandirLineaArribaYAbajoRama(tablero, i, j, direccion) { // ME QUEDÉ HACIENDO ESTO
    let n
    if(direccion == "arriba") {
        n = -1
    } else {
        n = 1
    }
    let cambio = n
    while (tablero[i+n-cambio][j].gatosVecinos == "") { // Si el casillero actual no tiene gatos vecinos, entonces el while no se reinicia
        try{
            tablero[i+n][j].estado = "visible"
            let casillero = document.getElementById(`fila-${i+1+n}-columna-${j+1}`)
            casillero.classList.add("casilleroSinBomba")
            n = n + cambio
        } catch {}
    }
}

function expandirArea(tablero, i, j) {
    expandirLineaArribaYAbajo(tablero, i, j, "arriba") // Expande el area arriba
    expandirLineaArribaYAbajo(tablero, i, j, "abajo") // Expande el area abajo
    expandirLineaIzquierdaYDerecha(tablero, i, j, "izquierda") // Expande el area a la derecha
    expandirLineaIzquierdaYDerecha(tablero, i, j, "derecha") // Expande el area a la izquierda
}

let botonIniciarJuego = document.getElementById("iniciarJuego")

botonIniciarJuego.addEventListener("click", (e) => { // Le creo un evento al botón "Iniciar Juego"
    e.preventDefault() // Primero prevengo que haga lo que por defecto está hecho para hacer. Prevengo que actualice la página
    let cartelInicial = document.getElementById("cartelInicial")
    cartelInicial.innerHTML = "" // Borro el texto inicial
    primerClickRealizado = false // Establezco que todavía no se hizo el primer click aunque es mentira, pero luego se modifica
    let filas = document.getElementById("cantFilas").value
    let columnas = document.getElementById("cantColumnas").value
    if(filas*columnas <= 9) { // En caso de que hayan menos de 10 casilleros, sale este cartel
        cartelInicial.innerHTML = `
        <p>Alto ahí listillo! Es necesario que hayan por lo menos 10 casilleros</p>
        `
    }
    tablero = crearTableros(filas, columnas) // Creo los tableros según la cantidad de filas y columnas en los inputs

    let dificultad = document.getElementById("dificPorcent").value // Asigno la dificultad según lo que decía en el imput de porcentaje de gatos

    for(let i=0; i<filas; i++) { 
        for(let j=0; j<columnas; j++) { 
            let casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)
            casillero.addEventListener("click", () => {  // Establezco lo que va a suceder cuando hago un click en un casillero cualquiera
                
                if(primerClickRealizado == false) { // Todo esto se va a considerar a la hora de hacer el primer click. El primer click es especial ya que debe ser sin gato, y los ocho casilleros a su alrededor tampoco deben tener
                    casillero.classList.add("casilleroSinBomba")
                    tablero[i][j].estado = "visible"
                    
                    for(let k=0; k<filas; k++) { // Este for coloca gatos aleatoriamente
                        for(let l=0; l<columnas; l++) {
                            numeroAleatorio = Math.random()*100
                            if(numeroAleatorio < dificultad) {
                                tablero[k][l].gato = true
                            }
                            
                        }
                    }
                    for(let n=-1; n<=1; n++) { // Hago que el primer casillero visible no tenga gato, ni sus vecinos
                        for(let m=-1; m<=1; m++) {
                            try{
                                tablero[i+n][j+m].gato = false
                            }catch{}
                        }
                    }
    
                    for(let k=0; k<filas; k++) { // Este for le asigna a cada casillero la cantidad de gatos vecinos
                        for(let l=0; l<columnas; l++) {
                            let cantidadGatosVecinos = analizarCasillerosVecinos(tablero, k, l)
                            tablero[k][l].gatosVecinos = cantidadGatosVecinos
                            let textoCasilleros = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                            if(tablero[k][l].gato == true) {
                                textoCasilleros.innerHTML = `G`
                            } else {
                                textoCasilleros.innerText = tablero[k][l].gatosVecinos
                            }                        
                        }
                    }
                    expandirArea(tablero, i, j)
                    primerClickRealizado = true
                } else {    
                }
            })
        }
    }
})





