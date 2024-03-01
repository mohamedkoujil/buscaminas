function init() {
    let tablero = new Tablero(8,8,15)
    dom(tablero)
    
    
}

function dom (tablero) {
    let container = document.querySelector('#tablero')
    let idCasilla = 1

    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + i + '_' + q
            div.className = tablero.casillas[i][q].esMina()
            div.addEventListener('click', clickCasilla)
            container.appendChild(div)
            idCasilla++
        }
    }
}

function clickCasilla() {
    let coordenadas = event.target.id.split('_').slice(1,3)
    console.log(coordenadas[0])

}