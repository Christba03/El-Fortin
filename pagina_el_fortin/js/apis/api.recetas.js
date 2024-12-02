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
    const apiUrl = 'https://fortin.christba.com/api/recipes'; // URL base de la API de clientes

    const pageSize = 9; // Número de clientes por página
    let currentPage = 1; // Página actual
    let recipes = []; // Lista de clientes
    //primero vamos a crear un arreglo con los datos de los usuarios que se van a mostrar de ejemplo
    let arreglo = [
      {
        id: 1,
        nombre: "Empanada",
        empleado: "Jose Angel Lopez Rivera",
        tiempo: "15 minutos",
        descripcion: "(1 pieza de pan de baguette 100 gr. de salami. 150 gr. de queso manchego, rebanado. 1 cucharada de mayonesa ½ pieza de tomate. ¼ pieza de cebolla morada. 3 hojas de lechuga sangría. ½ pieza de aguacate. ¼ pieza de pepino. ¼ taza de arúgula. 1.- Vamos a comenzar lavando y desinfectando las verduras, el tomate, la cebolla morada, lechuga y pepino. Rebanamos el tomate, el pepino y la cebolla. 2.- Rebanamos el pan por la mitad y untamos un poco de mayonesa por ambos lados, colocamos una cama de lechuga y arúgula, después agregamos las rebanadas de queso manchego.  3.- Luego ponemos las demás verduras en rebanadas, por último, colocamos las rebanadas de salami y cerramos. 4.- Servimos y disfrutamos."
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
                          <td>${receta.empleado}</td>
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
      // Función para configurar la paginación
  function setupPagination() {
    const pageCount = Math.ceil(clients.length / pageSize);
    const paginationContainer = $('#pagination-container');
    paginationContainer.empty();

    // Update page info
    $('#page-info').text(`Página ${currentPage}`);

    // Disable/enable buttons based on current page
    if (currentPage <= 1) {
      $('#prev-btn').prop('disabled', true);
    } else {
      $('#prev-btn').prop('disabled', false);
    }

    if (currentPage >= pageCount) {
      $('#next-btn').prop('disabled', true);
    } else {
      $('#next-btn').prop('disabled', false);
    }
  }

  // Handle "Previous" button click
  $('#prev-btn').click(function () {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
      setupPagination();
    }
  });

  // Handle "Next" button click
  $('#next-btn').click(function () {
    const pageCount = Math.ceil(clients.length / pageSize);
    if (currentPage < pageCount) {
      currentPage++;
      showPage(currentPage);
      setupPagination();
    }
  });
    function alert(){
      Swal.fire({
        icon: "success",
        title: "Guardado",
      });
    }
  
  
    //funcion para agregar los usuarios
    $("#formRecetas").submit(function (event){
      event.preventDefault();
      let userId = $("#receta-id").val();
      let nombre = $("#nombre").val();
      let tiempo = $("#tiempo").val();
      let descripcion = $("#descripcion").val();
      let empleado = $("#empleado").val();
      let method = userId ? "PUT" : "POST";
  
      if(method == "POST"){
        let newId = arreglo[arreglo.length - 1].id + 1;
        arreglo.push({
          id: newId,
          nombre: nombre,
          tiempo: tiempo,
          descripcion: descripcion,
          empleado : empleado,
        });
      }else {
        let objeto = searchObject(userId);
        objeto.nombre = nombre;
        objeto.tiempo = tiempo;
        objeto.descripcion = descripcion;
        objeto.empleado = empleado;
      }
      loadEmployes();
      alert();
      $("#modalRecetas").modal("hide");
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
      $("#receta-id").val(employe.id);
      $("#nombre").val(employe.nombre);
      $("#tiempo").val(employe.tiempo);
      $("#descripcion").val(employe.descripcion);
      $("#empleado").val(employe.empleado);
      $("#modalRecetasLabel").text("Editar Receta");
      $("#modalRecetas").modal("show");
    });
  
  
    // Eliminar usuario
      // Eliminar usuario
      $(document).on("click", ".delete-user-btn", function () {
        let recetaId = $(this).data("id");
        let indice = -1;
        for (let i = 0; i < arreglo.length; i++) {
          if (recetaId == arreglo[i].id) {
            indice = i;
            break;
          }
        }
    
        if (indice !== -1) {
          Swal.fire({
            title: "Estas seguro?",
            text: "No podras revertir el cambio!",
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
                text: "Tu registro fue eliminado.",
                icon: "success"
              });
            }else if(result.dismiss === Swal.DismissReason.cancel){
              Swal.fire({
                title: "Cancelado",
                text: "Tu registro no fue alterado.",
                icon: "error"
              })
            }
          });
        }
      });
  
      // Resetear modal al cerrarlo
      $("#modalRecetas").on("hidden.bs.modal", function () {
        $("#formRecetas")[0].reset();
        $("#receta-id").val("");
        $("#modalRecetasLabel").text("Agregar Receta");
      });
    
  
     // Inicializar la tabla de usuarios
  
     loadEmployes();
  });