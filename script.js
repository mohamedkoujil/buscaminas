const tablero = new Tablero(8,8,10)

function init() {
    addDom(tablero)
    tablero.casillas.forEach(fila => {fila.forEach(casilla => {if (casilla.esMina()) console.log(casilla)})})
    
}

function addDom () {
    let container = document.querySelector('#tablero')


    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + q + '_' + i
            div.className = tablero.casillas[q][i].esMina()
            div.addEventListener('click', clickCasilla)
            div.addEventListener('contextmenu', clickDerechoCasilla)
            container.appendChild(div) 
        }
    }
}

function clickCasilla(event) {

    let coordinates = event.target.id.split('_').slice(1, 3);
    if (!tablero.minasPlantadas) {
        tablero.plantarMinas(coordinates);
    }
    

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    recursivaRevelarMinasHastaMina(x, y)

    if (tablero.casillas[x][y].esMina()) {
        perder();
        return;
    }

    let casilla = tablero.casillas[x][y];

    casilla.calularMinasAlrededor(tablero);
    if (casilla.minasAlrededor != 0) event.target.innerHTML = casilla.minasAlrededor;
    else event.target.innerHTML = "a";

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
    } else window.close();
}

function recursivaRevelarMinasHastaMina(x, y) {
    // Check if the coordinates are out of bounds
    if (x < 0 || y < 0 || x >= tablero.filas || y >= tablero.columnas) {
        return;
    }

    let casilla = tablero.casillas[x][y];

    // Check if the cell is a mine or has already been revealed
    if (casilla.esMina() || casilla.revelada) {
        console.log('esmina', casilla.esMina(), 'revelada', casilla.revelada)
        return;
    }

    // Remove click event listener for the current cell
    let div = document.getElementById('_' + x + '_' + y);
    div.removeEventListener('click', clickCasilla);

    // Reveal the content of the current cell
    casilla.calularMinasAlrededor(tablero);
    if (casilla.minasAlrededor !== 0) {
        div.innerHTML = casilla.minasAlrededor;
        return;
    } else {
        div.innerHTML = 'a';
    }

    // Mark the current cell as revealed
    casilla.revelada = true;

    // Recursively reveal neighboring cells
    for (let i = -1; i < 2; i++) {
        for (let q = -1; q < 2; q++) {
            recursivaRevelarMinasHastaMina(x + i, y + q);
        }
    }
}








