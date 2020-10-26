<?php
    include '../conexion.php';
    $id = $_POST['idperfil'];
    $user = $_POST['usuario'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $acerca = $_POST['acerca'];
    $pass = $_POST['pass'];

    $result;

    $upd = $con -> query("UPDATE Usuarios set 
        usuario = '$user', 
        nombres = '$nombre', 
        apellidos = '$apellido',
        acercaDe = '$acerca',
        contrasena = '$pass'
        WHERE perfilId = '$id'");

    if($upd){
        $result = "true";
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }

    echo $result;
?>