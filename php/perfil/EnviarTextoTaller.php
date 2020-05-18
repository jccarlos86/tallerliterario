<?php
    include '../conexion.php';

    $id = $_POST['id'];
    $perfil = $_POST['perfil'];
    $vers = $_POST['version'];

    $result;
    $maxIndex;

    //Candado, validar que tengo al menos 5 lineas (index) en la version que s eva a enviar al taller
    //esto para mejro control al mostrar textos en la pagina del taller funcion pegartextos() en taller.js, valida el index 5 de cada texto.
    $validate = "SELECT MAX(indexTexto) AS 'MaxIndex' FROM TextosUsuarios 
            WHERE perfilId = '$perfil' AND idTexto = '$id' AND txVersion = '$vers'";

    $update = "UPDATE TextosUsuarios SET estatus = '1' WHERE perfilId = '$perfil' AND idTexto = '$id' AND txVersion = '$vers'";

    $delete = "DELETE FROM TextosUsuarios WHERE idTexto = '$id' AND perfilId = '$perfil' AND txVersion != '$vers'";

    $val = $con -> query($validate);
    if($val){
        $row = mysqli_fetch_assoc($val);
        $maxIndex = $row['MaxIndex'];
        if($maxIndex >= 5){
            $upd = $con -> query($update);
            if($upd){
                $result = "true: Version del texto enviada al taller.";
                $del = $con -> query($delete);
                if($delete){
                    $result = $result . " / true: Delete";
                }else{
                    $result = die("Connection failed: Falla al eliminar las demas versiones del texto" . mysqli_connect_error());
                }
            }else{
                $result = die("Connection failed: No se pudo enviar el texto al taller: " . mysqli_connect_error());
            }
        }else{
            $result = "Invalido: el texto debe tener al menos 5 lineas, Max Index: " . $maxIndex;
        }
    }else{
        $result = die("Connection failed: No se pudo validar el texto: " . mysqli_connect_error());
    }
    echo $result;
    mysqli_close($con);
?>