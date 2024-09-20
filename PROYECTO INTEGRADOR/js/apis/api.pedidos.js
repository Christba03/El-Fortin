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
        cliente: "Angel Geovany Alvarez Ordinola",
        empleado: "Jose Manuel Lara Villalobos",
        estado: "Pendiente",
        mesa: "03",
        detalle: "1"
      },

    ];
  
    //se creara una funcion para cargar los usuarios que esten en la tabla.
    function loadEmployes() {
      let ventas = arreglo;
      let ventaTableBody = $("#employe-table-body");
      ventaTableBody.empty();
      ventas.forEach((venta) => {
        ventaTableBody.append(`
                      <tr>
                          <td>${venta.id}</td>
                          <td>${venta.cliente}</td>
                          <td>${venta.estado}</td>
                          <td>${venta.mesa}</td>
                          <td>${venta.detalle}</td>

                          <td>
                             <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${venta.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                             <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${venta.id}"><i class="fa-solid fa-trash fs-6"></i></button>
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
    $("#formVentas").submit(function (event){
      event.preventDefault();
      let userId = $("#venta-id").val();
      let cliente = $("#cliente").val();
      let estado = $("#estado").val();
      let mesa = $("#mesa").val();
      let detalle = $("#detalle").val();
      let method = userId ? "PUT" : "POST";
  
      if(method == "POST"){
        let newId = arreglo[arreglo.length - 1].id + 1;
        arreglo.push({
          id: newId,
          cliente: cliente,
          estado: estado,
          mesa: mesa,
          detalle: detalle
        });
      }else {
        let objeto = searchObject(userId);
  
        objeto.cliente = cliente;
        objeto.estado= estado;
        objeto.mesa = mesa;
        objeto.detalle = detalle;
      }
      loadEmployes();
      alert();
      $("#modalVentas").modal("hide");
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
      $("#venta-id").val(employe.id);
      $("#cliente").val(employe.cliente);
      $("#estado").val(employe.estado);
      $("#mesa").val(employe.mesa);
      $("#detalle").val(employe.detalle);
      $("#modalVentasLabel").text("Editar Venta");
      $("#modalVentas").modal("show");
    });
  
  
    // Eliminar usuario
      // Eliminar usuario
      $(document).on("click", ".delete-user-btn", function () {
        let ventaId = $(this).data("id");
        let indice = -1;
        for (let i = 0; i < arreglo.length; i++) {
          if (ventaId == arreglo[i].id) {
            indice = i;
            break;
          }
        }
    
        if (indice !== -1) {
          Swal.fire({
            title: "¿Estas seguro?",
            text: "No podras revertir el cambio!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#09A62E",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, bórralo!"
          }).then((result) => {
            if (result.isConfirmed) {
              arreglo.splice(indice, 1);
              loadEmployes();
              Swal.fire({
                title: "¡Borrado!",
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
      $("#modalVentas").on("hidden.bs.modal", function () {
        $("#formVentas")[0].reset();
        $("#venta-id").val("");
        $("#modalVentasLabel").text("Agregar Venta");
      });
    
  
     // Inicializar la tabla de usuarios
  
     loadEmployes();
  });