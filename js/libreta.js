//------------------>FUNCIONES
//se recibe el tiempo en minutos
function autoGuardar(tiempo){
    if(sesion.timer.timerId > -1){
        limpiarAutoGuardar(sesion.timer.timerId);
    }
    //calcular tiempo en milisegundos 60000 = 1 min
    var mili = parseInt(tiempo) * 60000;
    var timeId = setInterval(function(){
        $("#guardarTexto").click();
        fechaUltimaVezGuardado();
    }, mili);
    sesion.timer.timerId = timeId;
    $("#alertAutoGuardado").text("Guardado automatico ejecuntandose cada " + tiempo + " minuto(s)");
    $("#alertAutoGuardado").show();
}

function limpiarAutoGuardar(id){
    clearInterval(id);
}

function fechaUltimaVezGuardado(){
    var fecha = new Date();
    var fechaString = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + fecha.getMinutes();
    $("#ultimaVezGuardado").html("Ultima vez guardado: " + fechaString);
    var inter = setInterval(() => {
        $("#ultimaVezGuardado").fadeOut(500, function(){
            $("#ultimaVezGuardado").fadeIn(500)
        });
    }, 3000);

    setTimeout(() => {
        clearInterval(inter);
    }, 3500);
    // $("#ultimaVezGuardado").addClass("animate animate__bounce");
    // $("#ultimaVezGuardado").on("animationend", function(){
    //     $(this).remove();
    // });
}

function validarBotones(){
    if(sesion.timer.timerId > -1){
        $("#btnDetenerAutoGuardar").show();
    }else{
        $("#btnDetenerAutoGuardar").hide();
    }
}

function obtenerTexto(){
    $.ajax({
        data: {
            idTexto: sesion.escrito.id,
            perfil: sesion.usuario.perfil
        },
        url:   '../php/libreta/obtenerTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                        console.log("Error: " + response);
                    break;
                case response != "null":
                    var data = JSON.parse(response);
                    sesion.escrito.cantidadfilas = data.length;
                    sesion.escrito.version = data[0].Version;
                    sesion.escrito.titulo = unescape(data[0].Titulo);
                    sesion.escrito.genero = unescape(data[0].Genero);
                    insertarTexto(data);
                    break;
            }
        }
    });
}

function insertarTexto(texto){
    $("#titulo").html(sesion.escrito.titulo);
    var escrito = "";
    for(var t = 0; t < texto.length; t++){
        if(t == texto.length - 1){
            escrito += unescape(texto[t].Texto);
        }else{
            escrito += unescape(texto[t].Texto) + "\n";
        }
        sesion.escrito.texto.push(unescape(texto[t].Texto));
    }
    agregarversiones();
    //$("#versionTexto").html("Versión: "+ sesion.escrito.version);
    $("#hojaTexto").val(escrito);
    $("#hojaTexto").focus();
    loader(false);
}



function seccionarTexto(){
    /**
     * se compara el texto nuevo con el texto obtenido.
     * si el texto nuevo es mayor al obtenido, se comparan los textos por index para ver cual se va a actualizar y cuales se van a crear.
     * si el texto nuevo es menor al obtenido, se comparan los textos por index para ver cual se va a actualizar y cuales se van a borrar.
     */
    var nuevoTexto = $("#hojaTexto").val().split("\n");
    var result = {
        upd:  [],
        del:  [],
        crear: []
    };
    switch(true){
        case nuevoTexto.length == sesion.escrito.cantidadfilas:
            for(var a = 0; a < nuevoTexto.length; a++){
                if(nuevoTexto[a] != sesion.escrito.texto[a]){
                    result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    sesion.escrito.texto[a] = nuevoTexto[a];
                    actualizarTexto(a, escape(nuevoTexto[a]));
                }
            }
            break;
        case nuevoTexto.length > sesion.escrito.cantidadfilas:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < nuevoTexto.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(sesion.escrito.texto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(nuevoTexto[a] != sesion.escrito.texto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        sesion.escrito.texto[a] = nuevoTexto[a];
                        actualizarTexto(a, escape(nuevoTexto[a]));
                    }
                }else{
                    result.crear.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    sesion.escrito.texto.push(nuevoTexto[a]);
                    crearTexto(a, escape(nuevoTexto[a]));
                }
            }
            break;
        case nuevoTexto.length < sesion.escrito.cantidadfilas:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < sesion.escrito.cantidadfilas; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(nuevoTexto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(sesion.escrito.texto[a] != nuevoTexto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        sesion.escrito.texto[a] = nuevoTexto[a];
                        actualizarTexto(a, escape(nuevoTexto[a]));
                    }
                }else{
                    result.del.push({'index': a, 'texto': escape(sesion.escrito.texto[a])});
                    sesion.escrito.texto.splice(a, 1);
                    borrarTexto(a, escape(nuevoTexto[a]));
                }
            }
            break;
        default: break;
    }
    console.log(result);
    if(result.upd.length > 0 || result.del.length > 0 || result.crear.length > 0){
        fechaUltimaVezGuardado();
    }
}

