$(document).ready(function(){
    //validar mayusculas y minusculas
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };
    loader(true);
    editarDatosUsuario(false);
    //al cargar, obtener los datos del usuario.
    var result = parametrosUrl();
    datosUsuario.upi = result.upi;
    cargarDatosUsuario();
    cargarTextos();
});

function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    if(titulo.length > 0){
        $("#modalNuevoTexto").modal("hide");
        loader(true);
        //validar que no exista un texto repetido.
        if(!existeTitulo(titulo)){
            //generar idTexto.
            generarIdTexto();
        }
    }else{
        alert("Agrega un titulo al campo de titulo");
    }
}

function existeTitulo(titulo){
    var result = false;
    if($(".titulos span:Contains('" + titulo + "')") > 0) result = true;
    return result;
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
            perfilid: datosUsuario.upi
        },
        url:   '../php/perfil/crearTexto.php',
        type:  'post',
        beforeSend: function () {
            console.log("Guardando...");
        },
        success:  function (response) {
            if(response == "true"){
                if($("#irTexto").prop("checked")){
                    setTimeout(() => {
                        window.location.href = "libreta.html?ti=" + idTexto + "&upi=" + datosUsuario.upi + "&ttx=" + titulo;
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
                    $("#usuario").html(unescape(data[0].Usuario));
                    $("#nombre").html(unescape(data[0].Nombre));
                    $("#apellido").html(unescape(data[0].Apellido));
                    datosUsuario.nombre = unescape(data[0].Nombre);
                    datosUsuario.usuario = unescape(data[0].Usuario);
                    datosUsuario.apellido = unescape(data[0].Apellido);
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
                        // '<div class="btn-group dropright">'+
                        //     '<button type="button" class="btn btn-secondary rounded-circle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                        //         '<i class="fas fa-cog"></i>'+
                        //     '</button>'+
                        //     '<div class="dropdown-menu">'+
                        //         "<a href='#' class='dropdown-item borrar-texto' data-toggle='modal' data-target='#modalBorrarTexto' data-ti='" + 
                        //         data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'>"+
                        //             "<i class='far fa-trash-alt text-danger p-1'></i>"+
                        //         "</a>"+
                        //     '</div>'+
                        // '</div>'+
                    "</td>"+        
                    "<td class = 'titulos'>"+
                        "<a href='libreta.html?ti=" + data[d].ID + "&upi=" + datosUsuario.upi + "&ttx="+
                        data[d].Titulo + "'>"+
                            "<span>" + unescape(data[d].Titulo) + "</span>"+
                        "</a>"+
                    "</td>"+
                "</tr>";
        // rows += "<tr><td>";
        // rows += "<a href='libreta.html?ti=" + data[d].ID + "&upi=" + datosUsuario.upi + "&ttx=";
        // rows += data[d].Titulo + "'><i class='far fa-edit h5 p-1'></i></a></td>";
        // rows += "<td><a href='#' class='borrar-texto' data-toggle='modal' data-target='#modalBorrarTexto' data-ti='";
        // rows += data[d].ID + "' data-ttx='" + unescape(data[d].Titulo) + "'><i class='far fa-trash-alt h5 text-danger p-1'></i></a></td>";
        // rows += "<td class = 'titulos'><span>"+ unescape(data[d].Titulo) + "</span></td></tr>";
    }
    $("#tblTextos tbody").html(rows);
    alertaBorrar();
    alertaTaller();
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

function actualizarDatosUsuario(){
    var usr = $("#UsuarioEditar").val();
    var name = $("#nombreUsuarioEditar").val();
    var apellido = $("#apellidoUsuarioEditar").val();
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
            perfil: datosUsuario.upi
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
            perfil: datosUsuario.upi
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

//------------->triggers
$("#btnCrearTexto").click(function(){
    datosCrearTexto();
});

$("#guardarEditarUsuario").click(function(){
    actualizarDatosUsuario();
});

$("#btnBorrarTexto").click(function(){
    // loader(true);
    // $("#modalBorrarTexto").modal("hide");
    borrarTexto($(this).data("ti"));
});

$("#buscarTexto").keyup(function(){
    buscarTexto($(this).val());
});

$("#editarDatosUsuario").click(function(){
    editarDatosUsuario(true);
});

$("#cancelarEditarUsuario").click(function(){
    editarDatosUsuario(false);
});

$("#btnEnviarTaller").click(function(){
    $("#modalTaller").modal("hide");
    enviarTextoTaller($(this).data("ti"));
});

$("a").click(function(evt){
    evt.preventDefault();
});