<?php
include '../conexion.php';

if(isset($_POST["submit"])){
    $revisar = getimagesize($_FILES["image"]["tmp_name"]);
    //$perfilId $_POST['perfil'];
    if($revisar !== false){
        $image = $_FILES['image']['tmp_name'];
        $imgContenido = addslashes(file_get_contents($image));
        
        // Cerciorar la conexion
        if($con->connect_error){
            die("Connection failed: " . $con->connect_error);
        }
        
        //Insertar imagen en la base de datos
        $insertar = $con->query("UPDATE Usuarios SET imagen = '$imgContenido' WHERE perfilId = '177921'");
        // COndicional para verificar la subida del fichero
        if($insertar){
            echo "Archivo Subido Correctamente.";
        }else{
            echo "Ha fallado la subida, reintente nuevamente.";
        } 
        // Sie el usuario no selecciona ninguna imagen
    }else{
        echo "Por favor seleccione imagen a subir.";
    }
}
?>