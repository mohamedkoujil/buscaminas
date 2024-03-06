class Casilla {
    coordenadaX;
    coordenadaY;
    marcada = false;
    #mina = 0;
    minasAlrededor = 0;
    revelada = false;

    constructor(coordenadaX, coordenadaY){
        this.coordenadaX = coordenadaX
        this.coordenadaY = coordenadaY
    }

    minar() {
        this.#mina = 1
    }

    mina() {
        return this.#mina
    }

    esMina() {
        if (this.#mina == 1) return true
        return false
    }

    marcar() {
        this.marcada = true
    }

    desmarcar() {
        this.marcada = false
    }

    calularMinasAlrededor(tablero) {
        let x = this.coordenadaX -1
        let y = this.coordenadaY -1

        for (let i = 0; i < 3; i++) {
            for (let q = 0; q < 3; q++) {
                if (x+i >= 0 && x+i < tablero.filas && y+q >= 0 && y+q < tablero.columnas) {
                    if (tablero.casillas[x+i][y+q].esMina()) {
                        this.minasAlrededor++
                        console.log(tablero.casillas[x+q][y+i])
                    }
                }
            }
        }
    }
}