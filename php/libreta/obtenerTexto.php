<?php
include '../conexion.php';
$idTx = $_POST['idTexto'];
$perfil = $_POST['perfil'];

$query = "SELECT tituloTexto, indexTexto, texto FROM TextosUsuarios WHERE perfilId = '$perfil' AND idTexto = '$idTx' ORDER BY indexTexto";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $titulo = $row['tituloTexto'];
        $idx = $row['indexTexto'];
        $txt = $row['texto'];
        $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt );
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>