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
            email: email
        },
        url:   '../php/index/consultarMail.php',
        type:  'post',
        beforeSend: function () {
            console.log("Validando correo...");
        },
        success:  function (response) {
            switch(true){
                case response == "true":
                    alert("El correo ya se encuentra registrado, prueba con otro correo");
                    break;
                case response == "false":
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
            switch(true){
                case response == "true":
                    $("#modalRegistro").modal("hide");
                    alert("Usuario creado exitosamente.");
                    setTimeout(() => {
                        crearCookie("perfilId", perfilId);
                        window.location.href="perfil.html";
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

$("#crearUsuario").click(function(){
    validarPassword();
});

$("#ingresar").click(function(){
    validarCredenciales();
});