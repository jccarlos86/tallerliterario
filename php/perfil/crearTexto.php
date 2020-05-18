<?php
  include '../conexion.php';

  $titulo = $_POST['titulo'];
  $perfilId = $_POST['perfilid'];
  $idTexto = $_POST['idTexto'];
  $genero = $_POST['genero'];

  //validar si el texto ya existe.
  $validate = "SELECT tituloTexto FROM TextosUsuarios WHERE tituloTexto = '$titulo' AND perfilId = '$perfilId'";

  //agregar texto
  $insert = "INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId, estatus, txVersion, genero)
        VALUES ('', 'Comienza a escribir en esta area.', '$idTexto', '0', '$titulo', '$perfilId', '0', '1', '$genero')";

  //validamos el titulo del texto.
  $valid = $con -> query($validate);
  if($valid){
    if(mysqli_num_rows($valid) > 0){
      //duplicado.
      $result = "duplicado";
    }else{
      //no existe, se puede crear el texto.
      $ins = $con -> query($insert);
      if($ins){
        $result = "true";
      }else{
          $result = die("Connection failed: Falla al crear el nuevo texto" . mysqli_connect_error());
      }
    }
  }else{
    $result = die("Connection failed: Error al validar el texto: " . mysqli_connect_error());
  }
  echo $result;
  mysqli_close($con);
?>