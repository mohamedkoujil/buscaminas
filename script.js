var tablero = new Tablero(8,8,10)
var tableroCreado = false

function init() {
    console.log(tablero)
    gestMenu()
}

function addDom () {
    let container = document.querySelector('#tablero')


    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
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
    console.log(event.currentTarget.id)
    let coordinates = event.currentTarget.id.split('_').slice(1, 3);
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

    var img = document.createElement('img');

    casilla.calularMinasAlrededor(tablero);

    if (casilla.minasAlrededor != 0){
        img.src = "images/open" + casilla.minasAlrededor + ".gif";
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
    } else {
        img.src = "images/open0.gif";
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
    }

    let div = document.getElementById(event.currentTarget.id);
    tablero.casillas[x][y].revelada = true;
    div.removeEventListener('click', clickCasilla);

}

function clickDerechoCasilla(event) {
    event.preventDefault();
    let coordinates = event.currentTarget.id.split('_').slice(1, 3);

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    let casilla = tablero.casillas[x][y];

    let img = document.createElement('img');

    if (casilla.marcada) {
        if(!tablero.casillas[x][y].revelada) {
            img.src = "images/blank.gif";
            event.currentTarget.innerHTML = '';
            event.currentTarget.appendChild(img);
        }
        else {
            img.src = "images/open"+ tablero.casillas[x][y].minasAlrededor +".gif";
            event.currentTarget.innerHTML = '';
            event.currentTarget.appendChild(img);
        } 
        
        casilla.desmarcar();

    } else {
        if(casilla.revelada) return;
        img.src = "images/bombflagged.gif";
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
        tablero.casillas[x][y].marcar();
    }

}


function revelarMinas() {

    for(let i in tablero.casillas[0]){
        for(let q in tablero.casillas[i]) {
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

    if (x < 0 || y < 0 || x >= tablero.filas || y >= tablero.columnas) {
        return;
    }

    let casilla = tablero.casillas[x][y];

    if (casilla.esMina() || casilla.revelada) {
        return;
    }

    let div = document.getElementById('_' + x + '_' + y);
    div.removeEventListener('click', clickCasilla);

    casilla.calularMinasAlrededor(tablero);

    let img = document.createElement('img');

    if (casilla.minasAlrededor !== 0 && !casilla.revelada) {
        img.src = "images/open" + casilla.minasAlrededor + ".gif";
        div.innerHTML = '';
        div.appendChild(img);
        return;
    } else {
        img.src = "images/open0.gif";
        div.innerHTML = '';
        div.appendChild(img);
    }

    casilla.revelada = true;

    for (let i = -1; i < 2; i++) {
        for (let q = -1; q < 2; q++) {
            recursivaRevelarMinasHastaMina(x + i, y + q);
        }
    }
}

function gestMenu() {
    document.getElementById('botonIniciar').addEventListener('click', iniciar);
    document.getElementById('botonReiniciar').addEventListener('click', reiniciar);
}

function iniciar() {
    if (!tableroCreado){
        addDom();
        tableroCreado = true;
    }
}

function reiniciar() {
    document.getElementById('tablero').innerHTML = '';
    tablero = new Tablero(8,8,10);
    console.clear();
    tableroCreado = false;
    iniciar()
}










