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
            $jsonArray[] = array(
                'Comentario' => $com, 
                'Fecha' => date("d/M/Y H:i:s", strtotime($fecha)), 
                'Usuario' => $user
            );
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);


    /*
comentarios 
SELECT c.comentario, c.fecha, u.usuario, c.perfilId FROM Comentarios c 
    INNER JOIN Usuarios u 
    ON c.perfilId = u.perfilId
    WHERE c.perfilId = 56814
    ORDER BY c.fecha

todos los comentarios de un texto.
SELECT * FROM `Comentarios` WHERE textoid = 613610201

todos los textos del Usuario
SELECT DISTINCT(tituloTexto), idTexto, estatus, MAX(txVersion) as maxVersion, genero 
    FROM TextosUsuarios WHERE perfilId = '$idperfil' GROUP BY tituloTexto
    */

?>

