class Tablero {
    filas;
    columnas;
    minas;
    casillas = [];

    constructor(filas, columnas, minas) {
        this.filas = filas;
        this.columnas = columnas;
        this.minas = minas;
        this.#generarTablero();
        this.#plantarMinas();

    }

    #generarTablero() {
        for (let i = 0; i < this.filas; i++) {
            let fila = [];
            for (let q = 0; q < this.columnas; q++) {
                fila.push(new Casilla(i, q));
            }
            this.casillas.push(fila);
        }
    }

    #plantarMinas() {
        if (this.minas > this.filas * this.columnas) {
            throw new Error("Number of mines exceeds the number of cells.");
        }

        for (let i = 1; i <= this.minas; i++) {
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * this.columnas);
                y = Math.floor(Math.random() * this.filas);
            } while (this.casillas[x][y].esMina());

            this.casillas[x][y].minar();
            console.log(x, y);
        }
    }

}