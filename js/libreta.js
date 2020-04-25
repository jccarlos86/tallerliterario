$(document).ready(function(){
    //validar mayusculas y minusculas
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };
    var result = parametrosUrl();
    datosTexto.ti = result.ti;
    datosTexto.upi = result.upi
    $("#volver").attr("href", "perfil.html?upi=" + datosTexto.upi);
    $("#titulo").val(unescape(result.ttx));
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
        console.log("intervalo", Date());
        $("#guardarTexto").click();
    }, mili);
    timer.timerId = timeId;
}

function limpiarAutoGuardar(id){
    clearInterval(id);
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
                    datosTexto.lt = data.length - 1;
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
    var lt = nuevoTexto.length;
    var result = {
        upd:  [],
        del:  [],
        crear: []
    };
    switch(true){
        case lt == datosTexto.lt:
            for(var a = 0; a < nuevoTexto.length; a++){
                if(nuevoTexto[a] != datosTexto.tx[a]){
                    result.upd.push({'index': a, 'texto': nuevoTexto[a]});
                }
            }
            break;
        case lt > datosTexto.lt:
            //lo nuevo es mayor que lo viejo, quiere decir que inserto texto.
            for(var a = 0; a < nuevoTexto.length; a++){
                //si es undefined, quiere decir que son renglones nuevos.
                if(datosTexto.tx[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza
                    if(nuevoTexto[a] != datosTexto.tx[a]){
                        result.upd.push({'index': a, 'texto': nuevoTexto[a]});
                    }
                }else{
                    result.crear.push({'index': a, 'texto': nuevoTexto[a]});
                }
            }
            break;
        case lt < datosTexto.lt:
            //lo nuevo es menor que lo viejo, quiere decir que borro texto.
            for(var a = 0; a < datosTexto.lt + 1; a++){
                //si es undefined, quiere decir que esos renglones ya no existen, se eliminan.
                if(nuevoTexto[a] != undefined){
                    //comparar si coinciden el texto nuevo con el antiguo, sino se actualiza.
                    if(datosTexto.tx[a] != nuevoTexto[a]){
                        result.upd.push({'index': a, 'texto': nuevoTexto[a]});
                    }
                }else{
                    result.del.push({'index': a, 'texto': datosTexto.tx[a]});
                }
            }
            break;
        default: break;
    }
    actualizarTexto(result);
}

function actualizarTexto(objTextos){
    $.ajax({
        data: {
            update: objTextos.upd,
            create: objTextos.crear,
            delete: objTextos.del,
            idTexto: datosTexto.ti,
            perfil: datosTexto.upi,
            titulo: datosTexto.ttl
        },
        url:   '../php/libreta/actualizarTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando...");
        },
        success: function (response) {
           //validar conexion...
        }
    });
}

function actualizarTitulo(){
    $.ajax({
        data: {
            idperfil: datosTexto.upi,
            idtexto: datosTexto.ti,
            titulo: escape($("#titulo").val())
        },
        url:   '../php/libreta/actualizarTitulo.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando titulo...");
        },
        success: function (response) {
            switch(true){
                case response == "true":
                    alert("Titulo actualizado correctamente.");
                    break;
                case response == "Duplicado":
                    alert("Ese titulo ya se encuentra asignado a otro texto.");
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        }
    });
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