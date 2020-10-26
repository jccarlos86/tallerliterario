function datosCrearTexto(){
    var titulo = $("#tituloTexto").val().trim();
    var genero = $("#generoTexto").val().trim();
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
    var titulo = $("#tituloTexto").val().trim();
    $.ajax({
        data: {
            titulo: escape(titulo),
            idTexto: idTexto,
            perfilid: sesion.usuario.perfil,
            genero: escape($("#generoTexto").val().trim())
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
                    sesion.usuario.password = unescape(data[0].Contrasena);
                    sesion.usuario.acerca = unescape(data[0].Acerca);

                    var acercade = sesion.usuario.acerca.split("\n");
                    var about = "";
                    for(var a = 0; a < acercade.length; a++){
                        (a + 1) == acercade.length ? about += unescape(acercade[a]) : about += unescape(acercade[a]) + "</br>";
                        // about += unescape(acercade[a]) + "</br>";
                    }

                    $("#acercaDe").html(about);
                    
                    break;
            }
        },
        error: function(error){
            console.log(error);
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
            //console.log("Consultando...");
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    loader(false);
                    break;
                case response == "null":
                    //alert("aun no has creado textos.");
                    loader(false);
                    break;
                case response != "null":
                    var data = JSON.parse(response);
                    crearTabla(data);
                    break;   
            }
        },
        error: function(error){
            console.log(error);
            loader(false);
        }
    });
}

function crearTabla(data){
    var rowsPerfil = "";
    //var rowsTaller = "";
    sesion.escrito.estatus.libreta = 0;
    sesion.escrito.estatus.taller = 0;
    for(var d = 0; d < data.length; d++){
        var estatus;
        var displayTaller = "";
        displayRetirar = "";
        switch(parseInt(data[d].Estatus)){
            case 0:
                estatus = "Libreta";
                sesion.escrito.estatus.libreta++;
                displayRetirar = "d-none";
            break;
            case 1: 
                estatus = "Taller";
                sesion.escrito.estatus.taller++;
                displayTaller = "d-none";
            break;
            default: break;
        }

        rowsPerfil += `<tr>
            <td>
                <nav class="navbar navbar-expand-lg navbar-light bg-light p-0">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link p-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <i class="fas fa-cog"></i>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a href='#' class='dropdown-item borrar-texto text-danger' data-toggle='modal' data-target='#modalBorrarTexto'
                                data-ti="${data[d].ID}" data-ttx="${unescape(data[d].Titulo)}">
                                    <i class='far fa-trash-alt text-danger'></i> Eliminar
                                </a>
                                <a href='#' class='dropdown-item retirar-texto-taller text-warning ${displayRetirar}' data-toggle='modal'
                                data-ti="${data[d].ID}" data-ttx="${unescape(data[d].Titulo)}">
                                    <i class="fas fa-eraser"></i> Retirar del taller
                                </a>
                                <a href='#' class='dropdown-item enviar-texto-taller text-primary ${displayTaller}' data-toggle='modal' data-target='#modalTaller' 
                                data-ti="${data[d].ID}" data-ttx="${unescape(data[d].Titulo)}" data-vrs="${data[d].Version}" data-gen="${data[d].Genero}">
                                    <i class='fas fa-envelope-open-text text-primary'></i> Taller
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </td>
            <td class = 'titulos'>
                <a class='texto-libreta prevent-default' data-ti='${data[d].ID}' data-ttx="${unescape(data[d].Titulo)}" data-tipo='${data[d].Estatus}' href='#'>
                    <span>
                        ${unescape(data[d].Titulo)}
                        (<span class="comentarios-texto">${data[d].Num_Comentarios}</span>)
                    </span>
                </a>
            </td>
            <td class="genero">
                <span>${unescape(data[d].Genero)}</span>
            </td>
            <td class="versiones">
                <span>${data[d].Version}</span>
            </td>
            <td class="estatus">
                <span>${estatus}</span>
            </td>
        </tr>`; 
    }
    $("#tblTextos tbody").html(rowsPerfil);
    //$("#tblTextosTaller tbody").html(rowsTaller);
    $("#textosCreados").html(sesion.escrito.estatus.libreta + sesion.escrito.estatus.taller);
    $("#textosTaller").html(sesion.escrito.estatus.taller);
    $("#textosLibreta").html(sesion.escrito.estatus.libreta);
    //alertaBorrar();
    alertaTaller();
    //clickLibreta();
    loader(false);
}

// function alertaBorrar(){
//     $(".borrar-texto").click(function(){
//         var id= $(this).data("ti");
//         var titulo = $(this).data("ttx");
//         $("#lblTituloBorrar").html(titulo);
//         $("#btnBorrarTexto").attr("data-ti", id);
//     });
// }

function alertaTaller(){
    $(".enviar-texto-taller").click(function(){
        var opt = addOptionVersiones($(this).data("vrs"));
        $("#selVerTaller").html(opt);
        $("#lblTituloTaller").html( $(this).data("ttx"));
        $("#btnEnviarTaller").attr("data-ti", $(this).data("ti"));
    });
}

// function clickLibreta(){
//     $(".texto-libreta").click(function(){
//         verEscrito($(this).data("ti"), $(this).data("ttx"), $(this).data("tipo"));
//     });
// }

