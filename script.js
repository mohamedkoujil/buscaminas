var tablero = new Tablero(8, 8, 25)
var tableroCreado = false
var dificultadTablero = 'facil'
var tiempo = 0
var movimientos = 0
var temporizador;


function init() {
    // Mostrar ranking
    mostrarRanking();
    // Si no hay cookie, mostrar pantalla de configuracion
    if(leerCookie() == null || leerCookie().nick == undefined) {
        addDom();
        tableroCreado = true;
        mostrarMovimientos();
        activarBtnReiniciar()
        gestAjustes()
        mostrarAjustes()
    } else {
        gestionarDatosCookie();
    }
}

// // Agregar elementos de la interfaz de usuario
function addDom() {
    let container = document.querySelector('#tablero')
    container.innerHTML = ''
    for (let i in tablero.casillas[0]) {
        for (let q in tablero.casillas[i]) {
            let div = document.createElement('div')
            div.id = '_' + q + '_' + i
            div.className = 'casilla'
            div.addEventListener('click', clickCasilla)
            div.addEventListener('contextmenu', clickDerechoCasilla)
            container.appendChild(div)
            addImg("images/blank.gif", div.id)
        }
    }
    // Cambiar el tamaño del tablero y las casillas para que no hyan casillas sueltas
    editarTamanoTableroDom(dificultadTablero)
    editarTamanoCasillaDom(dificultadTablero)
}

// Agregar una imagen a un contenedor
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
    // Plantar minas si no se han plantado
    if (!tablero.minasPlantadas) tablero.plantarMinas([x, y])
    // Salir de la función si la casilla ya está revelada
    if (tablero.casillas[x][y].revelada) return; 
    // Perder si la casilla es una mina
    if (tablero.casillas[x][y].esMina()) perder(x, y);
    // Comprobar si el jugador ha ganado
    comprobarVictoria();
    // Llama a iniciarTemporizador() al hacer clic en una casilla.
    iniciarTemporizador(); 
    
    // Iterar sobre todas las casillas del tablero para calcular las minas alrededor
    tablero.casillas.forEach(fila => fila.forEach(casilla => {
        casilla.calcularMinasAlrededor(tablero)
    }))
    // Destapar la casilla
    tablero.destapar(x, y)
    // Revelar las minas
    revelarMinasRec(x, y)
    // Incrementar el contador de movimientos
    movimientos++
    // Actualizar el contador de movimientos en la interfaz de usuario
    mostrarMovimientos()
    tablero.casillas[x][y].revelada = true
}

function comprobarVictoria() {
    // Contador para las casillas no reveladas
    let casillasNoReveladas = 0;

    // Iterar sobre todas las casillas del tablero
    tablero.casillas.forEach(fila => {
        fila.forEach(casilla => {
            // Si la casilla no está revelada y no es una mina, incrementar el contador
            if (!casilla.revelada && !casilla.esMina()) {
                casillasNoReveladas++;
            }
        });
    });

    // Si todas las casillas no reveladas son minas, entonces el jugador ha ganado
    if (casillasNoReveladas === tablero.minas) {
        ganar();
    }
}

// Actualizar la interfaz de usuario ver las minas reveladas
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
        // Si el número de casillas marcadas es igual al número de minas, no permitir marcar más casillas
        let marcadas = 0;
        tablero.casillas.forEach(fila => fila.forEach(casilla => {if (casilla.marcada) marcadas++}));

        if (casilla.revelada || tablero.minas == marcadas) return;
        addImg("images/bombflagged.gif", event.currentTarget.id);
        tablero.casillas[x][y].marcar();
    }
}

// Revelar todas las minas en el tablero
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
    guardarRanking(document.querySelector('#nick').value, movimientos, tiempo, dificultadTablero);
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

// Función para activar el botón de reinicio.
function activarBtnReiniciar() {
    document.getElementById('imgEmoji').addEventListener('click', reiniciar);
}

// Función para iniciar el jueg al reniciar.
function iniciar() {
    if (!tableroCreado) {
        addDom();
        tableroCreado = true;
        mostrarMovimientos();
    }
}

// Función para reiniciar el juego.
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

