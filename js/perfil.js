$(document).ready(function(){
    //al cargar, obtener los datos del usuario.
    var result = parametrosUrl();
    datosUsuario.upi = result.upi;
    cargarDatosUsuario();
    cargarTextos();
});

function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    if(titulo.length > 0){
        //validar que no exista un texto repetido.
        if(!existeTitulo(titulo)){
            //generar idTexto.
            generarIdTexto();
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
                    crearTexto(id);
                break;
                default: 
                    console.log("Error: " + response);
                break;
            }
        }
    });
}

function crearTexto(idTexto){
    var titulo = $("#tituloTexto").val();
    $.ajax({
        data: {
            titulo: escape(titulo),
            idTexto: idTexto,
            perfilid: datosUsuario.upi
        },
        url:   '../php/perfil/crearTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            if(response == "true"){
                if($("#irTexto").prop("checked")){
                    setTimeout(() => {
                        window.location.href = "libreta.html?ti=" + idTexto;
                    }, 1000);
                }else{
                    cargarTextos();
                }
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
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        result[key] = value;
    });
    return result;
}

function cargarDatosUsuario(){
    $.ajax({
        data: {
            idperfil: datosUsuario.upi
        },
        url:   '../php/perfil/datosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    break;
                // case response == null:
                //     alert("aun no has creado textos.");
                //     break;
                case response != null || response != undefined:
                    var data = JSON.parse(response);
                    console.log(data);
                    $("#usuario").val(unescape(data[0].Usuario));
                    $("#nombre").val(unescape(data[0].Nombre));
                    $("#apellido").val(unescape(data[0].Apellido));
                    break;   
            }
        }
    });
}

function cargarTextos(){
    $.ajax({
        data: {
            idperfil: datosUsuario.upi
        },
        url:   '../php/perfil/textosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    break;
                case response == "null":
                    alert("aun no has creado textos.");
                    break;
                case response != null || response != undefined:
                    var data = JSON.parse(response);
                    console.log(data);
                    crearTabla(data);
                    break;   
            }
        }
    });
}

function crearTabla(data){
    var rows = "";
    for(var d = 0; d < data.length; d++){
        rows += "<tr>";
        rows += "<td><a href='libreta.html?ti=" + data[d].ID + "'><i class='far fa-edit'></i></a></td>";
        rows += "<td class = 'titulos'><span>"+ unescape(data[d].Titulo) + "</span></td></tr>";
    }
    $("#tblTextos tbody").html(rows);
}

function actualizarDatosUsuario(){
    var usr = $("#usuario").val();
    var name = $("#nombre").val();
    var apellido = $("#apellido").val();

    $.ajax({
        data: {
            idperfil: datosUsuario.upi,
            usuario: escape(usr),
            nombre: escape(name),
            apellido: escape(apellido)
        },
        url:   '../php/perfil/actualizarDatosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
                case response == "true":
                    alert("Datos actualizados correctamente");
                    break;   
            }
        }
    });

}

//------------->triggers
$("#btnCrearTexto").click(function(){
    datosCrearTexto();
});

$("#editarDatosUsuario").click(function(){
    actualizarDatosUsuario();
});