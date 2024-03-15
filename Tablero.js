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
            return
        }

        if (this.casillas[x][y].revelada) {
            return
        }

        if (tablero.casillas[x][y].minasAlerdedor > 0) {
            tablero.casillas[x][y].revelada = true
            return
        } else {
            //SI agua
            tablero.casillas[x][y].revelada = true
            let arrVecinos = this.obtenerVecinos(x, y);
            console.log(arrVecinos)
            for (let vecino of arrVecinos) {
               // if (!vecino.revelada) {
                    this.destapar(vecino.coordenadaX, vecino.coordenadaY);
                //}
            }
        }
    }

    obtenerVecinos(x, y) {
        let newX = x-1;
        let newY = y-1;
        let arrVecinos = [];
    
        for (let i = 0; i < 3; i++) {
            for (let q = 0; q < 3; q++) {
                if (newX >= 0 && newX < this.filas && newY >= 0 && newY < this.columnas) {
                    //console.log("DestiaparVecinos"+newX, newY-"--");
                    arrVecinos.push(this.casillas[newX][newY]);
                }
            }
        }
    
        return arrVecinos;
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