function actualizarDatosUsuario(){
    var usr = $("#UsuarioEditar").val().trim();
    var name = $("#nombreUsuarioEditar").val().trim();
    var apellido = $("#apellidoUsuarioEditar").val().trim();
    var acerca = $("#acercaUsuarioEditar").val().trim();
    var pass = $("#passwordUsuarioEditar").val();
    $.ajax({
        data: {
            idperfil: sesion.usuario.perfil,
            usuario: escape(usr),
            nombre: escape(name),
            apellido: escape(apellido),
            acerca: escape(acerca),
            pass: escape(pass)
        },
        url:   '../php/perfil/actualizarDatosUsuario.php',
        type:  'post',
        beforeSend: function () {
            loader(true);
            console.log("Actualizando...");
        },
        success:  function (response){
            switch(true){
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    loader(false);
                    break;
                case response == "true":
                    window.location.reload();
                    // $("#cancelarEditarUsuario").click();
                    // $("#usuario").html(usr);
                    // $("#nombre").html(name);
                    // $("#apellido").html(apellido);
                    // $("#acercaDe").html(acerca);
                    // alert("Datos actualizados correctamente");
                    break;   
            }
        },
        error: function(error){
            loader(false);
            console.log(error)
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

function enviarTextoTaller(id){
    $("#guardarTexto").click();
    $.ajax({
        data: {
            id: id,
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
                    window.location = "perfil.html";
                    break;   
                case response.startsWith("Invalido"):
                    alert(response);
                    break;
            }
        }
    });
}

function buscarTexto(texto, filtro){
    if(texto.length > 0){
        $("#tblTextos tbody tr").hide();
        switch(filtro){
            case "contenga":
                $("#tblTextos tbody td span:Contains('" + texto + "')").closest('tr').show();
                break;
            // case "no-contenga":
            //     $("#tblTextos tbody td span:not(:Contains('" + texto + "'))").closest('tr').show();
            //     break;
            case "inicie":
                $("#tblTextos tbody td span").each(function(){
                    var palabra = $(this).text();
                    if(palabra.startsWith(texto)){
                        $(this).closest("tr").show();
                    }
                });
                break;
            case "termine":
                $("#tblTextos tbody td span").each(function(){
                    var palabra = $(this).text();
                    if(palabra.endsWith(texto)){
                        $(this).closest("tr").show();
                    }
                });
                break;
            case "exacto":
                $("#tblTextos tbody td span").each(function(){
                    var palabra = $(this).text();
                    if(palabra == texto){
                        $(this).closest("tr").show();
                    }
                });
                break;
            default: break;
        }
    }else{
        $("#tblTextos tbody tr").show();
    }
}

function editarDatosUsuario(editar){
    if(editar){
        $(".autor-editar").show();
        $(".atuor-lectura").hide();
        $("#UsuarioEditar").val($("#usuario").html());
        $("#nombreUsuarioEditar").val($("#nombre").html());
        $("#apellidoUsuarioEditar").val($("#apellido").html());
        var acercade = sesion.usuario.acerca.split("\n");
        var about = "";
        for(var a = 0; a < acercade.length; a++){
            (a + 1) == acercade.length ? about += acercade[a] : about += acercade[a] + "\n";
        }
        $("#acercaUsuarioEditar").val(about);
        $("#passwordUsuarioEditar").val(unescape(sesion.usuario.password));
    }else{
        $(".autor-editar").hide();
        $(".atuor-lectura").show();
    }
}

function retirarTextoTaller(idtx){
    $.ajax({
        data: {
            id: idtx,
            perfil: sesion.usuario.perfil
        },
        url:   '../php/perfil/retirarTextoTaller.php',
        type:  'post',
        beforeSend: function(){
            loader(true);
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

function filtroTextos(filtro){
    $(".texto-libreta").closest("tr").hide();
    switch(filtro){
        case "libreta":
            $(".texto-libreta[data-tipo='0']").closest("tr").show();
            break;
        case "taller":
            $(".texto-libreta[data-tipo='1']").closest("tr").show();
            break;
        case "todos":
            $(".texto-libreta").closest("tr").show();
            break;
        default: break;
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
    loader(true);
    if(checkCookie("perfilId")){
        sesion.usuario.perfil = getCookie("perfilId");
        $("#ocultarPass").hide();
        editarDatosUsuario(false);
        cargarDatosUsuario();
        cargarTextos();
    }else{
        window.location.href = "index.html";
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
    buscarTexto($(this).val(), $("#inputFiltro").val());
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

$(document).on("click", ".enviar-texto-taller", function(){
    $("#btnEnviarTaller").attr("data-ti", $(this).data("ti"));
});

$(document).on("click", ".retirar-texto-taller", function(){
    retirarTextoTaller($(this).data("ti"));
});

$(document).on("click", ".borrar-texto", function(){
    var id= $(this).data("ti");
    var titulo = $(this).data("ttx");
    $("#lblTituloBorrar").html(titulo);
    $("#btnBorrarTexto").attr("data-ti", id);
});

$(document).on("click", ".texto-libreta", function(){
    verEscrito($(this).data("ti"), $(this).data("ttx"), $(this).data("tipo"));
});


$(".ver-password").click(function(){
    var ver = $(this).data("ver");
    if(ver == "0"){
        $("#passwordUsuarioEditar").attr("type", "password");
        $("#verPass").show();
        $("#ocultarPass").hide();
    }else if(ver = "1"){
        $("#passwordUsuarioEditar").attr("type", "text");
        $("#ocultarPass").show();
        $("#verPass").hide();
    }
});

$(".filtro-texto").click(function(){
    filtroTextos($(this).data("filtro"));
});

//loader(false)