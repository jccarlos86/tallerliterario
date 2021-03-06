var sesion = {
    usuario: {
        usuario: "",
        nombre: "", 
        apellido: "",
        acerca: "",
        password: "",
        perfil: 0
    },
    escrito: {
        id:0,
        version: 0,
        cantidadfilas: 0,
        titulo: "",
        texto:[],
        genero: "",
        reacciones:{
            likes: 0,
            dislikes: 0,
            insignias: 0
        },
        estatus:{
            libreta: 0,
            taller: 0
        },
        versiones: []
    },
    timer: {
        timerId: -1
    },
    templates:{
        tablas:{
            /*
            taller: "<tr><td>"+ 
                    "<a class='texto-libreta prevent-default' data-ti='#textoid#' data-ttx='#titulotexto#' data-tipo='1' href='#'>"+
                        "<span>#titulotexto#</span>"+
                    "</a>"+
                "</td>"+
                "</tr>",


            perfil: "<tr><td>"+
                        '<nav class="navbar navbar-expand-lg navbar-light bg-light p-0">'+
                            '<ul class="navbar-nav mr-auto">'+
                                '<li class="nav-item dropdown">'+
                                   ' <a class="nav-link p-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
                                        '<i class="fas fa-cog"></i>'+
                                    '</a>'+

                                    '<div class="dropdown-menu" aria-labelledby="navbarDropdown">'+
                                        "<a href='#' class='dropdown-item borrar-texto text-danger' data-toggle='modal' data-target='#modalBorrarTexto'"+ 
                                        'data-ti="#textoid#" data-ttx="#titulotexto#">'+
                                            "<i class='far fa-trash-alt text-danger'></i>"+
                                            "  Eliminar"+
                                        "</a>"+

                                        "<a href='#' class='dropdown-item enviar-texto-taller text-primary' data-toggle='modal' data-target='#modalTaller'"+ 
                                        "data-ti='#textoid#' data-ttx='#titulotexto#' data-vrs='#version#' data-gen='#genero#'>"+
                                            "<i class='fas fa-envelope-open-text text-primary'></i>"+
                                            "  Taller"+
                                        "</a>"+

                                    '</div>'+
                                '</li>'+

                            '</ul>'+
                        '</nav>'+
                    "</td>"+        
                    "<td class = 'titulos'>"+
                        "<a class='texto-libreta prevent-default' data-ti='#textoid#' data-ttx='#titulotexto#' data-tipo='0' href='#'>"+
                            "<span>#titulotexto#</span>"+
                        "</a>"+
                    "</td>"+

                    "<td class = 'genero'>"+
                        "<a class='texto-libreta prevent-default' data-ti='#textoid#' data-ttx='#titulotexto#' data-tipo='0' href='#'>"+
                            "<span>#titulotexto#</span>"+
                        "</a>"+
                    "</td>"+

                    "<td class = 'versiones'>"+
                        "<a class='texto-libreta prevent-default' data-ti='#textoid#' data-ttx='#titulotexto#' data-tipo='0' href='#'>"+
                            "<span>#titulotexto#</span>"+
                        "</a>"+
                    "</td>"+

                    "<td class = 'estatus'>"+
                        "<a class='texto-libreta prevent-default' data-ti='#textoid#' data-ttx='#titulotexto#' data-tipo='0' href='#'>"+
                            "<span>#titulotexto#</span>"+
                        "</a>"+
                    "</td>"+
                    "</tr>"
                    */
        },
        tarjetas:{
            escritos:'<div class="card shadow">'+
                        '<h5 class="card-header titulo text-uppercase">#titulo#</h5>'+
                        '<div class="card-body">'+
                            '<p class="card-text texto">#texto#</p>'+
                            '<a href="#" data-ai="#autorid#" class="blockquote-footer autor text-capitalize text-primary pb-2 prevent-default">#autor#</a>'+
                            '<p class=""><small class="text-muted pb-2 genero">#genero#</small></p>'+
                            '<p class=""><small class="text-primary pb-2 insignia">#insignia#</small></p>'+
                            '<p class=""><small class="text-muted pb-3 fecha">#fecha#</small></p>'+
                            '<p><button data-ti="#textoid#" data-ai="#autorid#" type="button" class="btn btn-outline-primary ver-texto-taller">Ver mas</button></p>'+
                        '</div>'+
                    '</div>',
            comentarios:'<div class="card mb-2 shadow bg-transparent lectura">'+
                            '<div class="card-body shadow">'+
                                '<h5 class="card-title border-bottom">#usuario#</h5>'+
                                '<p class="card-text">#comentario#</p>'+
                                '<p class="card-text">'+
                                    '<small class="text-muted">#fecha#</small>'+
                                '</p>'+
                            '</div>'+
                        '</div>'
        },
        loader:'<div class="modal fade" id="modalLoader" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true">'+
                    '<div class="modal-dialog modal-dialog-centered" role="document">'+
                        '<div class="modal-content bg-transparent border-0">'+
                            '<div class="text-center">'+
                                '<div class="lds-roller">'+
                                    '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
    }
};

//--------------------------------->Funciones
function loader(mostrar){
    if(mostrar){
        $("div[class^=container]").append(sesion.templates.loader);
        $("#modalLoader").modal("show");
    }
    if(!mostrar){
        setTimeout(() => {
            $("#modalLoader").modal("hide");
            $("#modalLoader, .modal-backdrop").remove();
            $("body").removeClass("modal-open");
        }, 500);
    }
}

function addOptionVersiones(maxVersion){
    var options = "";
    for(var d = maxVersion; d > 0; d--){
        options += "<option value = '" + d + "'>" + d + "</option>";
    }
    return options;
}

function crearCookie(nombre, valor) {
    var d = new Date();
    d.setDate(d.getDate() + 3);
    var caduca = "expires="+ d.toUTCString();
    document.cookie = encodeURI(nombre) + "=" + valor + ";" + caduca + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(nombre) {
    return getCookie(nombre) != "" ? true : false;
}

function removeCookie(nombre){
    crearCookie(nombre, "", -1);
}

// function parametrosUrl(){
//     var result = {};
//     window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//         result[key] = value;
//     });
//     return result;
// }

//------------------------------->triggers
$(document).ready(function(){
    //validar mayusculas y minusculas
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };
});

$(".prevent-default").click(function(evt){
    evt.preventDefault();
});