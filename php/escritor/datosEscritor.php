<?php
    include '../conexion.php';
    $idautor = $_POST['idautor'];

    $query = "SELECT 
        nombres, 
        apellidos, 
        usuario,
        acercaDe
        FROM Usuarios WHERE perfilId = '$idautor' 
        AND estatus = '1'";

    $sel = $con ->query($query);
    if($sel){
        while($row = mysqli_fetch_array($sel)){
            $nombre = $row['nombres'];
            $apellido = $row['apellidos'];
            $usuario = $row['usuario'];
            $acerca = $row['acercaDe'];
            $jsonArray[] = array(
                'Nombre' => $nombre, 
                'Apellido' => $apellido, 
                'Usuario' => $usuario,
                'Acerca' => $acerca
            );
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>