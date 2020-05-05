$(document).ready(function(){
    //validar mayusculas y minusculas
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };
    $(".datos-texto-editar").hide();
    var result = parametrosUrl();
    datosTexto.ti = result.ti;
    datosTexto.upi = result.upi;
    datosTexto.ttl = unescape(result.ttx);
    $("#volver").attr("href", "perfil.html?upi=" + datosTexto.upi);
    $("#titulo").html(datosTexto.ttl);
    obtenerTexto();
});

//------------------>FUNCIONES
//se recibe el tiempo en minutos
function autoGuardar(tiempo){
    if(timer.timerId > -1){
        limpiarAutoGuardar(timer.timerId);
    }
    //calcular tiempo en milisegundos 60000 = 1 min
    var mili = parseInt(tiempo) * 60000;
    var timeId = setInterval(function(){
        $("#guardarTexto").click();
        fechaUltimaVezGuardado();
    }, mili);
    timer.timerId = timeId;
}

function limpiarAutoGuardar(id){
    clearInterval(id);
}

function fechaUltimaVezGuardado(){
    var fecha = new Date();
    var fechaString = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + fecha.getMinutes();
    $("#ultimaVezGuardado").html("Ultima vez guardado: " + fechaString);
}

function obtenerTexto(){
    $.ajax({
        data: {
            idTexto: datosTexto.ti,
            perfil: datosTexto.upi
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
                    console.log(data);
                    datosTexto.lt = data.length;
                    insertarTexto(data);
                    break;   
            }
        }
    });
}

function insertarTexto(texto){
    var escrito = "";
    for(var t = 0; t < texto.length; t++){
        if(t == texto.length - 1){
            escrito += unescape(texto[t].Texto);
        }else{
            escrito += unescape(texto[t].Texto) + "\n";
        }
        datosTexto.tx.push(unescape(texto[t].Texto));
    }
    $("#hojaTexto").val(escrito);
    $("#hojaTexto").focus();
}

function parametrosUrl(){
    var result = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        result[key] = value;
    });
    return result;
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
        case nuevoTexto.length == datosTexto.lt:
            for(var a = 0; a < nuevoTexto.length; a++){
                if(nuevoTexto[a] != datosTexto.tx[a]){
                    result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    datosTexto.tx[a] = nuevoTexto[a];
                    actualizarTexto(a, escape(nuevoTexto[a]));
                }
            }
            break;
        case nuevoTexto.length > datosTexto.lt:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < nuevoTexto.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(datosTexto.tx[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(nuevoTexto[a] != datosTexto.tx[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        datosTexto.tx[a] = nuevoTexto[a];
                        actualizarTexto(a, escape(nuevoTexto[a]));
                    }
                }else{
                    result.crear.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    datosTexto.tx.push(nuevoTexto[a]);
                    crearTexto(a, escape(nuevoTexto[a]));
                }
            }
            break;
        case nuevoTexto.length < datosTexto.lt:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < datosTexto.lt; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(nuevoTexto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(datosTexto.tx[a] != nuevoTexto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        datosTexto.tx[a] = nuevoTexto[a];
                        actualizarTexto(a, escape(nuevoTexto[a]));
                    }
                }else{
                    result.del.push({'index': a, 'texto': escape(datosTexto.tx[a])});
                    datosTexto.tx.splice(a, 1);
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
            txt: texto,
            idTexto: datosTexto.ti,
            perfil: datosTexto.upi,
            titulo: escape(datosTexto.ttl)
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

function borrarTexto(index, texto){
    $.ajax({
        data: {
            idx: index,
            idTexto: datosTexto.ti,
            perfil: datosTexto.upi
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
            txt: texto,
            idTexto: datosTexto.ti,
            perfil: datosTexto.upi,
            titulo: escape(datosTexto.ttl)
        },
        url:   '../php/libreta/crear.php',
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

function actualizarTitulo(){
    var tit = $("#tituloEditar").val();
    $.ajax({
        data: {
            idperfil: datosTexto.upi,
            idtexto: datosTexto.ti,
            titulo: escape(tit),
        },
        url:   '../php/libreta/actualizarTitulo.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando titulo...");
        },
        success: function (response) {
            switch(true){
                case response == "true":
                    $("#titulo").html(tit);
                    datosTexto.ttl = tit;
                    alert("Titulo actualizado correctamente.");
                    break;
                case response == "Duplicado":
                    alert("Ese titulo ya se encuentra asignado a otro texto.");
                    $("#titulo").html(datosTexto.ttl);
                    break;
                case response.startsWith("Connection"):
                    datosTexto.ttl = tit;
                    console.log("Error: " + response);
                    break;
            }
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
        case nuevoTexto.length == datosTexto.lt:
            for(var a = 0; a < nuevoTexto.length; a++){
                if(nuevoTexto[a] != datosTexto.tx[a]){
                    result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                }else{
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + nuevoTexto[a] + '</button>');
                }
            }
            break;
        case nuevoTexto.length > datosTexto.lt:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < nuevoTexto.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(datosTexto.tx[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(nuevoTexto[a] != datosTexto.tx[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + nuevoTexto[a] + '</button>');
                    }
                }else{
                    result.crear.push({'index': a, 'texto': escape(nuevoTexto[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-success del-compare">' + nuevoTexto[a] + '</button>');
                }
            }
            break;
        case nuevoTexto.length < datosTexto.lt:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < datosTexto.lt; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(nuevoTexto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(datosTexto.tx[a] != nuevoTexto[a]){
                        result.upd.push({'index': a, 'texto': escape(nuevoTexto[a])});
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }else{
                        $("#anterior").append('<button type="button" class="list-group-item list-group-item-action del-compare">' + datosTexto.tx[a] + '</button>');
                        $("#actual").append('<button type="button" class="list-group-item list-group-item-action text-primary del-compare">' + nuevoTexto[a] + '</button>');
                    }
                }else{
                    result.del.push({'index': a, 'texto': escape(datosTexto.tx[a])});
                    $("#anterior").append('<button type="button" class="list-group-item list-group-item-action text-danger del-compare">' + datosTexto.tx[a] + '</button>');
                    $("#actual").append('<button type="button" class="list-group-item list-group-item-action del-compare">&nbsp;</button>');
                }
            }
            break;
        default: break;
    }
    console.log(result);
    $("#pillCreados").html(result.crear.length);
    $("#pillActualizados").html(result.upd.length);
    $("#pillEliminados").html(result.del.length);
}

function mostrarEditar(mostrar){
    if(mostrar){
        $("#tituloEditar").val($("#titulo").html());
        $(".datos-texto-editar").show();
        $(".datos-texto-lectura").hide();
    }

    if(!mostrar){
        $(".datos-texto-editar").hide();
        $(".datos-texto-lectura").show();
    }
}

function detenerAutoGuardar(){
    if(timer.timerId > -1){
        limpiarAutoGuardar(timer.timerId);
        timer.timeId = -1;
    }
    // else{
    //     alert("aun no has configurado un tiempo de guardado automatico");
    // }
    $("#selectMinutos").val("");
}

function compararUltimaVersion(){
    if(timer.timerId > -1){
        alert("Debes detener el guardado automatico para poder realizar la comparacion.");
    }else{
        $("#modalComparar").modal("show");
        verDiferencias();
    }
}

//------>triggers
$("#guardarTexto").click(function(){
    seccionarTexto();
});

$("#btnAutoGuardar").click(function(){
    autoGuardar($("#selectMinutos").val());
});

$("#actualizarTitulo").click(function(){
    actualizarTitulo();
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

$("a").click(function(evt){
    evt.preventDefault();
});