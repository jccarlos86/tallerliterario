<?php

    $to = $_POST['to'];
    $message = $_POST['mensaje'];
    $subject = $_POST['asunto'];

    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );

    $from = "taller@taller-literario.com";
    // $to = "jccarlos.carrera@gmail.com";
    //$subject = "Checking PHP mail";
    // $message = "PHP mail works just fine";
    $headers = "From:" . $from;

    $success = mail($to,$subject,$message, $headers);

    if (!$success) {
        $errorMessage = error_get_last()['message'];
        echo $errorMessage;
    }else{
        
    echo "The email message was sent.";
    }

?>