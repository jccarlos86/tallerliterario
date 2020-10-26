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
        },
        success:  function (response) {
        }
    });
}

function cargarDatosAutor(){
    $.ajax({
        data: {
            idautor: getCookie("autorid")
        },
        url:   '../php/escritor/datosEscritor.php',
        type:  'post',
        beforeSend: function () {
        },
        success:  function (response) {
            switch(true){
                case response.startsWith("Connection"):
                    break;
                case response != "null":
                    var data = JSON.parse(response);
                    $("#usuario").html(unescape(data[0].Usuario));
                    $("#nombre").html(unescape(data[0].Nombre));
                    $("#apellido").html(unescape(data[0].Apellido));

                    sesion.usuario.nombre = unescape(data[0].Nombre);
                    sesion.usuario.usuario = unescape(data[0].Usuario);
                    sesion.usuario.apellido = unescape(data[0].Apellido);
                    sesion.usuario.acerca = unescape(data[0].Acerca);

                    var acercade = sesion.usuario.acerca.split("\n");
                    var about = "";
                    for(var a = 0; a < acercade.length; a++){
                        (a + 1) == acercade.length ? about += unescape(acercade[a]) : about += unescape(acercade[a]) + "</br>";
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

//este si queda
function cargarTextos(){
    $.ajax({
        data: {
            idautor: getCookie("autorid")
        },
        url:   '../php/escritor/textosAutor.php',
        type:  'post',
        beforeSend: function () {
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
//este se queda
function crearTabla(data){
    var rowsPerfil = "";
    sesion.escrito.estatus.taller = data.length;
    for(var d = 0; d < data.length; d++){
        rowsPerfil += `<tr>
            <td>
                <span>${d+1}</span>
            </td>
            <td class = 'titulos'>
                <a class='ver-texto prevent-default' data-ti='${data[d].ID}' data-ttx="${unescape(data[d].Titulo)}" href='#'>
                    <span>
                        ${unescape(data[d].Titulo)}
                    </span>
                </a>
            </td>
            <td class="genero">
                <span>${unescape(data[d].Genero)}</span>
            </td>
        </tr>`;
                 
    }
    $("#tblTextos tbody").html(rowsPerfil);
    $("#textosTaller").html(sesion.escrito.estatus.taller);
    loader(false);
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

//----------------------------->triggers
$(document).ready(function(){
    loader(true);
    if(checkCookie("autorid") && checkCookie("perfilId")){
        cargarDatosAutor();
        cargarTextos();
    }else{
        window.location.href = "index.html";
    }
});

$("#buscarTexto").keyup(function(){
    buscarTexto($(this).val(), $("#inputFiltro").val());
});

$(".filtro-texto").click(function(){
    filtroTextos($(this).data("filtro"));
});

$(document).on("click", ".ver-texto", function(){
    //verEscrito($(this).data("ti"), $(this).data("ttx"), $(this).data("tipo"));
    crearCookie("escritoid", $(this).data("ti"));
    window.location.href = "escrito.html";
});

//loader(false)