let filas = 12
let columnas = 15
let tableroHTML = document.getElementById("tablero")
let primerClickRealizado = false
let dificultad = 10 //%
let casilleros = document.getElementsByClassName("casillero")

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



// function comprobarCasillerosSinBombasVecinas(tablero, i, j) {
//     for(let n=0; n<filas; n++) {
//         for(let m=0; m<columnas; m++) {
//             if(analizarCasillerosVecinos(tablero, n, m) == "") {
//                 let casilleroSinBombasVecinas = document.getElementById(`fila-${n+1}-columna-${m+1}`)
//                 casilleroSinBombasVecinas.classList.add("casilleroSinBomba")
//             }
//         }
//     }
// }

function expandirLinea(tablero, i, j, n, m, cambio, repetir=true) {
    do{
        try{
            if(tablero[i+n][j+m].gatosVecinos != "") { // Si el siguiente casillero tiene gatos vecinos, entonces el while no se reinicia
                repetir = false
            }
            tablero[i+n][j+m].estado = "visible"
            let casillero = document.getElementById(`fila-${i+1+n}-columna-${j+1+m}`)
            casillero.classList.add("casilleroSinBomba")
            if (n == 0) {
                m = m + cambio
            } else if (m == 0) {
                n = n + cambio
            } else { // ME QUEDÉ ACÁ
                //expandirArea(tablero, i+n, j+m)
            }
        } catch {repetir = false}
    }while(repetir)
}

function expandirArea(tablero, i, j) { 
    expandirLinea(tablero, i, j, 1, 0, 1)
    expandirLinea(tablero, i, j, 0, 1, 1)
    expandirLinea(tablero, i, j, -1, 0, -1)
    expandirLinea(tablero, i, j, 0, -1, -1)
} 

tablero = crearTableros(filas, columnas)

for(let i=0; i<filas; i++) { 
    for(let j=0; j<columnas; j++) { 
        let casillero = document.getElementById(`fila-${i+1}-columna-${j+1}`)
        casillero.addEventListener("click", () => {
            
            if(primerClickRealizado == false) { // El primer click es un lugar visible y sin gato
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
                        let ADS = document.getElementById(`fila-${k+1}-columna-${l+1}`)
                        if(tablero[k][l].gato == true) {
                            ADS.innerText = "G"
                        } else {
                            ADS.innerText = tablero[k][l].gatosVecinos
                        }                        
                    }
                }
                expandirArea(tablero, i, j)
                // let cantidadGatosVecinos = analizarCasillerosVecinos(tablero, i, j, casillero)         
                // casillero.innerText = cantidadGatosVecinos
                // comprobarCasillerosSinBombasVecinas(tablero, i, j)
                primerClickRealizado = true
            } else {
                
            }
        })
    }
}