var abecedario = "abcdefghijklmnopqrstuvwxyz1234567890 áéíóú!@#$%^&*)(_-+=?/}][{\|':;>.<,¡ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ";

/*
texto - el texto a cifrar.
id - es un numero identificador dado por el usuario, sirve para que al momento de cifrar (cuando vaya al abeceedario y busque
     la letra correspondiente, se le sume ese id, por ejemplo si busca la letra "c", el index de esa letra seria 2, pero si el 
     usuario agrega el id 2, se sumara ese numero al index dando como resultado 4, lo que traera la letra "e" de esta manera el texto 
     sera ilegible y queda por parte del usuario asignar este id), si el usuario no asigna un numero, nosotros se lo aignamos de
     manera aleatoria, y al final se lo indicamos.
rep - numero de veces que se cifrara el texto, una vez mezclado el texto, se procede a cifrarlo la cantidad de veces que el usuario haya
      indicado, si el usuario no lo indica, nosotros se lo asignamos al azar y se lo notificamos.
*/

function cifrar(texto, id, rep){
    var result = "";
    var reemplazar = texto.replace(/\n/g, " ");
    var data = reemplazar.split("");
    var largo = abecedario.length - 1;
    if(id === undefined || id == 0){ 
        id = Math.floor((Math.random() + 1) * 7);
    }
    if(rep === undefined || rep == 0) {
        rep = Math.floor((Math.random() + 1) * 7);
    }
    console.log("tu identificador es: ", id);
    console.log("tu repetidor es: ", rep);
        for(var d = 0; d < data.length; d++){
            var index = abecedario.indexOf(data[d]);
            var idx = index + id;
            if(index > -1){
                if(idx > largo){
                    idx = idx - largo;
                }
                if(idx < 0){
                    idx = largo + idx;
                }
            }else{
                console.log("fuera de rango -->", data[d]);
            }
            result += abecedario[idx];
        }
    return mezclar(result, rep);
}

function mezclar(texto, rep){
    for(var r = 0; r < rep; r++){
        texto = btoa(texto);
    }
    return texto;
}



function descifrar(cod, id, rep){
    var result = "";
    var dec = desmezclar(cod, rep);
    var data = dec.split("");
    var largo = abecedario.length - 1;
    if(id === undefined || id == 0){ 
        id = Math.floor((Math.random() + 1) * 7);
    }
    if(rep === undefined || rep == 0) {
        rep = Math.floor((Math.random() + 1) * 7);
    }
    for(var d = 0; d < data.length; d++){
        var index = abecedario.indexOf(data[d]);
        var idx = index - id;
        if(index > -1){
            if(idx > largo){
                idx = idx - largo;
            }
            if(idx < 0){
                idx = largo + idx;
            }
        }else{
            console.log("fuera de rango -->", data[d]);
        }
        result += abecedario[idx];
    }
    return result;
}

function desmezclar(texto, rep){
    try{
        for(var r = 0; r < rep; r++){
            texto = atob(texto);
        }
    }catch{
        console.log("surprise madafaka!");
        texto = cifrar("surprise madafaka!", 1, 1);
        desmezclar(texto, 1, 1);
    }
    return texto;
}