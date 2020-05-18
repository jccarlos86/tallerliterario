<?php
include '../conexion.php';
$idTx = $_POST['id'];

$query = "SELECT 
tu.tituloTexto,
tu.indexTexto,
tu.texto,
u.nombres,
u.usuario
FROM TextosUsuarios tu
INNER JOIN Usuarios u
ON tu.perfilId = u.perfilId
WHERE tu.idTexto = '$idTx' 
ORDER BY indexTexto";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $titulo = $row['tituloTexto'];
        $idx = $row['indexTexto'];
        $txt = $row['texto'];
        $nombre = $row['nombres'];
        $user = $row['usuario'];
        $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt,
        'Autor' => $nombre . ' ( ' . $user . ' )');
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>