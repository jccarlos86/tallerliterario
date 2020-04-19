<?php
include 'conexion.php';
$id = $request['id'];
$del = $con -> query("delete from TextosUsuarios where id = '$id'");
if($del){
    echo "<script>
    console.log('registro eliminado');
    </script>";
}else{
    echo "<script>
    console.log('prolemas al eliminar el registro');
    </script>";
}


?>