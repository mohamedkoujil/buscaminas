const tablero = new Tablero(8,8,1)

function init() {
    
    addDom(tablero)
    console.log(tablero)
    tablero.casillas.forEach(fila => {fila.forEach(casilla => {if (casilla.esMina()) console.log(casilla)})})
    
}

function addDom () {
    let container = document.querySelector('#tablero')
    let idCasilla = 1

    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + q + '_' + i
            div.className = tablero.casillas[q][i].esMina()
            div.addEventListener('click', clickCasilla)
            div.addEventListener('contextmenu', clickDerechoCasilla)
            container.appendChild(div)
            idCasilla++
        }
    }
}

function clickCasilla(event) {

    
    let coordinates = event.target.id.split('_').slice(1, 3);

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    console.log(tablero.casillas[x][y]);

    if (tablero.casillas[x][y].esMina()) {
        perder();
        return;
    }

    let casilla = tablero.casillas[x][y];

    casilla.calularMinasAlrededor(tablero);
    event.target.innerHTML = casilla.minasAlrededor;

    let div = document.getElementById(event.target.id);
    tablero.casillas[x][y].revelada = true;
    div.removeEventListener('click', clickCasilla);

}

function clickDerechoCasilla(event) {
    event.preventDefault();
    let coordinates = event.target.id.split('_').slice(1, 3);

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    console.log(x,y)
    let casilla = tablero.casillas[x][y];

    if (casilla.marcada) {
        if(!tablero.casillas[x][y].revelada) event.target.innerHTML = '';
        else event.target.innerHTML = tablero.casillas[x][y].minasAlrededor;
        
        casilla.desmarcar();
    } else {
        event.target.innerHTML = '🚩';
        tablero.casillas[x][y].marcar();
    }


}


function perder() {
    revelarMinas();
    alert('Has perdido'); 
}


function revelarMinas() {

    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
            let div = document.getElementById('_' + q + '_' + i);

            if (tablero.casillas[q][i].esMina()) {
                div.innerHTML = '💣';
            }

            div.removeEventListener('click', clickCasilla);
            div.removeEventListener('contextmenu', clickDerechoCasilla);
        }
    }
}

function ganar() {
    alert('Has ganado');
}


function perder() {
    revelarMinas();
    setTimeout(() => {
        alert('Has perdido');
        pantallaContinuar();
    }, 1000);
    
}

function pantallaContinuar() {
    let continuar = confirm('¿Quieres seguir jugando?');

    if (continuar) {
        location.reload();
    }
}

