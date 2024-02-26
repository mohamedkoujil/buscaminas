class Casilla {
    coordenadaX;
    coordenadaY;
    marcada = false;
    #mina = 0;
    #minasAlrededor = 0;

    constructor(coordenadaX, coordenadaY){
        this.coordenadaX = coordenadaX
        this.coordenadaY = coordenadaY
    }

    minar() {
        this.#mina = 1
    }

    esMina() {
        if (this.#mina == 1) return true
        return false
    }

    calcularMinasVecinas(tablero) {
        
    }
}