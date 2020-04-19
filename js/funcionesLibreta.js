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
    }, mili);
    timer.timerId = timeId;
}

function limpiarAutoGuardar(id){
    clearInterval(id);
}

function guardarTexto(){
    //obtener valores de usuario y texto.
    console.log("texto guardado");
    alert("el texto se ha guardado");
}

$("#guardarTexto").click(function(){
    guardarTexto();
});

$("#btnAutoGuardar").click(function(){
    autoGuardar($("#selectMinutos").val());
});