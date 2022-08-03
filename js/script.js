let filas = 14
let columnas = 20
let tablero = document.getElementById("tablero")
let primerClickRealizado = false

function crearTableroVacioHTML(filas, columnas){
    tablero.innerHTML = "" // Primero vacío el tablero
    for(let i=0; i<filas; i++) { 
        let filai = document.createElement("tr");
        for(j=0; j<columnas; j++) { 
            filai.innerHTML += `<td id=fila-${i+1}-columna-${j+1} class="casilleroOculto casillero"> a </td>`
        }
        tablero.append(filai)
    }
}

function crearTableroVacioJuego(filas, columnas) {
    let tablero = []
    for(let i=0; i<filas; i++) { 
        let filai = []
        for(j=0; j<columnas; j++) { 
            let casillero = new Casillero("oculto") // Agrego un casillero oculto al principio
            filai.push(casillero)
        }
        tablero.push(filai)
    }
    return tablero
}

function crearTableros(filas, columnas) {
    crearTableroVacioHTML(filas, columnas)
    return crearTableroVacioJuego(filas, columnas)
}

function analizarCasillerosVecinos(){
    
}

function clickCasillero(idCasilero) {
    if(primerClickRealizado == false) {
        casilleros[0].className = "casilleroSinBomba"
    }
}

function casilleroHTML (x, y) { //Ingreso una coordenada en la matriz y me devuelve el id del casillero de la matriz
    return `fila-${x}-columna-${y}`
} 

tablero = crearTableros(filas, columnas)

let casilleros = document.getElementsByClassName("casillero")

casilleros.forEach( (elemento) => {
    elemento.addEventListener("click", () => {
        
    })
});