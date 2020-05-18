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
            .replace("#autorid#", data[t].AutorId);
            texto = "";
        }else{
            texto += unescape(data[t].Texto) + "<br/>";
        }
    }
    $("#cardTextos").html(cards);
    leertexto();
    loader(false);
}

function verTextoTaller(idtexto, idautor){
    crearCookie("escritoid", idtexto);
    crearCookie("autorid", idautor);
    window.location.href = "escrito.html";
}

function leertexto(){
    $(".ver-texto-taller").click(function(){
        verTextoTaller($(this).data("ti"), $(this).data("ai"));
    });
}

//---------------->triggres
$(document).ready(function(){
    loader(true);
    obtenerTextos();
});