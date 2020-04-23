<?php
include '../conexion.php';

$email = $_POST['email'];
$result;
if(empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    $result = "Formato: El formato de e-mail no es correcto.";
}else{
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
}

echo $result;
mysqli_close($con);

?>