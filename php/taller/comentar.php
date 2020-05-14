<?php
include '../conexion.php';

$perfilId = $_POST['perfil'];
$idTexto = $_POST['id'];
$autor = $_POST['autor'];
$comment = $_POST['comentario'];

 $insert = $con -> query("insert into Comentarios (id,perfilId, comentario, fecha, textoId, autorId)
                                    values ('', '$perfilId', '$comment', now(), '$idTexto', '$autor')");
 $result;
 if($insert){
   $result = "true";
 }else{
    $result = die("Connection failed: " . mysqli_connect_error());
 }
 echo $result;
 mysqli_close($con);
?>