<?php
    include '../conexion.php';

    $id = $_POST['id'];
    $perfil = $_POST['perfil'];

    $result;

    $update = "UPDATE TextosUsuarios 
    SET 
        estatus = '0',
        txVersion = '1'
    WHERE perfilId = '$perfil' AND idTexto = '$id'";

    $upd = $con -> query($update);
    if($upd){
        $result = "true: Version del taller de regreso a la libreta.";
    }else{
        $result = die("Connection failed: No se pudo enviar el texto al taller: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>