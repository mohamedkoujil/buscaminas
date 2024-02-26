class Tablero {
    filas;
    columnas;
    minas;
    casillas = [];

    constructor(filas, columnas, minas) {
        this.filas = filas
        this.columnas = columnas
        this.minas = minas
        this.#generarTablero()
        this.#plantarMinas()
    }

    #generarTablero() {
        for(let i = 0; i<this.filas; i++) {
            let arr = []
            for(let q = 0; q<this.columnas; q++) {
                arr.push(new Casilla(q, i))
            }
            this.casillas.push(arr)
        }
    }

    #plantarMinas() {
        for (let i = 1; i<=this.minas; i++) {
            let x
            let y
            do {
                x = Math.floor(Math.random()*(this.columnas))
                y = Math.floor(Math.random()*(this.filas))
            } while (this.casillas[x][y].esMina())

            console.log(this.casillas[x][y])

            this.casillas[x][y].minar()
        }   
    }



}