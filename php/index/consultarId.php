<?php
include '../conexion.php';
$perfilid = $_POST['pfid'];

$query;
$result;

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

echo $result;
mysqli_close($con);


?>