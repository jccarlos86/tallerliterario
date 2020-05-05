<?php
include '../conexion.php';

$index = $_POST['idx'];
$id = $_POST['idTexto'];
$perfilId = $_POST['perfil'];

$delete = $con -> query("DELETE FROM TextosUsuarios WHERE idTexto = '$id' AND perfilId = '$perfilId' AND indexTexto = '$index'");

if($delete){
    echo "true";
}else{
    echo "false";
}
mysqli_close($con);
?>