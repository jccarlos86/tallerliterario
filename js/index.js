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
            //validarEmail(mail);
        }else{
            alert("las contrasenas no coinciden.");
        }
    }else{
        alert("todos los campos deben ser completados.");
    }
}

// function validarEmail(valor) {
//     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(valor)){
//         //alert("La dirección de email " + valor + " es correcta.");
//         existeMail(valor);
//     } else {
//         alert("La dirección de email es incorrecta.");
//     }
// }

function existeMail(email){
    $.ajax({
        data: {
            email: email
        },
        url:   '../php/index/consultarMail.php',
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
                case response.startsWith("Formato"):
                    alert(response);
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
            pfid: id
        },
        url:   '../php/index/consultarId.php',
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
        url:   '../php/index/crearUsuario.php',
        type:  'post',
        beforeSend: function () {
            console.log("Creando usuario...");
        },
        success:  function (response) {
            switch(response){
                case "true":
                    $("#modalRegistro").modal("hide");
                    alert("Usuario creado exitosamente.");
                    setTimeout(() => {
                        window.location.href="perfil.html?upi=" + perfilId;
                    }, 1500);
                break;
                case response.startsWith("Formato"):
                    alert(response);
                break;
                default:
                    console.log("Error: " + response);
                break;
            }
        }
    });
}

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
            email: email,
            password: password
        },
        url:   '../php/index/accesar.php',
        type:  'post',
        beforeSend: function () {
            console.log("Consultando datos...");
        },
        success: function (response) {
            switch(response){
                case response.startsWith("Formato"):
                    alert(response);
                break;
                case response.startsWith("Connection"):
                    console.log("Error: " + response);
                break;
                case "false":
                    alert("No se encontraron registros.");
                break;
                default: 
                    window.location.href="perfil.html?upi=" + response;
                break;
            }
        }
}

//-------->triggers
$("#crearUsuario").click(function(){
    validarPassword();
});

$("#ingresar").click(function(){
    validarCredenciales();
});