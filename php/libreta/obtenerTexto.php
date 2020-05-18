<?php
include '../conexion.php';
$idTx = $_POST['idTexto'];
$perfil = $_POST['perfil'];

$selMax = $con -> query("SELECT MAX(txVersion) AS 'MaxVersion' FROM TextosUsuarios WHERE perfilId = '$perfil' AND idTexto = '$idTx'");
if($selMax){
    while($row = mysqli_fetch_array($selMax)){
        $ver = $row['MaxVersion'];
    }
    $query = "SELECT tituloTexto, indexTexto, texto, txVersion, genero FROM TextosUsuarios WHERE 
    perfilId = '$perfil' AND idTexto = '$idTx' AND txVersion = '$ver' ORDER BY indexTexto";

    $sel = $con ->query($query);
    if($sel){
        while($row = mysqli_fetch_array($sel)){
            $titulo = $row['tituloTexto'];
            $idx = $row['indexTexto'];
            $txt = $row['texto'];
            $version = $row['txVersion'];
            $genero = $row['genero'];
            $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt, 'Version' => $version, 'Genero' => $genero);
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }

}else{
    $result = die("Connection failed: not max version -> " . mysqli_connect_error());
}

echo $result;
mysqli_close($con);
?>