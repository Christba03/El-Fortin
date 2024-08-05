document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('#nav-links .nav-link');
  
    // Obtener la URL actual y extraer el nombre del archivo
    const currentUrl = window.location.pathname.split('/').pop();
  
    // Iterar sobre los enlaces y añadir la clase 'active' al enlace que coincide con la URL actual
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentUrl) {
        link.classList.add('active');
      }
    });
  });
  
  
  function searchTable() {
    // Obtener el valor del input de búsqueda
    let input = document.getElementById("buscar").value.toLowerCase();
    // Obtener todas las filas de la tabla
    let rows = document.querySelectorAll("#contenidoTabla table tbody tr");
  
    // Iterar sobre cada fila y mostrar/ocultar según el criterio de búsqueda
    rows.forEach(row => {
      let match = false;
      // Obtener las celdas de la fila actual
      let cells = row.getElementsByTagName("td");
      // Iterar sobre las celdas y verificar si alguna coincide con la búsqueda
      Array.from(cells).forEach(cell => {
        let cellText = cell.textContent.toLowerCase();
        if (cellText.includes(input)) {
          match = true;
        }
      });
      // Mostrar u ocultar la fila según el resultado de la búsqueda
      if (match) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
  
  $(document).ready(function(){
  
    //primero vamos a crear un arreglo con los datos de los usuarios que se van a mostrar de ejemplo
    let arreglo = [
      {
        id: 1,
        nombre: "baguette de salami",
        tiempo: "20 minutos",
        descripcion: "1 pieza de pan de baguette. 100 gr. de salami. 150 gr. de queso manchego, rebanado. 1 cucharada de mayonesa ½ pieza de tomate. ¼ pieza de cebolla morada. 3 hojas de lechuga sangría. ½ pieza de aguacate. ¼ pieza de pepino. ¼ taza de arúgula. 1.- Vamos a comenzar lavando y desinfectando las verduras, el tomate, la cebolla morada, lechuga y pepino. Rebanamos el tomate, el pepino y la cebolla. 2.- Rebanamos el pan por la mitad y untamos un poco de mayonesa por ambos lados, colocamos una cama de lechuga y arúgula, después agregamos las rebanadas de queso manchego. 3.- Luego ponemos las demás verduras en rebanadas, por último, colocamos las rebanadas de salami y cerramos. 4.- Servimos y disfrutamos.",
      },
      {
        id: 2,
        nombre: "Baguette Tradicional",
        tiempo: "60 minutos",
        descripcion: "1. Amasar todos los ingredientes hasta conseguir una masa fina y extensible. Temperatura final de amasado 23-25ºC. 2. Dividir piezas de 270 g. 3. Reposo en bola de 10-15 min. 4. Fermentar 2 horas a 26-28ºC (75% humedad).5. Cocer con vapor durante 25 minutos a 200ºC",
      },
    ];
  
    //se creara una funcion para cargar los usuarios que esten en la tabla.
    function loadEmployes() {
      let recetas = arreglo;
      let recetaTableBody = $("#employe-table-body");
      recetaTableBody.empty();
      recetas.forEach((receta) => {
        recetaTableBody.append(`
                      <tr>
                          <td>${receta.id}</td>
                          <td>${receta.nombre}</td>
                          <td>${receta.tiempo}</td>
                          <td>${receta.descripcion}</td>
                          <td>
                             <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${receta.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                             <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${receta.id}"><i class="fa-solid fa-trash fs-6"></i></button>
                          </td>
                      </tr>
                  `);
      });
    }
  
    function alert(){
      Swal.fire({
        icon: "success",
        title: "Guardado",
      });
    }
  
  
    //funcion para agregar los usuarios
    $("#formClientes").submit(function (event){
      event.preventDefault();
      let userId = $("#cliente-id").val();
      let clienteName = $("#nombre").val();
      let apellidoPaterno = $("#paterno").val();
      let apellidoMaterno = $("#materno").val();
      let correo = $("#email").val();
      let contrasena = $("#contrasena").val();
      let method = userId ? "PUT" : "POST";
  
      if(method == "POST"){
        let newId = arreglo[arreglo.length - 1].id ;
        arreglo.push({
          id: newId,
          nombre: clienteName,
          apellidoPaterno: apellidoPaterno,
          apellidoMaterno: apellidoMaterno,
          correo: correo,
          contrasena: contrasena,
        });
      }else {
        let objeto = searchObject(userId);
  
        objeto.nombre = clienteName;
        objeto.apellidoPaterno= apellidoPaterno;
        objeto.apellidoMaterno= apellidoMaterno;
        objeto.correo = correo;
        objeto.contrasena= contrasena;
      }
      loadEmployes();
      alert();
      $("#modalClientes").modal("hide");
    });
  
    function searchObject(id) {
      let objeto = {};
      for (let i = 0; i < arreglo.length; i++) {
        if (id == arreglo[i].id) {
          objeto = arreglo[i];
          break;
        }
      }
      return objeto;
    }
  
  
     // Editar usuario
     $(document).on("click", ".edit-user-btn", function () {
      let userId = $(this).data("id");
      let objeto = searchObject(userId);
  
      let employe = objeto;
      $("#cliente-id").val(employe.id);
      $("#nombre").val(employe.nombre);
      $("#paterno").val(employe.apellidoPaterno);
      $("#materno").val(employe.apellidoPaterno);
      $("#email").val(employe.correo);
      $("#contrasena").val(employe.contrasena);
      $("#modalClientesLabel").text("Editar Cliente");
      $("#modalClientes").modal("show");
    });
  
  
    // Eliminar usuario
      // Eliminar usuario
      $(document).on("click", ".delete-user-btn", function () {
        let clienteId = $(this).data("id");
        let indice = -1;
        for (let i = 0; i < arreglo.length; i++) {
          if (clienteId == arreglo[i].id) {
            indice = i;
            break;
          }
        }
    
        if (indice !== -1) {
          Swal.fire({
            title: "Estas seguro?",
            text: "No podras revertir este cambio!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#09A62E",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, bórralo!"
          }).then((result) => {
            if (result.isConfirmed) {
              arreglo.splice(indice, 1);
              loadEmployes();
              Swal.fire({
                title: "Borrado!",
                text: "Tu registro fue borrado.",
                icon: "success"
              });
            }else if(result.dismiss === Swal.DismissReason.cancel){
              Swal.fire({
                title: "Cancelado",
                text:  "Tu registro se salvó :)",
                icon: "error"
              })
            }
          });
        }
      });
  
      // Resetear modal al cerrarlo
      $("#modalClientes").on("hidden.bs.modal", function () {
        $("#formClientes")[0].reset();
        $("#cliente-id").val("");
        $("#modalClientesLabel").text("Agregar Cliente");
      });
    
  
     // Inicializar la tabla de usuarios
  
     loadEmployes();
  });