<?php
  include '../conexion.php';

  $perfilId = $_POST['perfil'];
  $idTexto = $_POST['id'];
  $autor = $_POST['autor'];
  $comment = $_POST['comentario'];

  $query = "INSERT INTO Comentarios (id,perfilId, comentario, fecha, textoId, autorId)
  VALUES ('', '$perfilId', '$comment', NOW() - INTERVAL 5 HOUR + INTERVAL 5 MINUTE, '$idTexto', '$autor')";

  $insert = $con -> query($query);
  $result;
  if($insert){
    $result = "true";
  }else{
      $result = die("Connection failed: " . mysqli_connect_error());
  }
  echo $result;
  mysqli_close($con);
?>