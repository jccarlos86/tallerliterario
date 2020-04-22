$(document).ready(function(){

});
//-------->funciones
function validarPassword(){
    var pass1 = $("#password").val();
    var pass2 = $("#confirmPass").val();
    var mail = $("#email").val();
    if( mail.length > 0 &&
        pass1.length > 0 &&
        pass2.length > 0 ){
        if(pass1 == pass2){
            existeMail(mail);
        }else{
            alert("las contrasenas no coinciden.");
        }
    }else{
        alert("todos los campos deben ser completados.");
    }
}

function existeMail(email){
    $.ajax({
        data: {
            email: email,
            tp: 3
        },
        url:   '../php/obtener.php',
        type:  'post',
        beforeSend: function () {
            console.log("Validando correo...");
        },
        success:  function (response) {
            switch(response){
                case "true":
                    alert("El correo ya se encuentra registrado, prueba con otro correo");
                    break;
                case "false":
                    //crear usuario.
                    generarIdPerfil();
                    break;
                default:
                    console.log("Error: " + response);
                    break;
            }
        }
    });
}

function generarIdPerfil(){
    var id = Math.round(Math.random() * 999999);
    existeId(id);
}

function existeId(id){
    $.ajax({
        data: {
            tp: 4,
            pfid: id
        },
        url:   '../php/obtener.php',
        type:  'post',
        beforeSend: function () {
            console.log("enviando datos para guardar en DB");
        },
        success:  function (response) {
            switch(response){
                case "true":
                    console.log("el id ya existe, se generara uno nuevo...");
                    generarIdPerfil();
                break;
                case "false":
                    var pass = $("#password").val();
                    var mail = $("#email").val();
                    crearUsuario(mail, pass, id);
                break;
                default: 
                    console.log("Error: " + response);
                break;
            }
        }
    });
}

function crearUsuario(email, password, perfilId){
    $.ajax({
        data: {
            email: email,
            password: password,
            perfilid: perfilId
        },
        url:   '../php/crearUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Creando usuario...");
        },
        success:  function (response) {
            if(response == "Guardado"){
                $("#exampleModalCenter").modal("hide");
                alert("Usuario creado exitosamente.");
                setTimeout(() => {
                    window.location.href="http://tallerliterario.c2-technologies.com/perfil.html?id=" + perfilId;
                }, 1500);
            }else{
                console.log("Error: " + response);
            }
        }
    });
}

//-------->triggers
$("#crearUsuario").click(function(){
    validarPassword();
});