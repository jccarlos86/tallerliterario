<?php
include 'conexion.php';

$usrId = $_POST['userId'];
$nombre = $_POST['nombre'];
$txt = $_POST['texto'];
$idTexto = $_POST['idTexto'];
$index = $_POST['index'];
$titulo = $_POST['titulo'];


 $insert = $con -> query("insert into TextosUsuarios (id, texto, idUsuario, nombreUsuario, idTexto, indexTexto, tituloTexto)
 values ('', '$txt', '$usrId', '$nombre', '$idTexto', '$index', '$titulo')");
 $result;
 if($insert){
   $result = "Guardado";
 }else{
    $result = die("Connection failed: " . mysqli_connect_error());
 }
 echo $result;
 mysqli_close($con);
?>