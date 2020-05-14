<?php
include '../conexion.php';
$id = $_POST['id'];
$perfil = $_POST['perfil'];
$verA = $_POST['verA'];
$verB = $_POST['verB'];

$query = "SELECT tituloTexto, indexTexto, texto, txVersion FROM TextosUsuarios WHERE 
perfilId = '$perfil' AND idTexto = '$id' AND (txVersion = '$verA' OR txVersion = '$verB') ORDER BY indexTexto";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $version = $row['txVersion'];
        $titulo = $row['tituloTexto'];
        $idx = $row['indexTexto'];
        $txt = $row['texto'];
        $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt, 'Version' => $version);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>