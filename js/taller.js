//---------------->funciones
function obtenerTextos(){
    $.ajax({
        data: {
            idperfil: datosTexto.upi,
            idtexto: datosTexto.ti,
            titulo: escape(tit),
        },
        url:   '../php/taller/textosTaller.php',
        type:  'post',
        beforeSend: function () {
            console.log("Actualizando titulo...");
        },
        success: function (response) {
            switch(true){
                case response == "true":
                    $("#titulo").html(tit);
                    datosTexto.ttl = tit;
                    alert("Titulo actualizado correctamente.");
                    break;
                case response == "Duplicado":
                    alert("Ese titulo ya se encuentra asignado a otro texto.");
                    $("#titulo").html(datosTexto.ttl);
                    break;
                case response.startsWith("Connection"):
                    datosTexto.ttl = tit;
                    console.log("Error: " + response);
                    break;
            }
        }
    });
}

function pegartextos(){
    var textos = {
        Titulo: "Titulo del texto",
        Texto: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore fugiat nemo, quo voluptatum debitis illum molestiae neque. Soluta, at amet quam rem, eum impedit officia totam vero adipisci ea neque.",
        Autor: "AUTOR DEL TEXTO"
    };
    let cards = "";
    for(var t = 0; t < 15; t++){
        cards += '<div class="card">'+
            '<div class="card-body">'+
                '<h5 class="card-title">' + textos.Titulo + '</h5>'+
                '<p class="card-text">' + textos.Texto + '</p>'+
                '<p class="card-text"><small class="text-muted">' + textos.Autor + '</small></p>'+
                '<p><button type="button" class="btn btn-primary">Ver mas</button></p>'+
            '</div>'+
        '</div>';
    }
    $("#cardTextos").html(cards);
}

//---------------->triggres
$(document).ready(function(){
    //obtenerTextos();
    pegartextos();
});

$("a").click(function(evt){
    evt.preventDefault();
})