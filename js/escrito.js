//------------------->funciones
function obtenerEscrito(){
    $.ajax({
        data: { 
            id: sesion.escrito.id
        },
        url:   '../php/taller/leerTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("obteniendo texto...");
        },
        success: function (response) {
            switch(true){
                case response != "null":
                    var data = JSON.parse(response);
                    insertarTexto(data);
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        }
    });
}

function comentar(){
    var comment = escape($("#comentario").val());
    if(comment.length > 0){
        $.ajax({
            data: { 
                id: sesion.escrito.id,
                perfil: sesion.usuario.perfil,
                autor: getCookie("autorid"),
                comentario: comment,
            },
            url:   '../php/taller/comentar.php',
            type:  'post',
            beforeSend: function () {
                console.log("Guardando comentario...");
            },
            success: function (response) {
                if(response == "true"){
                    $("#comentario").val("");
                    obtenerComentarios();
                    alert("comentario guardado.");
                }else if(response.startsWith("Connection")){
                    console.log("Error: " + response);
                }
            }
        });
    }else{
        alert("el campo de comentario se encuentra vacio");
    }
}

function obtenerComentarios(){
    $.ajax({
        data: { 
            idTexto: sesion.escrito.id
        },
        url:   '../php/taller/comentarios.php',
        type:  'post',
        beforeSend: function () {
            console.log("obteniendo comentarios...");
        },
        success: function (response) {
            switch(true){
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    insertarComentarios(data);
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        }
    });
}

function insertarComentarios(data){
    var com = "";
    for(var c = 0; c < data.length; c++){
        com += sesion.templates.tarjetas.comentarios
        .replace("#comentario#", unescape(data[c].Comentario))
        .replace("#fecha#", data[c].Fecha)
        .replace("#usuario#", unescape(data[c].Usuario))
    }
    $("#userComments").html(com);
}

function modoNocturno(){
    $("body").removeClass("bg-light");
    $("body").addClass("bg-dark");
    $(".lectura").removeClass("text-secondary");
    $(".lectura").addClass("text-white");
}

function modoDiurno(){
    $("body").removeClass("bg-dark");
    $("body").addClass("bg-light");
    $(".lectura").removeClass("text-white");
    $(".lectura").addClass("text-secondary");
}

function insertarTexto(data){
    var texto = "";
    sesion.escrito.titulo = unescape(data[0].Titulo);
    for(var d = 0; d < data.length; d++){
        texto += unescape(data[d].Texto) + "<br/>";
    }
    $("#titulo").html(sesion.escrito.titulo);
    $("#texto").html(texto);
    $("#autor").html("Autor: " + unescape(data[0].Autor));
    reactionCount();
    loader(false);
}

function reactionCount(){
    $.ajax({
        data: { 
            id: sesion.escrito.id
        },
        url:   '../php/taller/totalReacciones.php',
        type:  'post',
        beforeSend: function () {
            console.log("obteniendo reacciones del texto...");
        },
        success: function (response) {
            switch(true){
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    for(var r = 0; r < data.length; r++){
                        if(data[r].Reaccion == 0){
                            sesion.escrito.reacciones.dislikes = data[r].Total;
                        }else if(data[r].Reaccion == 1){
                            sesion.escrito.reacciones.likes = data[r].Total;
                        }else if(data[r].Reaccion == 2){
                            sesion.escrito.reacciones.insignias = data[r].Total;
                        }
                    }
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
            $("#cntDislikes").html(sesion.escrito.reacciones.dislikes);
            $("#cntLikes").html(sesion.escrito.reacciones.likes);
            $("#cntReconocimiento").html(sesion.escrito.reacciones.insignias);
        }
    });
}

function agregarReaccion(tipo){
    $.ajax({
        data: { 
            id: sesion.escrito.id,
            tipo: tipo,
            perfil: sesion.usuario.perfil
        },
        url:   '../php/taller/agregarReaccion.php',
        type:  'post',
        beforeSend: function () {
            console.log("agregando reaccion...");
        },
        success: function (response) {
            switch(true){
                case response.startsWith("true"):
                    reactionCount();
                    alert("Reaccion agregada.");
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
            }
        }
    });
}

//------------------->triggers
$(document).ready(function(){
    //loader(true);
    if(checkCookie("perfilId") && checkCookie("escritoid")){
        sesion.usuario.perfil = getCookie("perfilId");
        sesion.escrito.id = getCookie("escritoid")
        obtenerEscrito();
        obtenerComentarios();
    }else{
        //window.location.href = "perfil.html";
    }
});

$("#nocturno").click(function(){
    modoNocturno();
});

$("#diurno").click(function(){
    modoDiurno();
});

$("#comentar").click(function(){
    comentar();
});

$(".reaccion").click(function(){
    agregarReaccion($(this).data("tipo"));
});