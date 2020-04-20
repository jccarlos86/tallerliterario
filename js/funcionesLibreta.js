$(document).ready(function(){
    
});

//se recibe el tiempo en minutos
function autoGuardar(tiempo){
    if(timer.timerId > -1){
        limpiarAutoGuardar(timer.timerId);
    }
    //calcular tiempo en milisegundos 60000 = 1 min
    var mili = parseInt(tiempo) * 60000;
    var timeId = setInterval(function(){
        console.log("intervalo", Date());
        //ejecutra funcion guardar.
        obtenerTexto();
    }, mili);
    timer.timerId = timeId;
}

function limpiarAutoGuardar(id){
    clearInterval(id);
}

function guardarTexto(userId, nombre, texto, idTexto, index, tituloTexto){
    $.ajax({
        data: {
            userId: userId, 
            nombre: nombre, 
            texto: texto, 
            idTexto: idTexto, 
            index: index, 
            titulo: tituloTexto
        },
        url:   '../php/guardar.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            console.log(response);
        }
    });
}

function obtenerTexto(){
    //obtener valores de usuario y texto.
    var texto = $("#hojaTexto").val().split("\n");
    userId = 1;
    nombre = "Juan Carlos Carrera";
    idTexto = userId;
    titulo = "Test de guardado";
    if(texto.length > 0 && texto[0].length > 0){
        for(var a = 0; a < texto.length; a++){
            guardarTexto(userId, nombre, texto[a], idTexto, a, titulo);
        }
    }else{
        alert("el campo de texto se encuentra vacio, no hay datos por guardar");
    }
}

//------>triggers
$("#guardarTexto").click(function(){
    obtenerTexto();
});

$("#btnAutoGuardar").click(function(){
    autoGuardar($("#selectMinutos").val());
});