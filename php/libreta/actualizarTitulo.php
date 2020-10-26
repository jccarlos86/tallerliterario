<?php
    include '../conexion.php';
    $id = $_POST['idtexto'];
    $titulo = $_POST['titulo'];
    $perfil = $_POST['idperfil'];

    $result;
    $query = "SELECT DISTINCT(tituloTexto) FROM TextosUsuarios WHERE perfilId = '$perfil' AND tituloTexto = '$titulo'";
    $sel = $con ->query($query);
    if($sel){
        $row_cnt = $sel->num_rows;
        if($row_cnt > 0) {
            $result = "Duplicado";
        }else{
            $upd = $con -> query("UPDATE TextosUsuarios SET tituloTexto = '$titulo' WHERE idTexto='$id'");
            if($upd){
                $result = "true";
            }else{
                $result = die("Connection failed: " . mysqli_connect_error());
            }
        }
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    mysqli_close($con);
    echo $result;
?>