function actualizarTexto(index, texto){
    $.ajax({
        data: {
            idx: index,
            txt: texto.trim(),
            idTexto: sesion.escrito.id,
            perfil: sesion.usuario.perfil
        },
        url:   '../php/libreta/actualizar.php',
        type:  'post',
        beforeSend: function () {
            console.log("Enviando datos...");
        },
        success: function (response) {
           //validar conexion...
           console.log(response);
        }
    });
}

function borrarTexto(index){
    $.ajax({
        data: {
            idx: index,
            idTexto: sesion.escrito.id,
            perfil: sesion.usuario.perfil,
            version: sesion.escrito.version
        },
        url:   '../php/libreta/borrar.php',
        type:  'post',
        beforeSend: function () {
            console.log("Enviando datos...");
        },
        success: function (response) {
           //validar conexion...
           console.log(response);
        }
    });
}

function crearTexto(index, texto){
    $.ajax({
        data: {
            idx: index,
            txt: texto.trim(),
            idTexto: sesion.escrito.id,
            perfil: sesion.usuario.perfil,
            titulo: escape(sesion.escrito.titulo),
            version: sesion.escrito.version,
            genero: escape(sesion.escrito.genero)
        },
        url:   '../php/libreta/crear.php',
        type:  'post',
        beforeSend: function () {
            // console.log("Enviando datos...");
        },
        success: function (response) {
        //    console.log(response);
        }
    });
}

function actualizarTituloGenero(){
    var titulo = $("#tituloEditar").val().trim();
    var genero = $("#generoEditar").val().trim();
    if(titulo.length > 0 || genero.length > 0){
        if(genero != sesion.escrito.genero){
            actualizarGenero(genero);
        }

        if(titulo != sesion.escrito.titulo){
            actualizarTitulo(titulo);
        }

    }else{
        alert("los campos no pueden estar vacios.");
    }
}

function actualizarTitulo(titulo){
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil,
            idtexto: sesion.escrito.id,
            titulo: escape(titulo)
        },
        url:   '../php/libreta/actualizarTitulo.php',
        type:  'post',
        beforeSend: function () {
            loader(true);
        },
        success: function (response) {
            loader(false);
            switch(true){
                case response == "true":
                    sesion.escrito.titulo = titulo;
                    $("#titulo").html(titulo);
                    mostrarEditar(false);
                    break;
                case response == "Duplicado":
                    alert("El titulo que intentas actualizar ya se encuentra asignado a otro texto.");
                    $("#titulo").html(sesion.escrito.titulo);
                    $("#tituloEditar").val(sesion.escrito.titulo);
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        },
        error: function(error){
            console.log(error);
            loader(false);
        }
    });
}

function actualizarGenero(genero){
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil,
            idtexto: sesion.escrito.id,
            genero: escape(genero)
        },
        url:   '../php/libreta/actualizarGenero.php',
        type:  'post',
        beforeSend: function () {
            loader(true);
        },
        success: function (response) {
            loader(false);
            switch(true){
                case response == "true":
                    sesion.escrito.genero = genero;
                    mostrarEditar(false);
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        },
        error: function(error){
            console.log(error);
            loader(false);
        }
    });
}

