function init() {
    console.log(crearTablero)
}

function crearTablero() {
    for(let i = 0; i==10; i++) {
        for(let q = 0; q==10; q++) {
            this.casillas[i][q] = new Casilla(i, q)
        }
    }
}