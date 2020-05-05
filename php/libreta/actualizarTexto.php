<?php
include '../conexion.php';
$upd = $_POST['update'];
$crt = $_POST['create'];
$del = $_POST['delete'];

$idx = $_POST['idTexto'];
$perfilId = $_POST['perfil'];
$titulo = $_POST['titulo'];

$result;

if(count($del) > 0){
    $delete = $con -> query("DELETE FROM TextosUsuarios WHERE idTexto = '$idx' AND perfilId = '$perfilId' AND indexTexto IN ('$idx')");
    if($delete){
        echo "se eliminaron registros."
    }else{
        echo die("Connection failed: " . mysqli_connect_error());
    }
    mysqli_close($con);
}

if(count($upd) > 0){
    foreach($upd as $data){
        $i = 0;
        //$update = $con -> query("UPDATE TextosUsuarios SET texto = '$data->texto' WHERE indexTexto='$data->index' AND idTexto = '$idx' AND perfilId = '$perfilId'");
        $update = $con -> query("UPDATE TextosUsuarios SET texto = '$data[$i].texto' WHERE indexTexto='$data[$i].index' AND idTexto = '$idx' AND perfilId = '$perfilId'");
        $i++;
    }
    mysqli_close($con);
}

if(count($crt)){
    foreach($crt as $data){
        $i = 0;
        $create = $con -> query("INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId)
            VALUES ('', '$data->texto', '$idx', '$data->index', '$titulo', '$perfilId')");
        $i++;
    }
    mysqli_close($con);
}

echo $result;
mysqli_close($con);
?>