var tablero = new Tablero(8, 8, 20)
var tableroCreado = false
var movimientos = 0



function init() {
    //console.log(tablero)
    gestMenu()
}

function addDom() {
    let container = document.querySelector('#tablero')

    for (let i in tablero.casillas[0]) {
        for (let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + q + '_' + i
            div.className = tablero.casillas[q][i].esMina()

            let img = document.createElement('img')
            img.src = "images/blank.gif"
            img.alt = "blank"
            img.className = "blank"

            div.appendChild(img)

            div.addEventListener('click', clickCasilla)
            div.addEventListener('contextmenu', clickDerechoCasilla)
            container.appendChild(div)
        }
    }
}

function clickCasilla(event) {
    let coordinates = event.currentTarget.id.split('_').slice(1, 3)
    let x = parseInt(coordinates[0])
    let y = parseInt(coordinates[1])

    if (!tablero.minasPlantadas) {
        tablero.plantarMinas([x, y])
    }

    if (tablero.casillas[x][y].esMina()) {
        perder()
    }

    tablero.casillas.forEach(fila => fila.forEach(casilla => {
        casilla.calcularMinasAlrededor(tablero)
    }))

    //console.log(tablero.casillas[x][y].minasAlrededor)

    tablero.destapar(x, y)

    revelarMinasRec(x, y)

    movimientos++
    mostrarMovimientos()
}

function revelarMinasRec(x, y) {
    tablero.casillas.forEach(fila => fila.forEach(casilla => {
        if (casilla.revelada && !casilla.reveladaDom) {
            imgFill(casilla.coordenadaX, casilla.coordenadaY)
            casilla.reveladaDom = true
        }
    }))
}

function imgFill(x, y) {
    let div = document.getElementById('_' + x + '_' + y)
    let img = document.createElement('img')

    console.log(tablero)
    img.src = "images/open" + tablero.casillas[x][y].minasAlrededor + ".gif"
    div.innerHTML = ''
    div.appendChild(img)
}


function clickDerechoCasilla(event) {
    event.preventDefault();
    let coordinates = event.currentTarget.id.split('_').slice(1, 3);

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    let casilla = tablero.casillas[x][y];

    let img = document.createElement('img');

    if (casilla.marcada) {
        if (!tablero.casillas[x][y].revelada) {
            img.src = "images/blank.gif";
            event.currentTarget.innerHTML = '';
            event.currentTarget.appendChild(img);
        }
        else {
            img.src = "images/open" + tablero.casillas[x][y].minasAlrededor + ".gif";
            event.currentTarget.innerHTML = '';
            event.currentTarget.appendChild(img);
        }

        casilla.desmarcar();

    } else {
        if (casilla.revelada) return;
        img.src = "images/bombflagged.gif";
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
        tablero.casillas[x][y].marcar();
    }

}


function revelarMinas() {
    for (let i in tablero.casillas[0]) {
        for (let q in tablero.casillas[i]) {
            let div = document.getElementById('_' + q + '_' + i);

            if (tablero.casillas[q][i].esMina()) {
                if (tablero.casillas[q][i].marcada) div.innerHTML = '';

                let img = document.createElement('img');
                img.src = "images/bombrevealed.gif";
                img.alt = "mina";
                img.className = "mina";
                div.innerHTML = '';
                div.appendChild(img);
            }

            div.removeEventListener('click', clickCasilla);
            div.removeEventListener('contextmenu', clickDerechoCasilla);
        }
    }
}


function ganar() {
    setTimeout(() => {
        alert('Has ganado');
        pantallaContinuar();
    }, 1000);
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



function gestMenu() {
    document.getElementById('botonIniciar').addEventListener('click', iniciar);
    document.getElementById('botonReiniciar').addEventListener('click', reiniciar);
}

function iniciar() {
    if (!tableroCreado) {
        addDom();
        tableroCreado = true;
        mostrarMovimientos();
    }
}

function reiniciar() {
    document.getElementById('tablero').innerHTML = '';
    tablero = new Tablero(8, 8, 10);
    console.clear();
    tableroCreado = false;
    movimientos = 0;
    iniciar()
}

function mostrarMovimientos() {
    let img = document.createElement('img');
    if(movimientos < 10) {
        img.src = "images/moves" + movimientos + ".gif";
    } else {
        img.src = "images/moves" + movimientos[0] + ".gif";
        let content = document.getElementById('imgMovimientos');
        content.appendChild(img);

    }
    
    let content = document.getElementById('imgMovimientos');
    content.innerHTML = '';
    content.appendChild(img);
}









