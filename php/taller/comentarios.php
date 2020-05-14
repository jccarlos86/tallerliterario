<?php
include '../conexion.php';
$id = $_POST['idTexto'];
//$autor = $_POST['autor'];

$query = "SELECT c.comentario, c.fecha, u.usuario FROM Comentarios c 
INNER JOIN Usuarios u 
ON c.perfilId = u.perfilId
WHERE c.textoId = $id
ORDER BY c.fecha";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $com = $row['comentario'];
        $fecha = $row['fecha'];
        $user = $row['usuario'];
        $jsonArray[] = array('Comentario' => $com, 'Fecha' => $fecha, 'Usuario' => $user);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>