// Función para mostrar los movimientos en la interfaz de usuario.
function mostrarMovimientos() {
    // Si el número de movimientos es menor que 10, actualizar un solo dígito.
    if (movimientos < 10) {
        changeSrcImg('imgMovimientos1', "images/moves0.gif");
        changeSrcImg('imgMovimientos2', "images/moves" + movimientos + ".gif");
    } else {
        // Si el número de movimientos es mayor o igual a 10, actualizar dos dígitos.
        let firstDigit = Math.floor(movimientos / 10); // Obtiene el primer dígito
        let secondDigit = movimientos % 10; // Obtiene el segundo dígito
        changeSrcImg('imgMovimientos1', "images/moves" + firstDigit + ".gif");
        changeSrcImg('imgMovimientos2', "images/moves" + secondDigit + ".gif");
    }
}

function iniciarTemporizador() {
    // Si el temporizador ya está en marcha, no hacer nada.
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
    // Si el número de segundos es menor que 10, actualizar un solo dígito.
    if (segundos < 10) {
        changeSrcImg('imgTiempo1', "images/time0.gif");
        changeSrcImg('imgTiempo2', "images/time0.gif");
        changeSrcImg('imgTiempo3', "images/time" + segundos + ".gif");
    } else if (segundos < 100) {
        // Si el número de segundos es mayor o igual a 10 y menor que 100, actualizar dos dígitos.
        let firstDigit = Math.floor(segundos / 10); // Obtiene el primer dígito
        let secondDigit = segundos % 10; // Obtiene el segundo dígito
        changeSrcImg('imgTiempo1', "images/time0.gif");
        changeSrcImg('imgTiempo2', "images/time" + firstDigit + ".gif");
        changeSrcImg('imgTiempo3', "images/time" + secondDigit + ".gif");
    } else {
        // Si el número de segundos es mayor o igual a 100, actualizar tres dígitos.
        let firstDigit = Math.floor(segundos / 100); // Obtiene el primer dígito
        let secondDigit = Math.floor((segundos % 100) / 10); // Obtiene el segundo dígito
        let thirdDigit = segundos % 10; // Obtiene el tercer dígito
        changeSrcImg('imgTiempo1', "images/time" + firstDigit + ".gif");
        changeSrcImg('imgTiempo2', "images/time" + secondDigit + ".gif");
        changeSrcImg('imgTiempo3', "images/time" + thirdDigit + ".gif");
    }

}

// Cambiar la imagen de un elemento img.
function changeSrcImg(id, src) {
    let img = document.getElementById(id);
    img.src = src;
}

// Llama a esta función al reiniciar el juego para restablecer el temporizador.
function reiniciarTemporizador() {
    detenerTemporizador(); // Detener el temporizador antes de reiniciar.
    mostrarTiempo(0);
}

// Agregar eventos a los elementos de la interfaz de usuario.
function gestAjustes() {;
    document.querySelector('#btnAjustes').addEventListener('click', mostrarAjustes);
    document.querySelector('#submit').addEventListener('click', cambiarAjustes);
    document.querySelector('#audioToggle').addEventListener('click', toggleMusic);
    
}

// Mostrar y ocultar la pantalla de ajustes.
function mostrarAjustes() {
    document.querySelector('#ajustes').style.display = 'flex';
}
function ocultarAjustes() {
    document.querySelector('#ajustes').style.display = 'none';

}

// Cambiar la dificultad del tablero.
function cambiarAjustes() {
    console.log(document.querySelector('#dificultadSelector').value);
    setCookies(); //Por si se cambia solo el nick o el email
    if (verificacionDatos()) ocultarAjustes();
    let dificultad = document.querySelector('#dificultadSelector').value;
    if (dificultadTablero == dificultad) return;
    dificultadTablero = dificultad;
    setCookies(); //Por si se cambia la dificultad
    cambiarTablero(dificultad);
    editarTamanoCasillaDom(dificultad);
    reiniciar();
}

// Cambiar el tamaño del tablero según la dificultad.
function cambiarTablero(dificultad) {
    console.log(dificultad);
    switch (dificultad) {
        case 'facil':
            tablero = new Tablero(8, 8, 10);
            break;
        case 'medio':
            tablero = new Tablero(12, 12, 30);
            break;
        case 'dificil':
            tablero = new Tablero(16, 16, 99);
            console.log(tablero);
            break;
    }
    editarTamanoTableroDom(dificultad);
}

// Cambiar el tamaño del tablero en la interfaz de usuario
function editarTamanoTableroDom(dificultad) {
    let tablero = document.querySelector('#tablero');
    let width = 0;
    switch(dificultad) {
        case 'facil':
            width = 32;
            break;
        case 'medio':
            width = 36;
            break;
        case 'dificil':
            width = 40;
            break;
    }
    tablero.style.width = width + 'em';
}

