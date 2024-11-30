
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
$(document).ready(function () {
  const apiUrl = 'https://fortin.christba.com/api/usuarios'; // URL base de la API de usuarios

  // Función para cargar los usuarios desde la API
  function loadUsers() {
      $.ajax({
          url: apiUrl,
          method: 'GET',
          success: function (response) {
             

              const users = response;
              populateUsersTable(users); // Llenar la tabla con los usuarios
          },
          error: function (error) {
              console.error("Error al cargar los usuarios:", error);
              showAlert("Error al cargar los usuarios", "danger");
          }
      });
  }



  // Función para llenar la tabla con los usuarios
  function populateUsersTable(users) {
      const usersTableBody = $('#users-table-body');
      usersTableBody.empty();

      users.forEach(user => {
        let userType = "";
        if (user.user_type == "worker"){
          userType = "Trabajador";
        }else userType = "Cliente";
          const formattedDate = new Date(user.created_at).toLocaleDateString();
          usersTableBody.append(`
              <tr>
                  <td>${user.id}</td>
                  <td>${user.nickname}</td>
                  <td>${user.email}</td>
                  <td>${userType}</td>
                  <td>${user.phone}</td>
                  <td>
                      <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${user.id}">
                          <i class="fa-solid fa-pen-to-square fs-6"></i>
                      </button>
                      <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${user.id}">
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

 // Función para guardar o actualizar un usuario
 function saveUser(userData, userId = null) {
    const method = userId ? 'PUT' : 'POST';
    const url = userId ? `${apiUrl}/${userId}` : apiUrl;
  
    // Asegurarse de que los datos enviados coincidan con la estructura requerida
    const payload = {
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      image_url: userData.image_url || "",
      user_type: userData.user_type || "worker", 
      nickname: userData.nickname || "",
      password: userData.password || ""
    };
  

    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      data: JSON.stringify(payload), // Enviar el objeto con la estructura adecuada
      success: function (response) {
        loadUsers(); // Recargar usuarios después de guardar
        showAlert('Usuario guardado exitosamente', 'success');
        $('#modalUsuarios').modal('hide'); // Cerrar el modal
      },
      error: function (error) {
        console.error("Error al guardar el usuario:", error);
        showAlert('Error al guardar el usuario', 'danger');
      }
    });
    
    console.log("Método HTTP:", userId ? 'PUT' : 'POST');
console.log("Payload enviado:", payload);

    
    if (!userData.name || !userData.email || !userData.phone || !userData.password) {
        console.error("Faltan datos obligatorios");
        return;
    }
    
  }
  


  // Función para eliminar un usuario
  function deleteUser(userId) {
      $.ajax({
          url: `${apiUrl}/${userId}`,
          method: 'DELETE',
          success: function () {
              loadUsers();
              showAlert('Usuario eliminado exitosamente', 'success');
          },
          error: function (error) {
              console.error("Error al eliminar el usuario:", error);
              showAlert('Error al eliminar el usuario', 'danger');
          }
      });
  }

 
// Evento del formulario para guardar o actualizar el usuario
$('#formUsuarios').submit(function (event) {
  event.preventDefault();

  // Captura el ID del usuario (si existe) y los datos del formulario
  const userId = $('#usuario-id').val();

  const userData = {
      name: $('#nombreUsuario').val(),
      email: $('#correo').val(),
      phone: $('#telefono').val(),
      user_type: $('#rol').val(),
      nickname: $('#nickname').val(), // Nuevo campo para el nickname
      password: $('#contrasena').val() // Campo para la contraseña cifrada
  };

  // Llamada a la función saveUser para guardar o actualizar el usuario
  saveUser(userData, userId);

});
// Evento al hacer clic en el botón de editar usuario
$(document).on('click', '.edit-user-btn', function () {
    const userId = $(this).data('id');

    $.ajax({
        url: `${apiUrl}/${userId}`,
        method: 'GET',
        success: function (user) {
            $('#usuario-id').val(user.id);
            $('#nombreUsuario').val(user.name);
            $('#correo').val(user.email);
            $('#telefono').val(user.phone);
            $('#nickname').val(user.nickname);
            $('#contrasena').val(user.password);

            // Ajustar el valor del select con la traducción
            const userType = user.user_type; // "worker" o "client"
            $('#tipoUsuario').val(userType);

            $('#modalUsuariosLabel').text('Editar Usuario');
            $('#modalUsuarios').modal('show');
        },
        error: function (error) {
            console.error("Error al obtener los detalles del usuario:", error);
            showAlert('Error al obtener los detalles del usuario', 'danger');
        }
    });
});

  // Evento al hacer clic en el botón de eliminar usuario
  $(document).on('click', '.delete-user-btn', function () {
      const userId = $(this).data('id');

      Swal.fire({
          title: "¿Estás seguro?",
          text: "No podrás revertir esto",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#09A62E",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, bórralo"
      }).then((result) => {
          if (result.isConfirmed) {
              deleteUser(userId);
          }
      });
  });

  // Resetear modal al cerrarlo
  $('#modalUsuarios').on('hidden.bs.modal', function () {
      $('#formUsuarios')[0].reset();
      $('#usuario-id').val('');
      $('#modalUsuariosLabel').text('Agregar Usuario');
  });

  // Inicializar la carga de usuarios
  loadUsers();
});
