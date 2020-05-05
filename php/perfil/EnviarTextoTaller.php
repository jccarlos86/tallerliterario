<?php
include '../conexion.php';

$id = $_POST['id'];
$perfil = $_POST['perfil'];

$result;

$upd = $con -> query("UPDATE TextosUsuarios SET estatus = '1' WHERE perfilId = '$perfil' AND idTexto = '$id'");

if($upd){
    $result = "true";
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}

echo $result;
?>