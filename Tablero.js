class Tablero {
    filas;
    columnas;
    minas;
    casillas = [];
    minasPlantadas = false;

    constructor(filas, columnas, minas) {
        this.filas = filas;
        this.columnas = columnas;
        this.minas = minas;
        this.#generarTablero();
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

    plantarMinas(coordinates) {
        this.minasPlantadas = true;

        if (this.minas > this.filas * this.columnas) {
            throw new Error("Number of mines exceeds the number of cells.");
        }

        for (let i = 1; i <= this.minas; i++) {
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * this.columnas);
                y = Math.floor(Math.random() * this.filas);
                console.log(x,y)
            } while (this.casillas[x][y].esMina() || (x == coordinates[0] && y == coordinates[1]));

            this.casillas[x][y].minar();

        }
    }

    recursivaRevelarMinasHastaMina(x, y) {
        if (x < 0 || y < 0 || x >= this.filas || y >= this.columnas) {
            return;
        }

        let casilla = this.casillas[x][y];

        if (casilla.esMina() || casilla.revelada || casilla.minasAlrededor > 0) {
            return;
        }

        casilla.revelada = true;

        for (let i = -1; i < 2; i++) {
            for (let q = -1; q < 2; q++) {
                this.recursivaRevelarMinasHastaMina(x + i, y + q);
            }
        }
    }
}