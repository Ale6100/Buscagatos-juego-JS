class Casillero {
    constructor(estado) {
        this.estado = estado // oculto o visible
        this.gato = false   // sin gato
        this.gatosVecinos = null
        this.bandera = false // sin bandera (todavía no usado)
    }
}

class InputsPasados {
    constructor(cantidadDeFilas, cantidadDeColumnas, porcentajeDeGatos) {
        this.filas = cantidadDeFilas
        this.columnas = cantidadDeColumnas
        this.porcentGatos = porcentajeDeGatos
    }
}