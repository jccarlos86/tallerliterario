<?php
include '../conexion.php';
$id = $_POST['id'];
$tipo = $_POST['tipo'];

$result;
$cont;
$campo;

switch($tipo){
    case 0:
        $sel = $con -> query("SELECT likes FROM TextosUsuarios WHERE idTexto = '$id' LIMIT 1");
        while($row = mysqli_fetch_array($sel)){
            $cont = $row['likes'] + 1;
        }
        $upd = $con -> query("UPDATE TextosUsuarios SET likes = $cont WHERE idTexto = '$id'");
    break;
    case 1:
        $sel = $con -> query("SELECT dislikes FROM TextosUsuarios WHERE idTexto = '$id' LIMIT 1");
        while($row = mysqli_fetch_array($sel)){
            $cont = $row['dislikes'] + 1;
        }
        $upd = $con -> query("UPDATE TextosUsuarios SET dislikes = '$cont' WHERE idTexto = '$id'");
    break;
    case 2:
        $sel = $con -> query("SELECT reconocimientos FROM TextosUsuarios WHERE idTexto = '$id' LIMIT 1");
        while($row = mysqli_fetch_array($sel)){
            $cont = $row['reconocimientos'] + 1;
        }
        $upd = $con -> query("UPDATE TextosUsuarios SET reconocimientos = '$cont' WHERE idTexto = '$id'");
    break;
}

// $cont = $con -> query("SELECT $campo FROM TextosUsuarios WHERE idTexto = $id LIMIT 1");
// $cont = $cont + 1;
// $upd = $con -> query("UPDATE TextosUsuarios SET $campo = '$cont' WHERE idTexto = '$id'");

if($upd){
    $result = "true";
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}

echo $result;
?>