// Cambiar el tamaño de las casillas en la interfaz de usuario para mantener el tablero cuadrado
function editarTamanoCasillaDom(dificultad) {
    let casillas = document.querySelectorAll('#tablero div');
    let widthCasilla = 0;
    switch(dificultad) {
        case 'facil':
            widthCasilla = 4;
            break;
        case 'medio':
            widthCasilla = 3;
            break;
        case 'dificil':
            widthCasilla = 2.5;
            break;
    }
    casillas.forEach(casilla =>{
        casilla.style.width = widthCasilla + 'em'
        casilla.style.height = widthCasilla + 'em'
    });
}

// Función para reproducir o pausar la música.
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
    let nick = document.querySelector('#nick').value;
    let email = document.querySelector('#emailJugador').value;
    if(movimientos == 0) crearCookie(nick, email, dificultadTablero, 0, 0);
    else crearCookie(nick, email, dificultadTablero, movimientos, tiempo);
    console.log(leerCookie());
}

function gestionarDatosCookie() {
    let datos = leerCookie();
    document.querySelector('#datosUsr').appendChild(crearDiv('nickDatos',"Nick: "+datos.nick));
    document.querySelector('#nick').value = datos.nick;
    document.querySelector('#emailJugador').value = datos.email;
    document.querySelector('#datosUsr').appendChild(crearDiv('dificultadDatos',"Diff: "+datos.dificultad));
    document.querySelector('#dificultadSelector').value = datos.dificultad;
    dificultadTablero = datos.dificultad;
    cambiarTablero(dificultadTablero);
    addDom();
    gestAjustes();
    activarBtnReiniciar();
    mostrarMovimientos();
}

function crearDiv(id, data) {
    let div = document.createElement('div');
    div.id = id;
    div.innerHTML = data;
    return div;
}

// Función para verificar los datos del usuario.
function verificacionDatos() {
    if(verificarNick() && verificarEmail()) return true;
    return false;
}

// Función para verificar el nick del usuario.
function verificarNick() {
    let nick = document.querySelector('#nick');

    if (!nick.checkValidity()) {
        nick.classList.add('wrongInput');
        nick.value = '';
        nick.placeholder = 'Nick no válido!';
        nick.setCustomValidity('Nick no válido');
        return false;
    } else {
        nick.classList.remove('wrongInput');
        nick.setCustomValidity('');
        return true;
    }
}
// Función para verificar el email del usuario.
function verificarEmail() {
    let email = document.querySelector('#emailJugador');
    if (!email.checkValidity()) {
        email.classList.add('wrongInput');
        email.value = '';
        email.placeholder = 'Email no válido!';
        email.setCustomValidity('Email no válido');
        return false;
    } else {
        email.classList.remove('wrongInput');
        email.setCustomValidity('');
        return true;
    } 
}

// Crea un local storage con los datos del usuario
function guardarRanking(nick, movimientos, tiempo, dificultad) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ nick, movimientos, tiempo, dificultad });
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

// Obtener el ranking desde LocalStorage
function obtenerRanking() {
    return JSON.parse(localStorage.getItem('ranking')) || [];
}

// Ordenar el ranking por movimientos y tiempo
function ordenarRanking() {
    let ranking = obtenerRanking();
    ranking.sort((a, b) => {
        if (a.movimientos < b.movimientos) return -1;
        if (a.movimientos > b.movimientos) return 1;
        if (a.tiempo < b.tiempo) return -1;
        if (a.tiempo > b.tiempo) return 1;
        return 0;
    });
    return ranking;
}

// Mostrar el ranking en la interfaz de usuario
function mostrarRanking() {
    let ranking = ordenarRanking();
    let table = document.querySelector('#tablaRanking');
    table.innerHTML = '<tr><th>Pos</th><th>Nick</th><th>Tiempo</th><th>Moves</th><th>Diff</th></tr>';
    ranking.forEach((jugador, index) => {
        let tr = document.createElement('tr');
        tr.appendChild(crearTd(index + 1));
        tr.appendChild(crearTd(jugador.nick));
        tr.appendChild(crearTd(jugador.tiempo));
        tr.appendChild(crearTd(jugador.movimientos));
        tr.appendChild(crearTd(jugador.dificultad));
        table.appendChild(tr);
    });
    console.log(ranking);
}

function crearTd(innerInfo) {
    let td = document.createElement('td');
    td.innerHTML = innerInfo;
    return td;
}














