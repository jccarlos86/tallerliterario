<?php
include '../conexion.php';
$idperfil = $_POST['idperfil'];

$query = "SELECT DISTINCT(tituloTexto), idTexto FROM TextosUsuarios WHERE perfilId = '$idperfil'";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $titulo = $row['tituloTexto'];
        $id = $row['idTexto'];
        $jsonArray[] = array('Titulo' => $titulo, 'ID' => $id);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>