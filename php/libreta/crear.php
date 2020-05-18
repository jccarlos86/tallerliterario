<?php
    include '../conexion.php';

    $index = $_POST['idx'];
    $texto = $_POST['txt'];
    $id = $_POST['idTexto'];
    $perfilId = $_POST['perfil'];
    $titulo = $_POST['titulo'];
    $version = $_POST['version'];
    $genero = $_POST['genero'];


    $create = $con -> query("INSERT INTO TextosUsuarios 
                (id, texto, idTexto, indexTexto, tituloTexto, perfilId, estatus, txVersion, genero)
                VALUES 
                ('', '$texto', '$id', '$index', '$titulo', '$perfilId', '0', '$version', '$genero')");

    if($create){
        echo "true";
    }else{
        echo "false";
    }
    mysqli_close($con);
?>