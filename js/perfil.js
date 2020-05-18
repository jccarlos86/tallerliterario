function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    var genero = $("#generoTexto").val();
    if(titulo.length > 0){
        if(genero.length > 0){
            $("#modalNuevoTexto").modal("hide");
            loader(true);
            generarIdTexto();
        }else{
            alert("Agrega un genero literario para tu texto.");
        }
    }else{
        alert("Agrega un titulo al campo de titulo.");
    }
}

// function existeTitulo(titulo){
//     return $(".titulos span:Contains('" + titulo + "')").length > 0 ? true : false;
// }

function generarIdTexto(){
    var id = Math.round(Math.random() * 999999999);
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
                    generarIdTexto();
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
            perfilid: sesion.usuario.perfil,
            genero: escape($("#generoTexto").val())
        },
        url:   '../php/perfil/crearTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Guardando...");
        },
        success:  function (response) {
            switch(response){
                case "true":
                    if($("#irTexto").prop("checked")){
                        crearCookie("escritoid", idTexto);
                        setTimeout(() => {
                            window.location.href = "libreta.html";
                        }, 1000);
                    }else{
                        cargarTextos();
                        $("#tituloTexto").val("");
                        $("#generoTexto").val("");
                    }
                    break;
                case "duplicado":
                    loader(false);
                    alert("ya has creado un texto con el mismo nombre.");
                    break;
                default:
                    loader(false);
                    console.log(response);
                    break;
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

function cargarDatosUsuario(){
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil
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
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    $("#usuario").html(unescape(data[0].Usuario));
                    $("#nombre").html(unescape(data[0].Nombre));
                    $("#apellido").html(unescape(data[0].Apellido));
                    sesion.usuario.nombre = unescape(data[0].Nombre);
                    sesion.usuario.usuario = unescape(data[0].Usuario);
                    sesion.usuario.apellido = unescape(data[0].Apellido);
                    break;   
            }
        }
    });
}

function cargarTextos(){
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil
        },
        url:   '../php/perfil/textosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
                case response == "null":
                    alert("aun no has creado textos.");
                    break;
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    crearTabla(data);
                    break;   
            }
        }
    });
}

function crearTabla(data){
    var rowsPerfil = "";
    var rowsTaller = "";
    for(var d = 0; d < data.length; d++){
        if(data[d].Estatus == 0){
            rowsPerfil += sesion.templates.tablas.perfil
            .replace("#textoid#", data[d].ID)
            .replace("#textoid#", data[d].ID)
            .replace("#textoid#", data[d].ID)
            .replace("#version#", data[d].Version)
            .replace("#genero#", data[d].Genero)
            .replace("#titulotexto#", unescape(data[d].Titulo))
            .replace("#titulotexto#", unescape(data[d].Titulo))
            .replace("#titulotexto#", unescape(data[d].Titulo))
            .replace("#titulotexto#", unescape(data[d].Titulo));
        }else if(data[d].Estatus == 1){
            rowsTaller += sesion.templates.tablas.taller
            .replace("#textoid#", data[d].ID)
            .replace("#titulotexto#", unescape(data[d].Titulo))
            .replace("#titulotexto#", unescape(data[d].Titulo));
        }
    }
    $("#tblTextos tbody").html(rowsPerfil);
    $("#tblTextosTaller tbody").html(rowsTaller);
    alertaBorrar();
    alertaTaller();
    clickLibreta();
    loader(false);
}

function alertaBorrar(){
    $(".borrar-texto").click(function(){
        var id= $(this).data("ti");
        var titulo = $(this).data("ttx");
        $("#lblTituloBorrar").html(titulo);
        $("#btnBorrarTexto").attr("data-ti", id);
    });
}

function alertaTaller(){
    $(".enviar-texto-taller").click(function(){
        var opt = addOptionVersiones($(this).data("vrs"));
        $("#selVerTaller").html(opt);
        $("#lblTituloTaller").html( $(this).data("ttx"));
        $("#btnEnviarTaller").attr("data-ti", $(this).data("ti"));
    });
}

function clickLibreta(){
    $(".texto-libreta").click(function(){
        verEscrito($(this).data("ti"), $(this).data("ttx"), $(this).data("tipo"));
    });
}

