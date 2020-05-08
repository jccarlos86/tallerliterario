var sesion = {
    usuario: {
        usuario: "",
        nombre: "", 
        apellido: "",
        perfil: 0
    },
    escrito: {
        id:0,
        cantidadfilas: 0,
        titulo: "",
        texto:[]
    },
    timer: {
        timerId: -1
    },
    templates:{
        tabla:{
            fila:{
                abrir: "<tr>",
                cerrar: "</tr>"
            },
            columnas:{
                opciones:{
                    abrir: "<td>"+
                    '<nav class="navbar navbar-expand-lg navbar-light bg-light p-0">'+
                        '<ul class="navbar-nav mr-auto">'+
                            '<li class="nav-item dropdown">'+
                               ' <a class="nav-link p-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
                                    '<i class="fas fa-cog"></i>'+
                                '</a>'+
        
                                '<div class="dropdown-menu" aria-labelledby="navbarDropdown">',
                    cerrar: "</div></li></ul></nav></td>"
                },
                titulos:{
                    abrir:"<td class = 'titulos'>",
                    cerrar:"</td>"
                }
            }
        },
        tarjetas:
            '<div class="card">'+
            '<div class="card-body">'+
                '<h5 class="card-title">#titulo#</h5>'+
                '<p class="card-text">#texto#</p>'+
                '<p class="card-text"><small class="text-muted">#autor#</small></p>'+
                '<p><button data-ti="#textoid#" type="button" class="btn btn-primary ver-texto-taller">Ver mas</button></p>'+
            '</div>'+
        '</div>'
    }
};

//--------------------------------->Funciones
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