<?php
include 'conexion.php';
//tipos de consultas
/*
0 - buscar solo el titulo del texto para el usuario (crear nuevo texto)
1 - buscar titulos de textos creados por el usuario (colocar su lista de textos creados)
2 - buscar contenido del texto (cargar el texto completo)
3 - buscar correo electronico (no debe haber dulicados)
4 - validar Perfil ID (no debe haber duplicados)
*/
$tipo = $_POST["tp"];
$titulo = $_POST["ttl"];
$idTexto = $_POST["idtx"];
$idUsuario = $_POST["idus"];
$email = $_POST['email'];
$perfilid = $_POST['pfid'];

$sel;
$query;
$result;
$jsonArray = array();
switch ($tipo){
    case 0:
        $query = "SELECT tituloTexto FROM TextosUsuarios WHERE idUsuario = '$idUsuario' AND tituloTexto = '$titulo'";
        $sel = $con ->query($query);
        if($sel){
            $row_cnt = $sel->num_rows;
            if($row_cnt > 0) {
                $result = "true";
            }else{
                $result = "false";
            }
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }
    break;
    case 1:
        $query = "SELECT DISTINCT(tituloTexto), idTexto FROM TextosUsuarios WHERE idUsuario = '$idUsuario'";
        $sel = $con ->query($query);
        if($sel){
            while($row = mysqli_fetch_array($sel)){
                $idTxt = $row['idTexto'];
                $titulo = $row['tituloTexto'];
                $jsonArray[] = array('IDTexto' => $idTxt, 'Titulo' => $titulo);
            }
            $result = json_encode($jsonArray);
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }
    break;
    case 2: 
        $query = "SELECT tituloTexto, texto, indexTexto, idTexto FROM TextosUsuarios WHERE idUsuario = '$idUsuario' AND idTexto = '$idTexto'";
        $sel = $con ->query($query);
        if($sel){
            while($row = mysqli_fetch_array($sel)){
                $texto = $row['texto'];
                $idTxt = $row['idTexto'];
                $idx = $row['indexTexto'];
                $jsonArray[] = array('Texto' => $texto, 'IndexTexto' => $idx, 'IDTexto' => $idTxt);
            }
            $result = json_encode($jsonArray);
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }
    break;
    case 3: 
        $query = "SELECT correo FROM Usuarios WHERE correo = '$email'";
        $sel = $con ->query($query);
        if($sel){
            $row_cnt = $sel->num_rows;
            if($row_cnt > 0) {
                $result = "true";
            }else{
                $result = "false";
            }
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }
    break;
    case 4:
        $query = "SELECT perfilId FROM Usuarios WHERE perfilId = '$perfilid'";
        $sel = $con ->query($query);
        if($sel){
            $row_cnt = $sel->num_rows;
            if($row_cnt > 0) {
                $result = "true";
            }else{
                $result = "false";
            }
        }else{
            $result = die("Connection failed: " . mysqli_connect_error());
        }
    break;
    default:break;
}
echo $result;
mysqli_close($con);


?>