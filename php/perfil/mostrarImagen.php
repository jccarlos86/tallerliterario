<?php
include '../conexion.php';

if(!empty($_GET['id'])){
    //Credenciales de conexion
    // $Host = 'localhost';
    // $Username = 'root';
    // $Password = 'root';
    // $dbName = 'images_db';
    
    //Crear conexion mysql
    // $con = new mysqli($Host, $Username, $Password, $dbName);
    
    //revisar conexion
    if($con->connect_error){
       die("Connection failed: " . $con->connect_error);
    }
    
    //Extraer imagen de la BD mediante GET
    $result = $con->query("SELECT imagen FROM Usuarios WHERE perfilId = '177921'");
    
    if($result->num_rows > 0){
        $imgDatos = $result->fetch_assoc();
        
        //Mostrar Imagen
        header("Content-type: image/jpg"); 
        echo $imgDatos['imagenes']; 
    }else{
        echo 'Imagen no existe...';
    }
}
?>