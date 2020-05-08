<?php
include '../conexion.php';

$query = "SELECT 
u.nombres, 
u.apellidos, 
u.usuario,
tu.tituloTexto,
tu.idTexto,
tu.indexTexto,
tu.texto FROM TextosUsuarios tu INNER JOIN Usuarios u
ON tu.perfilId = u.perfilId
WHERE tu.estatus = '1' AND u.estatus = '1' AND tu.indexTexto IN(0,1,2,3,4,5)
ORDER by tu.tituloTexto, tu.indexTexto ASC";

$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $nombre = $row['nombres'];
        $apellido = $row['apellidos'];
        $usuario = $row['usuario'];
        $titulo = $row['tituloTexto'];
        $id = $row['idTexto'];
        $index = $row['indexTexto'];
        $txt = $row['texto'];
        $jsonArray[] = array('Titulo' => $titulo, 'ID' => $id, 'Texto' => $txt, 'Index' => $index, 
                        'Nombre' => $nombre, 'Apellido' => $apellido, 'Usuario' => $usuario);
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>