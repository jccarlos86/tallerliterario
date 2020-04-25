<?php
include '../conexion.php';
$upd = $_POST['update'];
$crt = $_POST['create'];
$del = $_POST['delete'];

$id = $_POST['idTexto'];
$perfilId = $_POST['perfil'];
$titulo = $_POST['titulo'];

$result;

if($del.count > 0){
    $delete = $con -> query("DELETE FROM TextosUsuarios WHERE idTexto = '$id' AND perfilId = '$perfilId' AND indexTexto IN ('$idx')");
    if($delete){
        echo "se eliminaron registros."
    }else{
        echo die("Connection failed: " . mysqli_connect_error());
    }
    mysqli_close($con);
}

if($upd.count > 0){
    foreach($upd as $data){
        $update = $con -> query("UPDATE TextosUsuarios SET texto = '$data->texto' WHERE indexTexto='$data->index' AND idTexto = '$id' AND perfilId = '$perfilId'");
    }
    mysqli_close($con);
}

if($crt.count){
    foreach($crt as $data){
        $create = $con -> query("INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId)
            VALUES ('', '$data->texto', '$id', '$data->index', '$titulo', '$perfilId')");
    }
    mysqli_close($con);
}

echo $result;
mysqli_close($con);
?>