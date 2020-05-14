<?php
include '../conexion.php';
$idTx = $_POST['id'];

$query = "SELECT 
tu.tituloTexto,
tu.indexTexto,
tu.texto,
tu.likes,
tu.dislikes,
tu.reconocimientos,
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
        $like = $row['likes'];
        $dislike = $row['dislikes'];
        $recon = $row['reconocimientos'];
        $jsonArray[] = array('Titulo' => $titulo, 'Index' => $idx, 'Texto' => $txt, 'Likes' => $like, 
        'Dislikes' => $dislike, 'Reconocimientos' => $recon, 'Autor' => $nombre . ' ( ' . $user . ' )');
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>