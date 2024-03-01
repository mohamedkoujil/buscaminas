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

    mina() {
        return this.#mina
    }

    esMina() {
        if (this.#mina == 1) return true
        return false
    }

    calcularMinasVecinas(tablero) {
        let x = this.coordenadaX -1
        let y = this.coordenadaY -1

        for (let i = 0; i<3; i++) {
            for(let q = 0; q<3; q++) {
                console.log(x+i, y+q)
            }
        }
        
        return this.#minasAlrededor
    }
    
    get minas() {
        return this.#minasAlrededor
    }
}