$(document).ready(function () {
  const apiUrl = 'https://fortin.christba.com/api/usuarios'; // URL base de la API de usuarios

  // Función para cargar empleados desde la API
  function loadEmployees() {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        const employees = response.filter(user => user.user_type?.trim().toLowerCase() === 'worker'); // Filtrar empleados con rol "worker"
        populateEmployeesTable(employees);
        
      },
      error: function (error) {
        console.error('Error al cargar los empleados:', error);
        showAlert('Error al cargar los empleados', 'danger');
      }
    });
  }

  // Función para llenar la tabla con los empleados
  function populateEmployeesTable(employees) {
    const employeeTableBody = $('#employe-table-body');
    employeeTableBody.empty();

    employees.forEach(employee => {
      // Validación y separación del nombre completo
      let name = employee.name ? employee.name.trim() : "Sin nombre";
      let firstName = "Sin nombre";
      let lastNamePaterno = "Sin apellido paterno";
      let lastNameMaterno = "Sin apellido materno";

      if (name !== "Sin nombre") {
        const nameParts = name.split(" ").filter(part => part); // Dividir y eliminar espacios vacíos
        const partsCount = nameParts.length;

        if (partsCount === 3) {
          // Caso de 3 palabras
          firstName = nameParts[0]; // Primer nombre
          lastNamePaterno = nameParts[1]; // Primer apellido
          lastNameMaterno = nameParts[2]; // Segundo apellido
        } else if (partsCount === 4) {
          // Caso de 4 palabras
          firstName = `${nameParts[0]} ${nameParts[1]}`; // Dos primeras palabras como nombre
          lastNamePaterno = nameParts[2]; // Primer apellido
          lastNameMaterno = nameParts[3]; // Segundo apellido
        } else if (partsCount > 4) {
          // Caso de más de 4 palabras
          firstName = `${nameParts[0]} ${nameParts[1]}`; // Dos primeras palabras como nombre
          lastNamePaterno = nameParts[2]; // Primer apellido
          lastNameMaterno = nameParts.slice(3).join(" "); // Restantes como segundo apellido
        } else if (partsCount === 2) {
          // Caso de 2 palabras
          firstName = nameParts[0]; // Primer nombre
          lastNamePaterno = nameParts[1]; // Primer apellido
        } else {
          // Caso de una sola palabra
          firstName = nameParts[0]; // Solo nombre
        }
      }

      // Capitalizar cada palabra
      const capitalize = (str) =>
        str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      firstName = capitalize(firstName);
      lastNamePaterno = capitalize(lastNamePaterno);
      lastNameMaterno = capitalize(lastNameMaterno);

      // Renderizar la fila de la tabla
      employeeTableBody.append(`
          <tr>
              <td>${employee.id}</td>
              <td>${firstName}</td>
              <td>${lastNamePaterno}</td>
              <td>${lastNameMaterno}</td>
              <td>${employee.email || "Correo no disponible"}</td>
              <td>
                  <button class="btn btn-sm text-bg-secondary edit-employee-btn" data-id="${employee.id}">
                      <i class="fa-solid fa-pen-to-square fs-6"></i>
                  </button>
                  <button class="btn btn-sm text-bg-primary delete-employee-btn" data-id="${employee.id}">
                      <i class="fa-solid fa-trash fs-6"></i>
                  </button>
              </td>
          </tr>
      `);
    });
  }

  // Función para mostrar alertas
  function showAlert(message, type) {
    $('#alert-container').html(`
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);
    setTimeout(() => {
      $('#alert-container').html('');
    }, 3000);
  }

  // Función para guardar o actualizar un empleado
  function saveEmployee(employeeData, employeeId = null) {
    const method = employeeId ? 'PUT' : 'POST';
    const url = employeeId ? `${apiUrl}/${employeeId}` : apiUrl;

    const payload = {
      name: employeeData.name || "",
      email: employeeData.email || "",
      phone: employeeData.phone || "",
      image_url: employeeData.image_url || "",
      user_type: 'worker', // Asegurar que el tipo sea 'worker'
      nickname: employeeData.nickname || "",
      password: employeeData.encrypted_password || "",
    };


    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function (response) {
        loadEmployees(); // Recargar la lista de empleados
        showAlert('Empleado guardado exitosamente', 'success');
        $('#modalEmpleados').modal('hide'); // Cerrar el modal
      },
      error: function (error) {
        console.error('Error al guardar el empleado:', error);
        showAlert('Error al guardar el empleado', 'danger');
      }

    });
console.log("Metodo: " + employeeId ? 'PUT' : 'POST');
    console.log("payload: " + payload);
  }

  // Función para eliminar un empleado
  function deleteEmployee(employeeId) {
    $.ajax({
      url: `${apiUrl}/${employeeId}`,
      method: 'DELETE',
      success: function () {
        loadEmployees(); // Recargar la lista de empleados
        showAlert('Empleado eliminado exitosamente', 'success');
      },
      error: function (error) {
        console.error('Error al eliminar el empleado:', error);
        showAlert('Error al eliminar el empleado', 'danger');
      }
    });
  }

  // Manejo del formulario para guardar o actualizar empleado
  $('#formEmpleados').submit(function (event) {
    event.preventDefault();

    const employeeId = $('#empleado-id').val();
    const employeeData = {
      name: $('#nombreEmpleado').val(),
      nickname: $('#userName').val(),
      email: $('#correo').val(),
      phone: $('#telefono').val(),
      encrypted_password: $('#contrasena').val(),
    };
    saveEmployee(employeeData, employeeId);
  });

  // Evento al hacer clic en editar empleado
  $(document).on('click', '.edit-employee-btn', function () {
    const employeeId = $(this).data('id');

    $.ajax({
      url: `${apiUrl}/${employeeId}`,
      method: 'GET',
      success: function (employee) {
        $('#empleado-id').val(employee.id);
        $('#nombreEmpleado').val(employee.name);
        $('#userName').val(employee.nickname);
        $('#correo').val(employee.email);
        $('#telefono').val(employee.phone);
        $('#contrasena').val(employee.encrypted_password);
        $('#modalEmpleadosLabel').text('Editar Empleado');
        $('#modalEmpleados').modal('show');
      },
      error: function (error) {
        console.error('Error al obtener los detalles del empleado:', error);
        showAlert('Error al obtener los detalles del empleado', 'danger');
      }
    });
  });

  // Evento al hacer clic en eliminar empleado
  $(document).on('click', '.delete-employee-btn', function () {
    const employeeId = $(this).data('id');

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#09A62E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(employeeId);
      }
    });
  });

  // Resetear modal al cerrarlo
  $('#modalEmpleados').on('hidden.bs.modal', function () {
    $('#formEmpleados')[0].reset();
    $('#empleado-id').val('');
    $('#modalEmpleadosLabel').text('Agregar Empleado');
  });

  // Inicializar la carga de empleados
  loadEmployees();
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