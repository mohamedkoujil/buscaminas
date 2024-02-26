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
        let x = this.coordenadaX -1
        let y = this.coordenadaY -1

        for (let i = 0; i<3; i++) {
            if (x != 0 && x+2 != tablero.columnas && y) {}
        }
        
        return this.#minasAlrededor
    }
    
    get minas() {
        return this.#minasAlrededor
    }
}