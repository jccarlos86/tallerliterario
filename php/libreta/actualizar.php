<?php
    include '../conexion.php';

    $index = $_POST['idx'];
    $texto = $_POST['txt'];
    $id = $_POST['idTexto'];
    $perfilId = $_POST['perfil'];

    $update = $con -> query("UPDATE TextosUsuarios SET texto = '$texto' 
    WHERE indexTexto = '$index' AND idTexto = '$id' AND perfilId = '$perfilId'");

    if($update){
        echo "true";
    }else{
        echo "false";
    }
    mysqli_close($con);
?>