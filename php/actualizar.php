<?php
include 'conexion.php';
$id = $_POST['id'];
$texto = $_POST['texto'];


$upd = $con -> query("update TextosUsuarios set text = '$texto'
where id='$id'");

if($upd){
    echo "<script>
    console.log('texto actualizado');
    </script>";
}else{
    echo "<script>
    console.log('prolemas al actualizar');
    </script>";
}


?>