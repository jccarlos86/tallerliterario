<?php
include '../conexion.php';

$index = $_POST['idx'];
$texto = $_POST['txt'];
$id = $_POST['idTexto'];
$perfilId = $_POST['perfil'];
$titulo = $_POST['titulo'];

$create = $con -> query("INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId)
            VALUES ('', '$texto', '$id', '$index', '$titulo', '$perfilId')");

if($create){
    echo "true";
}else{
    echo "false";
}
mysqli_close($con);
?>