//---------------->funciones
function obtenerTextos(){
    $.ajax({
        data: { },
        url:   '../php/taller/textosTaller.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando titulo...");
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
            cards += sesion.templates.tarjetas.replace("#texto#", texto)
            .replace("#autor#", autor)
            .replace("#titulo#", titulo)
            .replace("#textoid#", data[t].ID);
            texto = "";
        }else{
            texto += unescape(data[t].Texto);
        }
    }
    $("#cardTextos").html(cards);
    loader(false);
}

function verTextoTaller(idtexto){
    crearCookie("textoid", idtexto);
    //window.location.href = "";
}

//---------------->triggres
$(document).ready(function(){
    loader(true);
    obtenerTextos();
});
$(".ver-texto-taller").on("click", function(){
    verTextoTaller($(this).data("ti"));
});