//-------->funciones
function validarCredenciales(){
    var mail = $("#emailIngreso").val();
    var pass = $("#passwordIngreso").val();
    if(mail.length > 0 && pass.length > 0){
        accesoUsuario(mail, pass);
    }else{
        alert("Todos los campos deben ser llenados.");
    }
}

function accesoUsuario(mail, pass){
    $.ajax({
        data: {
            email: mail,
            password: pass
        },
        url:   '../php/index/accesar.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando datos...");
        },
        success: function (response) {
            switch(true){
                case response.startsWith("Formato"):
                    alert(response);
                break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                break;
                case response == "false":
                    alert("No se encontraron registros.");
                break;
                default: 
                    crearCookie("perfilId", response);
                    window.location.href="perfil.html";
                break;
            }
        }
    });
}

//-------->triggers
$(document).ready(function(){
    //if(checkCookie("perfilId")) window.location.href = "perfil.html";
});

$("#ingresar").click(function(){
    validarCredenciales();
});