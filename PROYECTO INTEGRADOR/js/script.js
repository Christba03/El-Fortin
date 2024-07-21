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
                           <a href="" class="link-primary"><i class="fa-solid fa-pen-to-square fs-5 me-3"></i></a>
                           <a href="" class="link-danger"><i class="fa-solid fa-trash fs-5 me-3"></i></a>
                           <a href="" class="link-success"><i class="fa-solid fa-eye fs-5"></i></a>
                        </td>
                    </tr>
                `);
    });
  }

  function alert(){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
  }


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
    $("#modalUsuarios").modal("hide");
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

   // Inicializar la tabla de usuarios

   loadEmployes();
});