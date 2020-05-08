function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    if(titulo.length > 0){
        $("#modalNuevoTexto").modal("hide");
        loader(true);
        if(!existeTitulo(titulo)){
            generarIdTexto();
        }
        loader(false);
        $("#modalNuevoTexto").modal("show");
        setTimeout(() => {
            alert("ya existe un texto con el mismo titulo");
        }, 800);
    }else{
        alert("Agrega un titulo al campo de titulo");
    }
}

function existeTitulo(titulo){
    return $(".titulos span:Contains('" + titulo + "')").length > 0 ? true : false;
}

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
            perfilid: getCookie("perfilId")
        },
        url:   '../php/perfil/crearTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Guardando...");
        },
        success:  function (response) {
            if(response == "true"){
                if($("#irTexto").prop("checked")){
                    crearCookie("textoid", idTexto);
                    setTimeout(() => {
                        window.location.href = "libreta.html";
                    }, 1000);
                }else{
                    cargarTextos();
                    $("#tituloTexto").val("");
                }
            }else{
                loader(false);
                $("#modalNuevoTexto").modal("show");
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

function cargarDatosUsuario(){
    $.ajax({
        data: {
            idperfil: getCookie("perfilId")
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
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    $("#usuario").html(unescape(data[0].Usuario));
                    $("#nombre").html(unescape(data[0].Nombre));
                    $("#apellido").html(unescape(data[0].Apellido));

                    sesion.usuario.nombre = unescape(data[0].Nombre);
                    sesion.usuario.usuario = unescape(data[0].Usuario);
                    sesion.usuario.apellido = unescape(data[0].Apellido);

                    // datosUsuario.nombre = unescape(data[0].Nombre);
                    // datosUsuario.usuario = unescape(data[0].Usuario);
                    // datosUsuario.apellido = unescape(data[0].Apellido);
                    break;   
            }
        }
    });
}

function cargarTextos(){
    $.ajax({
        data: {
            idperfil: getCookie("perfilId")
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
    var rows = "";
    for(var d = 0; d < data.length; d++){
        rows += sesion.templates.tabla.fila.abrir;
        rows += sesion.templates.tabla.columnas.opciones.abrir;
        rows += "<a href='#' class='dropdown-item borrar-texto text-danger' data-toggle='modal' data-target='#modalBorrarTexto' data-ti='" + 
        data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'>"+
            "<i class='far fa-trash-alt text-danger'></i>"+
            "  Eliminar"+
        "</a>";
        rows += "<a href='#' class='dropdown-item enviar-texto-taller text-primary' data-toggle='modal' data-target='#modalTaller' data-ti='" + 
        data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'>"+
            "<i class='fas fa-envelope-open-text text-primary'></i>"+
            "  Taller"+
        "</a>";
        rows += sesion.templates.tabla.columnas.opciones.cerrar;
        rows += sesion.templates.tabla.columnas.titulos.abrir;
        rows += "<a class='texto-libreta' data-ti='" + data[d].ID + "' data-ttx='" + data[d].Titulo + "' href='#'>"+
            "<span>" + unescape(data[d].Titulo) + "</span>"+
        "</a>";
        rows += sesion.templates.tabla.columnas.titulos.cerrar;
        rows += sesion.templates.tabla.fila.cerrar;
        /*
        rows += "<tr>"+
                    "<td>"+
                        '<nav class="navbar navbar-expand-lg navbar-light bg-light p-0">'+
                            '<ul class="navbar-nav mr-auto">'+
                                '<li class="nav-item dropdown">'+
                                   ' <a class="nav-link p-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
                                        '<i class="fas fa-cog"></i>'+
                                    '</a>'+

                                    '<div class="dropdown-menu" aria-labelledby="navbarDropdown">'+
                                        "<a href='#' class='dropdown-item borrar-texto text-danger' data-toggle='modal' data-target='#modalBorrarTexto' data-ti='" + 
                                        data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'>"+
                                            "<i class='far fa-trash-alt text-danger'></i>"+
                                            "  Eliminar"+
                                        "</a>"+

                                        "<a href='#' class='dropdown-item enviar-texto-taller text-primary' data-toggle='modal' data-target='#modalTaller' data-ti='" + 
                                        data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'>"+
                                            "<i class='fas fa-envelope-open-text text-primary'></i>"+
                                            "  Taller"+
                                        "</a>"+

                                    '</div>'+
                                '</li>'+

                            '</ul>'+
                        '</nav>'+
                    "</td>"+        
                    "<td class = 'titulos'>"+
                        "<a class='texto-libreta' data-ti='" + data[d].ID + "' data-ttx='" + data[d].Titulo + "' href='#'>"+
                            "<span>" + unescape(data[d].Titulo) + "</span>"+
                        "</a>"+
                    "</td>"+
                "</tr>";
                */
    }
    $("#tblTextos tbody").html(rows);
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
        var id= $(this).data("ti");
        var titulo = $(this).data("ttx");
        $("#lblTituloTaller").html(titulo);
        $("#btnEnviarTaller").attr("data-ti", id);
    });
}

function clickLibreta(){
    $(".texto-libreta").click(function(){
        verEscrito($(this).data("ti"), $(this).data("ttx"));
    });
}

function actualizarDatosUsuario(){
    var usr = $("#UsuarioEditar").val();
    var name = $("#nombreUsuarioEditar").val();
    var apellido = $("#apellidoUsuarioEditar").val();
    $.ajax({
        data: {
            idperfil: getCookie("perfilId"),
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
            perfil: getCookie("perfilId")
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
            perfil: getCookie("perfilId")
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
                case response == "true":
                    window.location.reload();
                    break;   
            }
        }
    });
}

function verEscrito(id, titulo){
    crearCookie("textoid", id);
    crearCookie("titulo", titulo);
    window.location.href = "libreta.html";
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