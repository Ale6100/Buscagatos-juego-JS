class Casillero {
    constructor() {
        this.estado = "oculto" // "oculto" o "visible"
        this.gato = false   // sin gato o con gato (false o true)
        this.gatosVecinos = null // "" o un número (por defecto no es ninguno)
        this.bandera = false // (todavía no usado)
    }

    visible(tablero, i, j, casillero) {
        casillero.classList.remove("casilleroOculto") // el casillero ya no tiene un color referenciando estar oculto, sino visible
        casillero.classList.add("casilleroVisible")
        tablero[i][j].estado = "visible" // El objeto asociado a ese casillero también pasa a estar visible
        casillero.classList.remove("textoOculto") // Remueve la propiedad que hacía que el texto no se vea
    }
}

class InputsPasados {
    constructor(cantidadDeFilas, cantidadDeColumnas, porcentajeDeGatos) {
        this.filas = cantidadDeFilas
        this.columnas = cantidadDeColumnas
        this.porcentGatos = porcentajeDeGatos
    }
}