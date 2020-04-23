<?php
include '../conexion.php';
$idperfil = $_POST['idperfil'];

$query = "SELECT DISTINCT(tu.tituloTexto), tu.idTexto, u.nombres, u.apellidos, u.usuario
FROM Usuarios u
INNER JOIN TextosUsuarios tu
ON u.perfilId = tu.perfilId
WHERE u.perfilId = '$idperfil' 
ORDER BY tu.tituloTexto";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $titulo = $row['tu.tituloTexto'];
        $idTxt = $row['tu.idTexto'];
        $nombre = $row['u.nombres'];
        $apellido = $row['u.apellidos'];
        $usuario = $row['u.usuario'];
        $jsonArray[] = array('Titulo' => $titulo, 'ID' => $idTxt, 'Nombre' => $nombre, 'Apellido' => $apellido, 'Usuario' => $usuario);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>