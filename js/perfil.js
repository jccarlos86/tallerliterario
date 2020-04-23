$(document).ready(function(){
    //al cargar, obtener los datos del usuario.
    parametrosUrl();
});

function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    var userId = $("#usrId").val();
    var nombre = $("#usrName").val();
    var idTexto = $("#IdTexto").val();

    if(titulo.length > 0){
        //validar que no exista un texto repetido.
        if(!existeTitulo(titulo)){
            //crearTexto(userId, nombre, escape(nuevoTexto.txtDefault), idTexto, 0, escape(titulo));
        }
    }else{
        alert("Agrega un titulo al texo");
    }
}

function existeTitulo(titulo){
    var result = false;
    var coincidencias = 0;
    $(".titulos").children("span").each(function(){
        var txt = $(this).html();
        if(txt.toLowerCase() == titulo.toLowerCase()){
            coincidencias++;
        }
    });
    if(coincidencias > 0){
        result = true;
    }
    return result;
}

function generarIdTexto(){
    var id = Math.round(Math.random() * 9999999999);
    existeId(id);
}

function existeId(id){
    $.ajax({
        data: {
            ID: id
        },
        url:   '../php/perfil/consultarId.php',
        type:  'post',
        beforeSend: function () {
            console.log("Validando ID...");
        },
        success:  function (response) {
            switch(response){
                case "true":
                    console.log("el id ya existe, se generara uno nuevo...");
                    generarIdPerfil();
                break;
                case "false":
                    crearTexto();
                break;
                default: 
                    console.log("Error: " + response);
                break;
            }
        }
    });
}

function crearTexto(nombre, idTexto, tituloTexto, perfilid){
    $.ajax({
        data: {
            nombre: nombre,
            idTexto: idTexto,
            titulo: tituloTexto,
            perfilid: perfilid
        },
        url:   '../php/perfil/crearTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            if(response == "Guardado"){
                setTimeout(() => {
                    window.location.href = "libreta.html?ti=" + idTexto;
                }, 1000);
            }else{
                console.log("Error: " + response);
            }
        }
    });
}

function consultar(tp, ttl, idtx, idus){
    $.ajax({
        data: {
            tp: tp,
            ttl: ttl,
            idtx: idtx,
            idus: idus
        },
        url:   '../php/obtener.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            console.log(response);
        }
    });
}

function parametrosUrl(){
    var result = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        result[key] = value;
    });
    cargarDatosUsuario(result);
}

function cargarDatosUsuario(params){
    $.ajax({
        data: {
            idperfil: params.upi
        },
        url:   '../php/perfil/datosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            if(response.startsWith("Connection")){
                console.log("Error: " + response);
            }else{
                var data = JSON.parse(response);
                console.log(data);
                crearTabla(data);
            }
        }
    });
}

function crearTabla(data){
    var rows = "";
    for(var d = 0; d < data.length; d++){
        rows += "<tr><td class='titulos' data-idTxt = '" + data[d].ID + "'><i class='fas fa-book-reader'></i><span>"+ unescape(data[d].Titulo) + "</span></td></tr>";
    }
    $("#tblTextos tbody").html(rows);
    $("#nombre").val(data[0].Nombre);
    $("#apellido").val(data[0].Apellido);
    $("#usuario").val(data[0].Usuario);
}

//------------->triggers
$("#btnCrearTexto").click(function(){
    datosCrearTexto();
});
