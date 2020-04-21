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

function obtenerTexto(){
    //obtener valores de usuario y texto.
    var texto = $("#hojaTexto").val().split("\n");
    userId = 1;
    nombre = "Juan Carlos Carrera";
    idTexto = userId;
    titulo = "Test de guardado";
    if(texto.length > 0 && texto[0].length > 0){
        for(var a = 0; a < texto.length; a++){
            //actualizarTexto(userId, nombre, texto[a], idTexto, a, titulo);
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