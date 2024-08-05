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
    let empleados = arreglo;
    let empleadoTableBody = $("#employe-table-body");
    empleadoTableBody.empty();
    empleados.forEach((empleado) => {
      empleadoTableBody.append(`
                    <tr>
                        <td>${empleado.id}</td>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellidoPaterno}</td>
                        <td>${empleado.apellidoMaterno}</td>
                        <td>${empleado.correo}</td>
                        <td>${empleado.contrasena}</td>
                        <td>
                           <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${empleado.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                           <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${empleado.id}"><i class="fa-solid fa-trash fs-6"></i></button>
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
  $("#formEmpleados").submit(function (event){
    event.preventDefault();
    let userId = $("#empleado-id").val();
    let empleadoName = $("#nombreEmpleado").val().split(" ");
    let apellidoPaterno = $("#apPaterno").val();
    let apellidoMaterno = $("#apMaterno").val();
    let correo = $("#correo").val();
    let contrasena = $("#contrasena").val();
    let method = userId ? "PUT" : "POST";

    if(method == "POST"){
      let newId = arreglo[arreglo.length - 1].id + 1;
      arreglo.push({
        id: newId,
        nombre: empleadoName,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        correo: correo,
        contrasena: contrasena,
      });
    }else {
      let objeto = searchObject(userId);

      objeto.nombre = empleadoName;
      objeto.apellidoPaterno= apellidoPaterno;
      objeto.apellidoMaterno= apellidoMaterno;
      objeto.correo = correo;
      objeto.contrasena= contrasena;
    }
    loadEmployes();
    alert();
    $("#modalEmpleados").modal("hide");
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
    $("#empleado-id").val(employe.id);
    $("#nombreEmpleado").val(employe.nombre);
    $("#apPaterno").val(employe.apellidoPaterno);
    $("#apMaterno").val(employe.apellidoPaterno);
    $("#correo").val(employe.correo);
    $("#contrasena").val(employe.contrasena);
    $("#modalEmpleadosLabel").text("Editar Empleado");
    $("#modalEmpleados").modal("show");
  });


  // Eliminar usuario
    // Eliminar usuario
    $(document).on("click", ".delete-user-btn", function () {
      let empleadoId = $(this).data("id");
      let indice = -1;
      for (let i = 0; i < arreglo.length; i++) {
        if (empleadoId == arreglo[i].id) {
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
              text: "Tu registro se salvó :)",
              icon: "error"
            })
          }
        });
      }
    });

    // Resetear modal al cerrarlo
    $("#modalEmpleados").on("hidden.bs.modal", function () {
      $("#formEmpleados")[0].reset();
      $("#empleado-id").val("");
      $("#modalEmpleadosLabel").text("Agregar Empleado");
    });
  

   // Inicializar la tabla de usuarios

   loadEmployes();
});