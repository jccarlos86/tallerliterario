<?php
include '../conexion.php';
$id = $_POST['idperfil'];
$user = $_POST['usuario'];
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];

$result;

$upd = $con -> query("update Usuarios set usuario = '$user', nombres = '$nombre', apellidos = '$apellido'
where perfilId='$id'");

if($upd){
    $result = "true";
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}

echo $result;
?>