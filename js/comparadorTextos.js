$(document).ready(function(){
    $("#checkEqual").prop("checked", true);
    
    $("#inputSeparar").keyup(function(){
        var valor = $(this).val();
        if(valor.length > 1){
            $(this).val(valor.slice(0, -1));
        }
    });
    
    $("#btnComparar").click(function(){
        var txt1 = $("#texto1").val();
        var txt2 = $("#texto2").val();
        var separador = $("#inputSeparar").val();
        var mayusc = $("#checkEqual").is(":checked");
        var data1 = [];
        var data2 = [];
            
        if(separador.length > 0){
            data1 = txt1.split(separador);
            data2 = txt2.split(separador);
        }else{
            data1 = txt1.split("\n");
            data2 = txt2.split("\n");
        }
        
        $("#listModal").html("");
        $("#modalHeader").html("Resultados");
        
        if(mayusc){
            for(var i = 0; i < data1.length; i++){
                if(data1[i] != data2[i]){
                    $("#listModal").append(`<li>texto: <i class="text-primary">${data1[i]}</i> no coincide con <i class="text-info">${data2[i]}</i></li>`);
                }
            }
        }else{
            for(var i = 0; i < data1.length; i++){
                if(data1[i].toLowerCase() != data2[i].toLowerCase()){
                    $("#listModal").append(`<li>texto: <i class="text-primary">${data1[i]}</i> no coincide con <i class="text-info">${data2[i]}</i></li>`);
                }
            }
        }
        
        var diff = $("#listModal").children().length;
        
        if(diff > 0){
            $("#modalHeader").html(`Resultados --> ${diff} diferencia(s)`);
        }else{
            $("#modalHeader").html("No se encontraron diferencias");
        }
        $("#modalResultados").modal("show");
        
    });
});