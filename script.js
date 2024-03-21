var tablero = new Tablero(8, 8, 25)
var tableroCreado = false
var dificultadTablero = 'facil'
var tiempo = 0
var movimientos = 0
var temporizador;


function init() {
    addDom();
    tableroCreado = true;
    mostrarMovimientos();
    gestMenu()
    gestAjustes()
    mostrarAjustes()
}

function addDom() {
    let container = document.querySelector('#tablero')
    container.innerHTML = ''
    console.log(tablero)
    for (let i in tablero.casillas[0]) {
        for (let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + q + '_' + i
            div.className = tablero.casillas[q][i].esMina()
            div.addEventListener('click', clickCasilla)
            div.addEventListener('contextmenu', clickDerechoCasilla)
            container.appendChild(div)
            addImg("images/blank.gif", div.id)
        }
    }
}

function addImg(src, containerId) {
    let container = document.getElementById(containerId);
    let img = document.createElement('img');
    img.src = src;
    container.innerHTML = '';
    container.appendChild(img);
}


function clickCasilla(event) {
    let coordinates = event.currentTarget.id.split('_').slice(1, 3)
    let x = parseInt(coordinates[0])
    let y = parseInt(coordinates[1])

    if (!tablero.minasPlantadas) tablero.plantarMinas([x, y])

    if (tablero.casillas[x][y].revelada) return; // Salir de la función si la casilla ya está revelada

    if (tablero.casillas[x][y].esMina()) perder(x, y)

    iniciarTemporizador(); // Llama a iniciarTemporizador() al hacer clic en una casilla.
    
    tablero.casillas.forEach(fila => fila.forEach(casilla => {
        casilla.calcularMinasAlrededor(tablero)
    }))
    tablero.destapar(x, y)

    revelarMinasRec(x, y)

    movimientos++
    mostrarMovimientos()
    tablero.casillas[x][y].revelada = true
}

function revelarMinasRec(x, y) {
    tablero.casillas.forEach(fila => fila.forEach(casilla => {
        if (casilla.revelada && !casilla.reveladaDom) {
            let src = "images/open" + tablero.casillas[casilla.coordenadaX][casilla.coordenadaY].minasAlrededor + ".gif"
            //console.log(src)
            let containerId = '_' + casilla.coordenadaX + '_' + casilla.coordenadaY
            addImg(src, containerId)
            casilla.reveladaDom = true
        }
    }))
}

function clickDerechoCasilla(event) {
    event.preventDefault();
    let coordinates = event.currentTarget.id.split('_').slice(1, 3);

    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);

    let casilla = tablero.casillas[x][y];
    if (casilla.marcada) {
        if (!tablero.casillas[x][y].revelada) {
            addImg("images/blank.gif", event.currentTarget.id);
        }
        else {
            let src = "images/open" + tablero.casillas[x][y].minasAlrededor + ".gif";
            addImg(src, event.currentTarget.id);
        }
        casilla.desmarcar();
    } else {
        let marcadas = 0;
        tablero.casillas.forEach(fila => fila.forEach(casilla => {if (casilla.marcada) marcadas++}));

        if (casilla.revelada || tablero.minas == marcadas) return;
        addImg("images/bombflagged.gif", event.currentTarget.id);
        tablero.casillas[x][y].marcar();
    }
}


function revelarMinas(x, y) {
    for (let i in tablero.casillas[0]) {
        for (let q in tablero.casillas[i]) {
            let div = document.getElementById('_' + q + '_' + i);
            if (tablero.casillas[q][i].esMina()) {
                if (tablero.casillas[q][i].marcada) div.innerHTML = '';
                addImg("images/bombrevealed.gif", div.id);
            }
            div.removeEventListener('click', clickCasilla);
            div.removeEventListener('contextmenu', clickDerechoCasilla);
        }
    }
    addImg("images/bombdeath.gif", "_" + x + "_" + y);
}


function ganar() {
    document.querySelector('#audioWin').play();
    setTimeout(() => {
        alert('Has ganado');
        pantallaContinuar();
    }, 1000);
}


function perder(x, y) {
    document.querySelector('#audioBomb').play();
    document.querySelector('#audioID').pause();
    revelarMinas(x, y);
    setTimeout(() => {
        alert('Has perdido');
        pantallaContinuar();
    }, 1000);
}

function pantallaContinuar() {
    let continuar = confirm('¿Quieres seguir jugando?');

    if (continuar) {
        reiniciar();
    } else window.close();
}



function gestMenu() {
    document.getElementById('imgEmoji').addEventListener('click', reiniciar);
}

function iniciar() {
    if (!tableroCreado) {
        addDom();
        tableroCreado = true;
        mostrarMovimientos();
    }
}

function reiniciar() {
    detenerTemporizador(); // Detener el temporizador antes de reiniciar
    movimientos = 0;
    tiempo = 0;
    reiniciarTemporizador(); // Reiniciar el temporizador
    document.getElementById('tablero').innerHTML = '';
    tablero = new Tablero(tablero.filas, tablero.columnas, tablero.minas);
    tableroCreado = false;
    iniciar();
}


