<?php
include '../conexion.php';

$id = $_POST['id'];
$perfilId = $_POST['perfil'];

$delete = $con -> query("DELETE FROM TextosUsuarios WHERE idTexto = '$id' AND perfilId = '$perfilId'");

if($delete){
    echo "true";
}else{
    echo "false";
}
mysqli_close($con);
?>