<?php
    include '../conexion.php';
    $idautor = $_POST['idautor'];

    $query = "SELECT 
        DISTINCT(tituloTexto), 
        idTexto, 
        genero 
    FROM TextosUsuarios 
        WHERE perfilId = '$idautor' 
        AND estatus = 1
    GROUP BY tituloTexto";

    $sel = $con->query($query);
    if($sel){
        while($row = mysqli_fetch_array($sel)){
            $id = $row['idTexto'];
            $titulo = $row['tituloTexto'];
            $genero = $row['genero'];
            $jsonArray[] = array(
                'Titulo' => $titulo, 
                'ID' => $id, 
                'Genero' => $genero
            );
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>