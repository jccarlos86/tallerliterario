<?php
include 'conexion.php';
$usrId = $_POST['userId'];
$nombre = $_POST['nombre'];
$txt = $_POST['texto'];
$version = $_POST['version'];
$index = $_POST['index'];


 $insert = $con -> query("insert into TextosUsuarios (id, UserId, nombre, texto, version, index)
 values ('', '$usrId', '$nombre', '$txt', '$version', '$index')");

 if($insert){
    echo "Guardado";
 }else{
    echo "no se ha guardado";
 }
?>