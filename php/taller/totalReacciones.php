<?php
    include '../conexion.php';
    $id = $_POST['id'];

    //cuenta todas las reacciones del texto
    $count = "SELECT 
    COUNT(tipoReaccion) AS 'total', 
    tipoReaccion

    FROM Reacciones 
    WHERE textoId = '$id'
    GROUP BY tipoReaccion";

    //validamos si el usuario ya ha reaccionado.
    $cnt = $con -> query($count);
    if($cnt){
        while($row = mysqli_fetch_array($cnt)){
            $tot = $row['total'];
            $tipo = $row['tipoReaccion'];
            $jsonArray[] = array('Reaccion' => $tipo, 'Total' => $tot);
        }
        $result = json_encode($jsonArray);
    }else{
        $result = die("Connection failed: falla al realizar conteo de reacciones: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>