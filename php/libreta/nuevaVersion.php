<?php
include '../conexion.php';
$id = $_POST['id'];
$perfil = $_POST['perfil'];
$texto = $_POST['text'];
$idx = $_POST['index'];
$titulo = $_POST['titulo'];
$ver = $_POST['version'];

$result;

$insert = $con -> query("INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId, estatus, txVersion)
    values ('', '$texto', '$id', '$idx', '$titulo', '$perfil', '0', '$ver')");
    if($insert){
        $result = "true";
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }

// $selMax = $con -> query("SELECT MAX(txVersion) FROM TextosUsuarios WHERE perfilId = '$perfil' AND idTexto = '$idTx'");
// if($selMax){
//     while($row = mysqli_fetch_array($selMax)){
//         $ver = $row['txVersion'];
//     }
//     $ver;
//     $insert = $con -> query("INSERT INTO TextosUsuarios (id, texto, idTexto, indexTexto, tituloTexto, perfilId, estatus, txVersion)
//     values ('', '$texto', '$id', '$idx', '$titulo', '$perfil', '0', '$ver')");
//     if($insert){
//         $result = "true";
//     }else{
//         $result = die("Connection failed: " . mysqli_connect_error());
//     }
// }else{
//     $result = die("Connection failed: Max Version not found ->" . mysqli_connect_error());
// }
echo $result;
mysqli_close($con);
?>