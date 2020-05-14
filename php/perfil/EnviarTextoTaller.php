<?php
    include '../conexion.php';

    $id = $_POST['id'];
    $perfil = $_POST['perfil'];
    $vers = $_POST['version'];

    $result;
    $upd = $con -> query("UPDATE TextosUsuarios SET estatus = '1' WHERE perfilId = '$perfil' AND idTexto = '$id' AND txVersion = '$vers'");
    if($upd){
        $result = "true: Update";
        $delete = $con -> query("DELETE FROM TextosUsuarios WHERE idTexto = '$id' AND perfilId = '$perfil' AND txVersion != '$vers'");
        if($delete){
            $result = $result . " / true: Delete";
        }else{
            $result = die("Connection failed: Delete all versions ->" . mysqli_connect_error());
        }
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>