<?php
include 'concexion.php';

$sel = $con ->query("selecct * from TextosUsuarios");
while($fila = $sel -> fetch_assoc()){
    echo $fila['nombre'];
}

?>