function actualizarDatosUsuario(){
    var usr = $("#UsuarioEditar").val();
    var name = $("#nombreUsuarioEditar").val();
    var apellido = $("#apellidoUsuarioEditar").val();
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil,
            usuario: escape(usr),
            nombre: escape(name),
            apellido: escape(apellido)
        },
        url:   '../php/perfil/actualizarDatosUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando...");
        },
        success:  function (response){
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
                case response == "true":
                    $("#cancelarEditarUsuario").click();
                    $("#usuario").html(usr);
                    $("#nombre").html(name);
                    $("#apellido").html(apellido);
                    alert("Datos actualizados correctamente");
                    break;   
            }
        }
    });
}

function borrarTexto(idtx){
    $.ajax({
        data: {
            id: idtx,
            perfil: sesion.usuario.perfil
        },
        url:   '../php/perfil/eliminarTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Borrando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
                case response == "true":
                    alert("Texto eliminado correctamente.");
                    window.location.reload();
                    break;   
            }
        }
    });
}

function buscarTexto(texto){
    if(texto.length > 0){
        $("#tblTextos tbody tr").hide();
        $("#tblTextos tbody td span:Contains('" + texto + "')").closest('tr').show();
    }else{
        $("#tblTextos tbody tr").show();
    }
}

function editarDatosUsuario(editar){
    if(editar){
        $("#UsuarioEditar").val($("#usuario").html());
        $("#nombreUsuarioEditar").val($("#nombre").html());
        $("#apellidoUsuarioEditar").val($("#apellido").html());
        $(".datos-usuario-lectura").hide();
        $(".datos-usuario-editar").show();
    }else{
        $(".datos-usuario-lectura").show();
        $(".datos-usuario-editar").hide();
    }
}

function loader(mostrar){
    if(mostrar){
        $("#modalLoader").modal("show");
    }
    if(!mostrar){
        setTimeout(() => {
            $("#modalLoader").modal("hide");
        }, 500);
    }
}

function enviarTextoTaller(idtx){
    $.ajax({
        data: {
            id: idtx,
            perfil: sesion.usuario.perfil,
            version: $("#selVerTaller").val()
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
                    window.location.reload();
                    break;   
                case response.startsWith("Invalido"):
                    alert(response);
                    break;
            }
        }
    });
}

function verEscrito(id, titulo, tipo){
    crearCookie("escritoid", id);
    //crearCookie("titulo", titulo);
    if(tipo == 0){
        window.location.href = "libreta.html";
    }else if(tipo == 1){
        crearCookie("autorid", sesion.usuario.perfil);
        window.location.href = "escrito.html";
    }
}

// function subirImagen(){
//     var formData = new FormData();
//     var files = $('#image')[0].files[0];
//     formData.append('file',files);
//     $.ajax({
//         url: 'cargarImagen.php',
//         type: 'post',
//         data: formData,
//         contentType: false,
//         processData: false,
//         success: function(response) {
//             if (response != 0) {
//                 $(".card-img-top").attr("src", response);
//             } else {
//                 alert('Formato de imagen incorrecto.');
//             }
//         }
//     });
// }

//----------------------------->triggers
$(document).ready(function(){
    //loader(true);
    if(checkCookie("perfilId")){
        sesion.usuario.perfil = getCookie("perfilId");
        editarDatosUsuario(false);
        cargarDatosUsuario();
        cargarTextos();
    }else{
        //window.location.href = "index.html";
    }
});
//ok
$("#btnCrearTexto").click(function(){
    datosCrearTexto();
});
//ok
$("#guardarEditarUsuario").click(function(){
    actualizarDatosUsuario();
});
//ok
$("#btnBorrarTexto").click(function(){
    borrarTexto($(this).data("ti"));
});
//ok
$("#buscarTexto").keyup(function(){
    buscarTexto($(this).val());
});
//ok
$("#editarDatosUsuario").click(function(){
    editarDatosUsuario(true);
});
//ok
$("#cancelarEditarUsuario").click(function(){
    editarDatosUsuario(false);
});
//ok
$("#btnEnviarTaller").click(function(){
    $("#modalTaller").modal("hide");
    enviarTextoTaller($(this).data("ti"));
});