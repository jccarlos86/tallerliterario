<?php
    include '../conexion.php';

    $id = $_POST['idtexto'];
    $perfil = $_POST['idperfil'];
    $genero = $_POST['genero'];

    $result;
    $query = "UPDATE TextosUsuarios 
        SET genero = '$genero' 
        WHERE idTexto = '$id'";

    $upd = $con -> query($query);

    if($upd){
        $result = "true";
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    mysqli_close($con);
    echo $result;
?>