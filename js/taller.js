//---------------->funciones
function obtenerTextos(){
    $.ajax({
        data: { },
        url:   '../php/taller/textosTaller.php',
        type:  'post',
        beforeSend: function () {
            console.log("obteniendo textos del taller...");
        },
        success: function (response) {
            switch(true){
                case response != "null":
                    var data = JSON.parse(response);
                    console.log(data);
                    pegartextos(data);
                    break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                    break;
                case "null":
                    alert("No se encontraron textos.");
                    loader(false);
                    break;
            }
        }
    });
}

function pegartextos(data){
    let cards = "";
    var texto = "";
    for(var t = 0; t < data.length; t++){
        if(data[t].Index == 5){
            var autor = unescape(data[t].Nombre) + " ( " + unescape(data[t].Usuario) + " )";
            var titulo = unescape(data[t].Titulo);
            cards += sesion.templates.tarjetas.escritos.replace("#texto#", texto)
            .replace("#autor#", autor)
            .replace("#titulo#", titulo)
            .replace("#textoid#", data[t].ID)
            .replace("#genero#", unescape(data[t].Genero))
            .replace("#fecha#", data[t].Fecha)
            .replace("#insignia#", data[t].Insignia == "true" ? "<i class='fas fa-medal'></i>" : "")
            .replace(/#autorid#/g, data[t].AutorId);
            texto = "";
        }else{
            texto += unescape(data[t].Texto) + "<br/>";
        }
    }
    $("#cardTextos").html(cards);
    // leertexto();
    loader(false);
}

// function verTextoTaller(idtexto, idautor){
//     crearCookie("escritoid", idtexto);
//     crearCookie("autorid", idautor);
//     window.location.href = "escrito.html";
// }

// function leertexto(){
//     $(".ver-texto-taller").click(function(){
//         verTextoTaller($(this).data("ti"), $(this).data("ai"));
//     });
// }

function buscarTexto(texto, filtro, buscarEn){
    if(texto.length > 0){
        $(".card").hide();
        switch(filtro){
            case "contenga":
                $(`.${buscarEn}:Contains(${texto})`).closest(".card").show();
                // $(".card:Contains('" + texto + "')").show();
                break;
            case "no-contenga":
                $(`.${buscarEn}:not(:Contains(${texto}))`).closest(".card").show();
                //$(".card-header:not(:Contains('" + texto + "'))").closest('tr').show();
                break;
            case "inicie":
                $(`.${buscarEn}`).each(function(){
                    var palabra = $(this).text();
                    if(palabra.toUpperCase().startsWith(texto.toUpperCase())){
                        $(this).closest(".card").show();
                    }
                });
                break;
            case "termine":
                $(`.${buscarEn}`).each(function(){
                    var palabra = $(this).text();
                    if(palabra.toUpperCase().endsWith(texto.toUpperCase())){
                        $(this).closest(".card").show();
                    }
                });
                break;
            case "exacto":
                $(`.${buscarEn}`).each(function(){
                    var palabra = $(this).text();
                    if(palabra == texto){
                        $(this).closest(".card").show();
                    }
                });
                break;
            default: break;
        }
    }else{
        $(".card").show();
    }
}

//---------------->triggres
$(document).ready(function(){
    loader(true);
    if(checkCookie("perfilId") ){
        obtenerTextos();
    }else{
        window.location.href = "index.html";
    }
});

$("#buscador").keyup(function(){
    buscarTexto($(this).val(), $("#inputFiltro").val(), $("#inputBuscarEn").val());
});

$(document).on("click", ".ver-texto-taller", function(){
    // $(this).data("ti"), $(this).data("ai")
    crearCookie("escritoid", $(this).data("ti"));
    crearCookie("autorid", $(this).data("ai"));
    window.location.href = "escrito.html";
});

$(document).on("click", ".autor", function(){
    //este puede llamarse escritorid para evitar confusiones entre la lectura y el perfil del autor
    crearCookie("autorid", $(this).data("ai"));
    window.location.href = "escritor.html";
});

// loader(false);