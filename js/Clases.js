//@ts-check
"use strict";

class Casillero { // Clase que crea objetos que representan a los casilleros
    constructor() {
        this.estado = "oculto" // "oculto" o "visible"
        this.gato = false // Sin gato o con gato (false o true)
        this.gatosVecinos = null // "" o un número (por defecto no es ninguno)
        this.bandera = false // Sin bandera o con bandera (false o true)
    }

    /**
     * Actualiza el estado de un casillero haciendo que pase a estar visible
     *
     * @param {Array} tablero - El tablero de juego
     * @param {number} i - La fila del casillero
     * @param {number} j - La columna del casillero
     * @param {HTMLTableCellElement} casillero - El elemento HTML que representa al casillero
     */
    visibleTexto(tablero, i, j, casillero) { // Hace que un casillero pase a estar descubierto
        tablero[i][j].noVisibleBandera(tablero, i, j, casillero)
        casillero.children[0].classList.remove("textoOculto")
        casillero.classList.replace("casilleroOculto", "visibleTexto")
        tablero[i][j].estado = "visible"
    }

    /**
     * Agrega una bandera al casillero especificado
     *
     * @param {Array} tablero - El tablero de juego
     * @param {number} i - La fila del casillero
     * @param {number} j - La columna del casillero
     * @param {HTMLTableCellElement} casillero - El casillero al que se le agregará la bandera
     */
    visibleBandera(tablero, i, j, casillero) {
        if (casillero.children[1] instanceof HTMLParagraphElement) {
            casillero.children[1].innerText = `🚩`
            tablero[i][j].bandera = true
        } else {
            throw new Error("Error interno")
        }
    }

    /**
     * Elimina la bandera del casillero especificado
     *
     * @param {Array} tablero - El tablero de juego
     * @param {number} i - La fila del casillero
     * @param {number} j - La columna del casillero
     * @param {HTMLTableCellElement} casillero - El casillero al que se le quitará la bandera
     */      
    noVisibleBandera(tablero, i, j, casillero) {
        if (casillero.children[1] instanceof HTMLParagraphElement) {
            casillero.children[1].innerText = ``
            tablero[i][j].bandera = false
        } else {
            throw new Error("Error interno")
        }   
    }
}

class InputsPasados { // Clase que luego uso para crear un objeto con los valores de los inputs y guardarlo en localstorage
    constructor(cantidadDeFilas, cantidadDeColumnas, porcentajeDeGatos) {
        this.filas = cantidadDeFilas
        this.columnas = cantidadDeColumnas
        this.porcentGatos = porcentajeDeGatos
    }
}
