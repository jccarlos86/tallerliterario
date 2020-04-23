<?php
include '../conexion.php';

$nombre = $_POST['nombre'];
$idTexto = $_POST['idTexto'];
$titulo = $_POST['titulo'];
$perfilId = $_POST['perfilid'];


 $insert = $con -> query("insert into TextosUsuarios (id, texto, idUsuario, nombreUsuario, idTexto, indexTexto, tituloTexto, perfilId)
 values ('', 'Comienza a escribir en esta area.', '', '$nombre', '$idTexto', '0', '$titulo', '$perfilId')");
 $result;
 if($insert){
   $result = "Guardado";
 }else{
    $result = die("Connection failed: " . mysqli_connect_error());
 }
 echo $result;
 mysqli_close($con);
?>