<?php
include 'conexion.php';

$email = $_POST['email'];
$password = $_POST['password'];
$perfilId = $_POST['perfilid'];


 $insert = $con -> query("insert into Usuarios (id, perfilId, nombres, apellidos, usuario, contrasena, correo)
 values ('', '$perfilId', 'NOMBRES', 'APELLIDOS', 'USUARIO', '$password', '$email')");
 $result;
 if($insert){
   $result = "Guardado";
 }else{
    $result = die("Connection failed: " . mysqli_connect_error());
 }
 echo $result;
 mysqli_close($con);
?>