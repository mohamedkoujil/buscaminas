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
        if (this.#mina == 1) return -1;
    
        let x = this.coordenadaX - 1;
        let y = this.coordenadaY - 1;
    
        if (this.coordenadaX !== 0 && this.coordenadaX !== tablero.columnas && this.coordenadaY !== 0 && this.coordenadaY !== tablero.filas) {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    if (i !== 1 || j !== 1) {
                        if (tablero.casillas[x + i][y + j].esMina()) {
                            this.#minasAlrededor++;
                        }
                    }
                }
            }
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nuevaX = x + i;
                    let nuevaY = y + j;
                    if (nuevaX >= 0 && nuevaX < tablero.columnas && nuevaY >= 0 && nuevaY < tablero.filas && (i !== 0 || j !== 0)) {
                        if (tablero.casillas[nuevaX][nuevaY].esMina()) {
                            this.#minasAlrededor++;
                        }
                    }
                }
            }
        }
    
        return this.#minasAlrededor;
    }
    
}