function verDiferencias(){
    $(".del-compare").remove();
    var nuevoTexto = $("#hojaTexto").val().split("\n");
    var result = {
        upd:  [],
        del:  [],
        crear: []
    };
    switch(true){
        case nuevoTexto.length == sesion.escrito.cantidadfilas:
            for(var a = 0; a < nuevoTexto.length; a++){
                if(nuevoTexto[a] != sesion.escrito.texto[a]){
                    result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                }else{
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + nuevoTexto[a] + '</button>');
                }
            }
            break;
        case nuevoTexto.length > sesion.escrito.cantidadfilas:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < nuevoTexto.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(sesion.escrito.texto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(nuevoTexto[a] != sesion.escrito.texto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + nuevoTexto[a] + '</button>');
                    }
                }else{
                    result.crear.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-success del-compare">' + nuevoTexto[a] + '</button>');
                }
            }
            break;
        case nuevoTexto.length < sesion.escrito.cantidadfilas:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < sesion.escrito.cantidadfilas; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(nuevoTexto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(sesion.escrito.texto[a] != nuevoTexto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + sesion.escrito.texto[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }
                }else{
                    result.del.push({'index': a, 'texto': escape(sesion.escrito.texto[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action text-danger del-compare">' + sesion.escrito.texto[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                }
            }
            break;
        default: break;
    }
    console.log(result);
    $("#verA").html("Version anterior");
    $("#verB").html("Version actual");
    $("#pillCreados").html(result.crear.length);
    $("#pillActualizados").html(result.upd.length);
    $("#pillEliminados").html(result.del.length);
}

function mostrarEditar(mostrar){
    if(mostrar){
        $(".texto-lectura").hide();
        $(".texto-editar").show();
        $("#tituloEditar").val(sesion.escrito.titulo);
        $("#generoEditar").val(sesion.escrito.genero);
    }

    if(!mostrar){
        $(".texto-lectura").show();
        $(".texto-editar").hide();
    }
}

function detenerAutoGuardar(){
    if(sesion.timer.timerId > -1){
        limpiarAutoGuardar(sesion.timer.timerId);
        sesion.timer.timerId = -1;
    }
    $("#selectMinutos").val("");
    $("#alertAutoGuardado").text("");
    $("#alertAutoGuardado").hide();
}

function versionSeleccionada(version){
    $.ajax({
        data: {
            version: version,
            perfil: sesion.usuario.perfil,
            id: sesion.escrito.id
        },
        url:   '../php/libreta/versionSeleccionada.php',
        type:  'post',
        beforeSend: function () {
            console.log("Obteniendo Version seleccionada...");
        },
        success: function (response) {
           if(response.startsWith("Connection:")){
               console.log("Error: " + response)
           }else if(response != "null"){
               var data = JSON.parse(response);
               verVersionSeleccionada(data);
           }
        }
    });
}

function verVersionSeleccionada(data){
    var texto = unescape(data[0].Titulo) + "<br/><br/>";
    for(var a = 0; a < data.length; a++){
        texto += unescape(data[a].Texto) + "<br/>";
    }
    $("#modalVersionSeleccionadaTitle").html("Estás viendo la versión #" + data[0].Version);
    $("#verVersionSeleccionada").html(texto);
    $("#modalVersionSeleccionada").modal("show");
}

function compararUltimaVersion(){
    if(sesion.timer.timerId > -1){
        alert("Debes detener el guardado automatico para poder realizar la comparacion.");
    }else{
        $("#modalComparar").modal("show");
        verDiferencias();
    }
}

function diferenciasVersiones(data){
    $(".del-compare").remove();
    var a =  $("#previousVersion").val();
    var b = $("#currentVersion").val();
    var verA = [];
    var verB = [];
    for(var v = 0; v < data.length; v++){
        if(data[v].Version == a){
            verA.push(data[v]);
        }else if(data[v].Version == b){
            verB.push(data[v]);
        }
    }
    console.log("A: ", verA);
    console.log("B: ", verB);
    var result = {
        upd:  [],
        del:  [],
        crear: []
    };
    switch(true){
        case verB.length == verA.length:
            for(var a = 0; a < verB.length; a++){
                if(verB[a].Texto != verA[a].Texto){
                    result.upd.push({'index': a, 'texto': verB[a].Texto});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + unescape(verB[a].Texto) + '</button>');
                }else{
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verB[a].Texto) + '</button>');
                }
            }
            break;
        case verB.length > verA.length:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < verB.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(verA[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(verB[a].Texto != verA[a].Texto){
                        result.upd.push({'index': a, 'texto': verB[a].Texto});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + unescape(verB[a].Texto) + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verB[a].Texto) + '</button>');
                    }
                }else{
                    result.crear.push({'index': a, 'texto': verB[a].Texto });
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-success del-compare">' + unescape(verB[a].Texto) + '</button>');
                }
            }
            break;
        case verB.length < verA.length:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < verA.length; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(verB[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(verA[a].Texto != verB[a].Texto){
                        result.upd.push({'index': a, 'texto': verB[a].Texto});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + unescape(verB[a].Texto) + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + unescape(verA[a].Texto) + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + unescape(verB[a].Texto) + '</button>');
                    }
                }else{
                    result.del.push({'index': a, 'texto': verB[a].Texto});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action text-danger del-compare">' + unescape(verA[a].Texto) + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                }
            }
            break;
        default: break;
        console.log(result);
        $("#pillCreados").html(result.crear.length);
        $("#pillActualizados").html(result.upd.length);
        $("#pillEliminados").html(result.del.length);
        $("#verA").html("Version : " + verA[0].Version);
        $("#verB").html("Version : " + verB[0].Version);
    }
}

