<?php
include '../conexion.php';
$ID = $_POST['ID'];

$query;
$result;

$query = "SELECT DISTINCT(idTexto) FROM TextosUsuarios WHERE idTexto = '$ID'";
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

echo $result;
mysqli_close($con);


?>