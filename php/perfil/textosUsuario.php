<?php
    include '../conexion.php';
    $idperfil = $_POST['idperfil'];

    $query = "SELECT DISTINCT(tituloTexto), idTexto, estatus, MAX(txVersion) as maxVersion, genero 
    FROM TextosUsuarios WHERE perfilId = '$idperfil' GROUP BY tituloTexto";

    $sel = $con ->query($query);
    if($sel){
        while($row = mysqli_fetch_array($sel)){
            $titulo = $row['tituloTexto'];
            $id = $row['idTexto'];
            $estatus = $row['estatus'];
            $ver = $row['maxVersion'];
            $genero = $row['genero'];
            $jsonArray[] = array('Titulo' => $titulo, 'ID' => $id, 'Estatus' => $estatus, 'Version' => $ver, 'Genero' => $genero);
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>