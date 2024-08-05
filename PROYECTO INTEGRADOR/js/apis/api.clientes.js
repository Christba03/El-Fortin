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
        nombre: "Jose",
        apellidoPaterno: "Perez",
        apellidoMaterno: "Gomez",
        correo: "jose@gmail.com",
        contrasena: "jose122",
      },
      {
        id: 2,
        nombre: "Angel",
        apellidoPaterno: "Rivera",
        apellidoMaterno: "Sanchez",
        correo: "rivera@gmail.com",
        contrasena: "rivera23",
      },
    ];
  
    //se creara una funcion para cargar los usuarios que esten en la tabla.
    function loadEmployes() {
      let clientes = arreglo;
      let clienteTableBody = $("#employe-table-body");
      clienteTableBody.empty();
      clientes.forEach((cliente) => {
        clienteTableBody.append(`
                      <tr>
                          <td>${cliente.id}</td>
                          <td>${cliente.nombre}</td>
                          <td>${cliente.apellidoPaterno}</td>
                          <td>${cliente.apellidoMaterno}</td>
                          <td>${cliente.correo}</td>
                          <td>${cliente.contrasena}</td>
                          <td>
                             <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${cliente.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                             <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${cliente.id}"><i class="fa-solid fa-trash fs-6"></i></button>
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