function mostrarMovimientos() {
    if (movimientos < 10) {
        changeSrcImg('imgMovimientos1', "images/moves0.gif");
        changeSrcImg('imgMovimientos2', "images/moves" + movimientos + ".gif");
    } else {
        let firstDigit = Math.floor(movimientos / 10); // Obtiene el primer dígito
        let secondDigit = movimientos % 10; // Obtiene el segundo dígito
        changeSrcImg('imgMovimientos1', "images/moves" + firstDigit + ".gif");
        changeSrcImg('imgMovimientos2', "images/moves" + secondDigit + ".gif");
    }
}

function iniciarTemporizador() {
    if (temporizador > 0) return
    let segundos = 0;
    temporizador = setInterval(() => {
        segundos++;
        tiempo = segundos;
        mostrarTiempo(segundos);
    }, 1000);
}

function detenerTemporizador() {
    clearInterval(temporizador);
    temporizador = 0;
}

function mostrarTiempo(segundos) {
    if (segundos < 10) {
        changeSrcImg('imgTiempo1', "images/time0.gif");
        changeSrcImg('imgTiempo2', "images/time0.gif");
        changeSrcImg('imgTiempo3', "images/time" + segundos + ".gif");
    } else if (segundos < 100) {
        let firstDigit = Math.floor(segundos / 10); // Obtiene el primer dígito
        let secondDigit = segundos % 10; // Obtiene el segundo dígito
        changeSrcImg('imgTiempo1', "images/time0.gif");
        changeSrcImg('imgTiempo2', "images/time" + firstDigit + ".gif");
        changeSrcImg('imgTiempo3', "images/time" + secondDigit + ".gif");
    } else {
        let firstDigit = Math.floor(segundos / 100); // Obtiene el primer dígito
        let secondDigit = Math.floor((segundos % 100) / 10); // Obtiene el segundo dígito
        let thirdDigit = segundos % 10; // Obtiene el tercer dígito
        changeSrcImg('imgTiempo1', "images/time" + firstDigit + ".gif");
        changeSrcImg('imgTiempo2', "images/time" + secondDigit + ".gif");
        changeSrcImg('imgTiempo3', "images/time" + thirdDigit + ".gif");
    }

}

function changeSrcImg(id, src) {
    let img = document.getElementById(id);
    img.src = src;
}

// Llama a esta función al reiniciar el juego para restablecer el temporizador.
function reiniciarTemporizador() {
    detenerTemporizador(); // Detener el temporizador antes de reiniciar.
    mostrarTiempo(0);
}

function gestAjustes() {
    console.log('Gestión ajustes');
    document.querySelector('#btnAjustes').addEventListener('click', mostrarAjustes);
    document.querySelector('#submit').addEventListener('click', cambiarAjustes);
    document.querySelector('#audioToggle').addEventListener('click', toggleMusic);
    
}

function mostrarAjustes() {
    console.log('Mostrar ajustes');
    document.querySelector('#ajustes').style.display = 'flex';
}

function ocultarAjustes() {
    console.log('Ocultar ajustes');
    document.querySelector('#ajustes').style.display = 'none';

}

function cambiarAjustes() {
    setCookies(); //Por si se cambia solo el nick o el email
    ocultarAjustes();
    let dificultad = document.querySelector('#dificultadSelector').value;
    if (dificultadTablero == dificultad) return;
    dificultadTablero = dificultad;
    setCookies(); //Por si se cambia la dificultad
    switch (dificultad) {
        case 'facil':
            tablero = new Tablero(8, 8, 10);
            break;
        case 'medio':
            tablero = new Tablero(12, 12, 30);
            break;
        case 'dificil':
            tablero = new Tablero(16, 16, 99);
            break;
    }
    editarTamanoTablero(dificultad);
    reiniciar(); // Reiniciar el juego después de cambiar la dificultad
}


function editarTamanoTablero(dificultad) {
    let tablero = document.querySelector('#tablero');
    let width = 0;
    switch(dificultad) {
        case 'facil':
            width = 32;
            break;
        case 'medio':
            width = 48;
            break;
        case 'dificil':
            width = 64;
            break;
    }
    tablero.style.width = width + 'em';

}

function toggleMusic() {
    let audio = document.querySelector('#audioID');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    changeSrcImg('audioToggle', audio.paused ? "images/audioOff.png" : "images/audioOn.png");
}

function setCookies() {
    console.log('Setting cookies');
    let nick = document.querySelector('#nick').value;
    let email = document.querySelector('#emailJugador').value;
    if(movimientos == 0) crearCookie(nick, email, dificultadTablero, 0, 0);
    else crearCookie(nick, email, dificultadTablero, movimientos, tiempo);
    console.log(leerCookie());
}












