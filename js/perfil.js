function datosCrearTexto(){
    var titulo = $("#tituloTexto").val();
    var userId = $("#usrId").val();
    var nombre = $("#usrName").val();
    var idTexto = $("#IdTexto").val();

    if(titulo.length > 0){
        crearTexto(userId, nombre, escape(nuevoTexto.txtDefault), idTexto, 0, escape(titulo));
    }else{
        alert("Agrega un titulo al texo");
    }
}

function crearTexto(userId, nombre, texto, idTexto, index, tituloTexto){
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
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            console.log(response);
        }
    });
}

//------------->triggers
$("#btnCrearTexto").click(function(){
    datosCrearTexto();
});