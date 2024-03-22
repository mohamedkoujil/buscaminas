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
            } while (this.casillas[x][y].esMina() || (x == coordinates[0] && y == coordinates[1]));
            
            this.casillas[x][y].minar();

        }
    }

    destapar(x, y) {
        if (this.casillas[x][y].esMina()) {
            return;
        }
    
        if (this.casillas[x][y].revelada) {
            return;
        }
    
        this.casillas[x][y].revelada = true;
    
        if (this.casillas[x][y].minasAlrededor > 0) {
            return; // Si hay minas alrededor, no revelar más casillas.
        } else {
            let arrVecinos = this.obtenerVecinos(x, y);
            for (let vecino of arrVecinos) {
                if (!vecino.revelada) {
                    this.destapar(vecino.coordenadaX, vecino.coordenadaY);
                }
            }
        }
    }
    
    

    obtenerVecinos(x, y) {
        let arrVecinos = [];
    
        // Iterar sobre un rango de -1 a 1 para generar vecinos
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // Ignorar la casilla actual
                if (i == 0 && j == 0) continue;
    
                let newX = x + i;
                let newY = y + j;
    
                // Verificar si las coordenadas están dentro de los límites del tablero
                if (this.esCasillaValida(newX, newY)) {
                    arrVecinos.push(this.casillas[newX][newY]);
                }
            }
        }
    
        return arrVecinos;
    }
    
    esCasillaValida(x, y) {
        return x >= 0 && x < this.filas && y >= 0 && y < this.columnas;
    }
    
    
    

        //Soy bomba?? --> Salgo

        //Recursividad empieza aqui
        //Soy numero --> Me destapo y no hago nada mas
        //Soy agua.
            //me destapo
            //FUNCION recuperar mis 8 vecinos en un array --> Comprobando que estan dentro de los limites.
            //for de mis vecinos
                //llamo a funcion recursiva.



    
}