<?php
include '../conexion.php';
$vers = $_POST['version'];
$perfil = $_POST['perfil'];
$id = $_POST['id'];

$query = "SELECT tituloTexto, indexTexto, texto, txVersion FROM TextosUsuarios WHERE 
perfilId = '$perfil' AND idTexto = '$id' AND txVersion = '$vers' ORDER BY indexTexto";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $titulo = $row['tituloTexto'];
        $idx = $row['indexTexto'];
        $txt = $row['texto'];
        $version = $row['txVersion'];
        $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt, 'Version' => $version);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}

echo $result;
mysqli_close($con);
?>