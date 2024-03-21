function crearCookie(nick, email, dificultad, movimientos, tiempo) {
    document.cookie = "nick=" + nick;
    document.cookie = "email=" + email;
    document.cookie = "dificultad=" + dificultad;
    document.cookie = "movimientos=" + movimientos;
    document.cookie = "tiempo=" + tiempo;
    console.log(dificultad);
}

function leerCookie() {
    let cookie = document.cookie;
    let datos = cookie.split(';');
    let datosUsuario = {};
    datos.forEach(dato => {
        let [key, value] = dato.split('=');
        datosUsuario[key.trim()] = value;
    });
    return datosUsuario;
}


function borrarCookie() {
    document.cookie = "nick=; email=; dificultad=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}