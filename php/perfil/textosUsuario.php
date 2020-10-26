<?php
    include '../conexion.php';
    $idperfil = $_POST['idperfil'];

    $query = "SELECT DISTINCT(tituloTexto), idTexto, estatus, MAX(txVersion) AS maxVersion, genero 
    FROM TextosUsuarios WHERE perfilId = '$idperfil' GROUP BY tituloTexto";

    $sel = $con->query($query);
    if($sel){
        while($row = mysqli_fetch_array($sel)){
            $id = $row['idTexto'];

            $queryCount = "SELECT comentario FROM Comentarios WHERE textoid = '$id'";
            $count = $con->query($queryCount);
            if($count){
                $cnt = $count->num_rows;
            }else{
                $cnt = die("Connection failed: " . mysqli_connect_error());
            }

            $titulo = $row['tituloTexto'];
            $estatus = $row['estatus'];
            $ver = $row['maxVersion'];
            $genero = $row['genero'];
            $jsonArray[] = array(
                'Titulo' => $titulo, 
                'ID' => $id, 
                'Estatus' => $estatus, 
                'Version' => $ver, 
                'Genero' => $genero,
                'Num_Comentarios' => $cnt
            );
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>