function agregarversiones(){
    var options = addOptionVersiones(parseInt(sesion.escrito.version));
    $("#previousVersion").html(options);
    $("#currentVersion").html(options);
    $("#viewVersion").html(options);
}

function getVersiones(){
    var a =  $("#previousVersion").val();
    var b = $("#currentVersion").val();
    $.ajax({
        data: {
            perfil: sesion.usuario.perfil,
            id: sesion.escrito.id,
            verA: a,
            verB: b
        },
        url: '../php/libreta/getVersiones.php',
        type: 'post',
        beforeSend: function () {
            console.log("Creando nueva version...");
        },
        success: function (response) {
            if(response.startsWith("Connection")){
                console.log("Error: " + response);
            }else if(response != "null"){
                var data = JSON.parse(response);
                console.log(data);
                diferenciasVersiones(data);
            }
        }
    });
}

function enviarTextoTaller(){
    $("#guardarTexto").click();
    $.ajax({
        data: {
            id: sesion.escrito.id,
            perfil: sesion.usuario.perfil,
            version: sesion.escrito.version
        },
        url:   '../php/perfil/EnviarTextoTaller.php',
        type:  'post',
        beforeSend: function(){
            loader(true);
            console.log("Enviando texto al taller...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    loader(false);
                    console.log("Error: " + response);
                    break;
                case response.startsWith("true"):
                    window.location = "perfil.html";
                    break;   
                case response.startsWith("Invalido"):
                    alert(response);
                    break;
            }
        }
    });
}

function crearNuevaVersion(){
    loader(true);
    var texto = $("#hojaTexto").val().split("\n");
    var version = parseInt(sesion.escrito.version) + 1;
    for(var t = 0; t < texto.length; t++){
        $.ajax({
            data: {
                perfil: sesion.usuario.perfil,
                id: sesion.escrito.id,
                text: escape(texto[t]),
                version: version,
                titulo: escape(sesion.escrito.titulo),
                index: t
            },
            url:   '../php/libreta/nuevaVersion.php',
            type:  'post',
            beforeSend: function () {
                console.log("Creando nueva version...");
            },
            success: function (response) {
                if(response === "true") {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }else if(response.startsWith("Connection")) console.log("Error: " + response);
            }
        });
    }
}

//------------------->triggers
$(document).ready(function(){
    loader(true);
    if(checkCookie("perfilId") && checkCookie("escritoid")){
        $(".datos-texto-editar").hide();
        sesion.usuario.perfil = getCookie("perfilId");
        sesion.escrito.id = getCookie("escritoid");
        mostrarEditar(false);
        $("#alertAutoGuardado").hide();
        obtenerTexto();
    }else{
       window.location.href = "index.html";
    }
});

$("#guardarTexto").click(function(){
    seccionarTexto();
});

$("#icono_autoguardar").click(validarBotones);

$("#btnAutoGuardar").click(function(){
    autoGuardar($("#selectMinutos").val());
});

$("#actualizarTitulo").click(function(){
    actualizarTituloGenero();
});

$("#btnDetenerAutoGuardar").click(function(){
    detenerAutoGuardar();
});

$("#comparar").click(function(){
    compararUltimaVersion();
});

$("#editarTitulo").click(function(){
    mostrarEditar(true);
});

$("#cancelarEditarTitulo").click(function(){
    mostrarEditar(false);
});

$("#crearVersion").click(function(){
    crearNuevaVersion();
});

$("#compareVersiones").click(function(){
    getVersiones();
});

$("#viewVersion").change(function(){
    //obtener version seleccionada.
    versionSeleccionada($(this).val());
});

$("#btnVersionSeleccionada").click(function(){
    $("#viewVersion").val(sesion.escrito.version);
});

$("#enviarTaller").click(enviarTextoTaller);

loader(false)