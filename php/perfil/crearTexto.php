<?php
include '../conexion.php';

$titulo = $_POST['titulo'];
$perfilId = $_POST['perfilid'];
$idTexto = $_POST['idTexto'];

 $insert = $con -> query("insert into TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId, estatus, txVersion)
 values ('', 'Comienza a escribir en esta area.', '$idTexto', '0', '$titulo', '$perfilId', '0', '1')");
 $result;
 if($insert){
   $result = "true";
 }else{
    $result = die("Connection failed: " . mysqli_connect_error());
 }
 echo $result;
 mysqli_close($con);
?>