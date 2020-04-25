Array.prototype.unique=function(a){
    return function(){
        return this.filter(a)
    }
  }
  (function(a,b,c){
      return c.indexOf(a,b+1)<0
  });
  
  $(document).ready(function(){
      $(".alert").hide();
      jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
      };
      
      //crear filas de la tabla
      var datos = data.users;
      var filas = "";
      
      for(var i = 0; i < datos.length; i++){
          filas += "<tr>";
          filas += `<td><a href='' class='user-column text-secondary'>${datos[i].name}</a></td>`;
          filas += `<td><a href='' class='pass-column text-secondary'>${datos[i].pass}</a></td>`;
          filas += `<td><a href='' class='pais-column text-secondary'>${datos[i].country}</a></td>`;
          filas += `<td><a href='' class='system-column text-secondary'>${datos[i].system}</a></td>`;
          filas += `<td><a href='' class='description-column text-secondary'>${datos[i].description}</a></td>`;
          filas += `<td><a href='' class='comments-column text-secondary'>${datos[i].comments}</a></td>`;
          filas += "</tr>";
      }
      $("#tablaDatos tbody").html(filas);
      
      //busqueda de texto
      $("#inputBusqueda").keyup(function(){
          var texto = $(this).val();
          if(texto.length > 0)
              busquedaTexto(texto);
          else
              $("#tablaDatos tbody tr").show();
      });
      
      //copiar a portapapeles
      $("#tablaDatos tbody td a").click(function(ev){
          ev.preventDefault();
          var text = $(this).text();
          if(text.length >0 ){
              var tempInput =  $("<textarea>");
              $("body").append(tempInput);
              tempInput.val(text).select();
              document.execCommand("copy");
              tempInput.remove();
              animarElemento("#copyAlert", 2500);
          }
      });
      
      //filtros
      $(".filter-button").click(function(){
          var arr = [];
          var items = "";
          var clase = $(this).data("filter");
          var idlistado = "#" + $(this).next().attr("id");
          $(`.${clase}:visible`).each(function(){
              if($(this).text().length > 0){
                  arr.push($(this).text());
              }
          });
          var unique = arr.unique();
          for(var i = 0; i < unique.length; i++)
              items += "<a href='#' class='dropdown-item filter-item'>" + unique[i] + "</a>";
          items += '<div class="dropdown-divider"></div><a class="dropdown-item text-danger borrar-filtro" href="#">Borrar Filtros</a>';
          $(idlistado).html(items);
          busquedaDrop();
      });
      
  });
  
  function animarElemento(elemento, delay){
      $(elemento).slideDown();
      setTimeout(function(){
          $(elemento).slideUp();
      }, delay);
  }
  
  function busquedaTexto(texto){
      if(texto.length > 0){
          $("#tablaDatos tbody tr").hide();
          $("#tablaDatos tbody td a:Contains('" + texto + "')").closest('tr').show();
      }else{
          $("#tablaDatos tbody tr").show();
      }
  }
  
  function busquedaDrop(){
      $("#inputBusqueda").val("");
      $(".filter-item").click(function(e){
          e.preventDefault();
          busquedaTexto($(this).text());
      });
      borrarFiltro();
  }
  
  function borrarFiltro(){
      $(".borrar-filtro").click(function(e){
          e.preventDefault();
          $("#tablaDatos tbody tr").show();
      });
  }