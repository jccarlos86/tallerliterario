<?php
include '../conexion.php';

$email = $_POST['email'];
$password = $_POST['password'];

$result;
//encriptar password para validarlo, se recibe el password como texto simple, se encripta y se compara.
//cifrar($password, $id, $num);

if(empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    $result = "Formato: El formato de e-mail no es valido.";
}else{
    $sel = $con -> query("SELECT perfilId FROM Usuarios WHERE contrasena = '$password' AND correo = '$email' AND estatus = '1'");
    if($sel){
        $row_cnt = $sel->num_rows;
        if($row_cnt > 0){
            while($row = mysqli_fetch_assoc($sel)){
                $result = $row['perfilId'];
            }
        }else{
            $result = "false";
        }
    }else{
        $result = die("Connection failed: " . mysqli_connect_error());
    }
}
 echo $result;
 mysqli_close($con);


 
/*
texto - el texto a cifrar.
id - es un numero identificador dado por el usuario, sirve para que al momento de cifrar (cuando vaya al abeceedario y busque
      la letra correspondiente, se le sume ese id, por ejemplo si busca la letra "c", el index de esa letra seria 2, pero si el 
      usuario agrega el id 2, se sumara ese numero al index dando como resultado 4, lo que traera la letra "e" de esta manera el texto 
      sera ilegible y queda por parte del usuario asignar este id), si el usuario no asigna un numero, nosotros se lo aignamos de
      manera aleatoria, y al final se lo indicamos.
rep - numero de veces que se cifrara el texto, una vez mezcaldo el texto, se procede a cifrarlo la cantidad de veces que el usuario haya
      indicado, si el usuario no lo indica, nosotros se lo asignamos al azar y se lo notificamos.
*/
/*
$abecedario = "abcdefghijklmnopqrstuvwxyz1234567890 áéíóú!@#$%^&*)(_-+=?/}][{\|':;>.<,¡ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ";
function cifrar($texto, $id, $rep){
    $result = "";
    $reemplazar = texto.replace(/\n/g, " ");
    $data = reemplazar.split("");
    $largo = abecedario.length - 1;
    if($id === undefined || $id == 0){ 
        $id = Math.floor((Math.random() + 1) * 7);
    }
    if($rep === undefined || $rep == 0) {
        $rep = Math.floor((Math.random() + 1) * 7);
    }
    console.log("tu identificador es: ", id);
    console.log("tu repetidor es: ", rep);
        for($d = 0; $d < $data.length; $d++){
            $index = abecedario.indexOf($data[$d]);
            $idx = $index + $id;
            if($index > -1){
                if($idx > $largo){
                    $idx = $idx - $largo;
                }
                if($idx < 0){
                    $idx = $largo + $idx;
                }
            }else{
                console.log("fuera de rango -->", $data[$d]);
            }
            $result += $abecedario[$idx];
        }
    //return mezclar(result, rep);
    
    for($r = 0; $r < $rep; $r++){
        $result = btoa($result);
    }
}

function mezclar($texto, $rep){
    for($r = 0; r < rep; r++){
        texto = btoa(texto);
    }
    return texto;
}
*/

?>