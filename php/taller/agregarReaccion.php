<?php
    include '../conexion.php';
    /**
     * tipos de reacciones
     * 0 - dislike
     * 1 - like
     * 2 - insignia
     */
    //parametros requeridos.
    $id = $_POST['id']; // a quien reacciona (texto)
    $tipo = $_POST['tipo']; //que reacciona (tipo de reaccion)
    $perfil = $_POST['perfil']; //quien reacciona (usuario)

    //variables a utilizar.
    $result;
    $descr;

    //descripcion del tipo de reaccion.
    switch($tipo){
        case 0:
            $descr = "dislike";
        break;
        case 1:
            $descr = "like";
        break;
        case 2:
            $descr = "insignia";
        break;
    }

    //queries a utilizar.
    //agrega reaccion del usuario
    $insert = "INSERT INTO Reacciones (id, perfilId, textoId, tipoReaccion, descReaccion)
                        VALUES ('', '$perfil', '$id', '$tipo', '$descr')";

    //elimina reaccion del usuario
    $delete = "DELETE FROM Reacciones WHERE textoId = '$id' AND perfilId = '$perfil' AND tipoReaccion = '$tipo' LIMIT 1";

    //cuenta todas las reacciones del texto
    // $count = "SELECT COUNT(tipoReaccion) as 'totalReaccion', tipoReaccion, descReaccion FROM Reacciones 
    // WHERE textoId = '$id' GROUP BY tipoReaccion";

    //valida si el usuario ya ha realizado la misma reaccion, si es asi, la elimina.
    $validate = "SELECT perfilId FROM Reacciones WHERE textoId = '$id' AND perfilId = '$perfil' AND tipoReaccion = '$tipo'";

    //validamos si el usuario ya ha reaccionado.
    $val = $con -> query($validate);
    if($val){
        


        if(mysqli_num_rows($val) > 0){
            //ya ha reaccionado, por lo tanto se elimina esa reaccion.
            $del = $con -> query($delete);
            if($del){
                $result = "true: reaccion anterior eliminada";
            }else{
                $result = "Connection failed: falla al eliminar la reaccion anterior del usuario: " . mysqli_connect_error();
            }
        }else{
            //no ha reaccionado, por lo tanto se agrega esa reaccion.
            $ins = $con -> query($insert);
            if($ins){
                $result = "true: reaccion guardada correctamente.";
            }else{
                $result = "Connection failed: falla al guardar la reaccion del usuario: " . mysqli_connect_error();
            }
        }
    }else{
        $result = "Connection failed: falla al realizar validacion de reacciones: " . mysqli_connect_error();
    }
    echo $result;
    mysqli_close($con);
?>