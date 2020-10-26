<?php
include '../conexion.php';

$query = "SELECT 
    u.nombres, 
    u.apellidos, 
    u.usuario,
    u.perfilId,
    tu.tituloTexto,
    tu.idTexto,
    tu.indexTexto,
    tu.txVersion,
    tu.genero,
    tu.fechaIngresoTaller,
    tu.texto FROM TextosUsuarios tu INNER JOIN Usuarios u
ON tu.perfilId = u.perfilId
WHERE tu.estatus = '1' AND u.estatus = '1' AND tu.indexTexto IN(0,1,2,3,4,5)
ORDER by tu.fechaIngresoTaller DESC, tu.indexTexto ASC";
/*ORDER by tu.tituloTexto, tu.indexTexto ASC";*/

$insignia = "false";
$sel = $con ->query($query);
if($sel){
    while($row = mysqli_fetch_array($sel)){
        $id = $row['idTexto'];

        $queryInsignia = "SELECT tipoReaccion FROM `Reacciones` WHERE tipoReaccion = 2 AND textoId = '$id'";
        $selInsignia = $con -> query($queryInsignia);
        if($selInsignia){
            $val = $selInsignia -> fetch_assoc();
            if($val['tipoReaccion'] > 0){
                $insignia = "true";
            }
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }

        $nombre = $row['nombres'];
        $apellido = $row['apellidos'];
        $usuario = $row['usuario'];
        $titulo = $row['tituloTexto'];
        $index = $row['indexTexto'];
        $txt = $row['texto'];
        $autor = $row['perfilId'];
        $genero = $row['genero'];
        $fechaTaller = $row['fechaIngresoTaller'];
        $jsonArray[] = array(
            'Titulo' => $titulo, 
            'ID' => $id, 
            'Texto' => $txt, 
            'Index' => $index, 
            'Nombre' => $nombre, 
            'Apellido' => $apellido, 
            'Usuario' => $usuario, 
            'AutorId' => $autor,
            'Genero' => $genero,
            'Fecha' => date("d/M/Y H:i:s", strtotime($fechaTaller)),
            'Insignia' => $insignia
        );
    }
    $result = json_encode($jsonArray);
}else{
    $result = die("Connection failed: " . mysqli_connect_error());
}
echo $result;
mysqli_close($con);
?>