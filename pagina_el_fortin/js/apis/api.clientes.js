$(document).ready(function () {
  const apiUrl = 'https://fortin.christba.com/api/usuarios'; // URL base de la API de clientes

  // Función para cargar clientes desde la API
  function loadClients() {
    $.ajax({
      url: apiUrl,
      method: 'GET',
      success: function (response) {
        const clients = response.filter(user => user.user_type?.trim().toLowerCase() === 'client'); // Filtrar clientes con rol "client"
        populateClientsTable(clients);
      },
      error: function (error) {
        console.error('Error al cargar los clientes:', error);
        showAlert('Error al cargar los clientes', 'danger');
      }
    });
  }

  // Función para llenar la tabla con los clientes
  function populateClientsTable(clients) {
    const clientTableBody = $('#client-table-body');
    clientTableBody.empty();

    clients.forEach(client => {
      // Validación y separación del nombre completo
      let name = client.name ? client.name.trim() : "Sin nombre";
      let firstName = "Sin nombre";
      let lastNamePaterno = "Sin apellido paterno";
      let lastNameMaterno = "Sin apellido materno";

      if (name !== "Sin nombre") {
        const nameParts = name.split(" ").filter(part => part); // Dividir y eliminar espacios vacíos
        const partsCount = nameParts.length;

        if (partsCount === 3) {
          firstName = nameParts[0];
          lastNamePaterno = nameParts[1];
          lastNameMaterno = nameParts[2];
        } else if (partsCount === 4) {
          firstName = `${nameParts[0]} ${nameParts[1]}`;
          lastNamePaterno = nameParts[2];
          lastNameMaterno = nameParts[3];
        } else if (partsCount > 4) {
          firstName = `${nameParts[0]} ${nameParts[1]}`;
          lastNamePaterno = nameParts[2];
          lastNameMaterno = nameParts.slice(3).join(" ");
        } else if (partsCount === 2) {
          firstName = nameParts[0];
          lastNamePaterno = nameParts[1];
        } else {
          firstName = nameParts[0];
        }
      }

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
      clientTableBody.append(`
          <tr>
              <td>${client.id}</td>
              <td>${firstName}</td>
              <td>${lastNamePaterno}</td>
              <td>${lastNameMaterno}</td>
              <td>${client.phone || "Correo no disponible"}</td>
              <td>
                  <button class="btn btn-sm text-bg-secondary edit-client-btn" data-id="${client.id}">
                      <i class="fa-solid fa-pen-to-square fs-6"></i>
                  </button>
                  <button class="btn btn-sm text-bg-primary delete-client-btn" data-id="${client.id}">
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

  // Función para guardar o actualizar un cliente
  function saveClient(clientData, clientId = null) {
    const method = clientId ? 'PUT' : 'POST';
    const url = clientId ? `${apiUrl}/${clientId}` : apiUrl;

    const payload = {
      name: clientData.name || "",
      email: clientData.email || "",
      phone: clientData.phone || "",
      image_url: clientData.image_url || "",
      user_type: 'client', // Asegurar que el tipo sea 'client'
      nickname: clientData.nickname || "",
      password: clientData.encrypted_password || "",
    };

    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function () {
        loadClients(); // Recargar la lista de clientes
        showAlert('Cliente guardado exitosamente', 'success');
        $('#modalClientes').modal('hide');
      },
      error: function (error) {
        console.error('Error al guardar el cliente:', error);
        showAlert('Error al guardar el cliente', 'danger');
      }
    });
  }

  // Función para eliminar un cliente
  function deleteClient(clientId) {
    $.ajax({
      url: `${apiUrl}/${clientId}`,
      method: 'DELETE',
      success: function () {
        loadClients(); // Recargar la lista de clientes
        showAlert('Cliente eliminado exitosamente', 'success');
      },
      error: function (error) {
        console.error('Error al eliminar el cliente:', error);
        showAlert('Error al eliminar el cliente', 'danger');
      }
    });
  }

  // Manejo del formulario para guardar o actualizar cliente
  $('#formClientes').submit(function (event) {
    event.preventDefault();

    const clientId = $('#cliente-id').val();
    const clientData = {
      name: $('#nombre').val(),
      nickname: $('#userName').val(),
      email: $('#email').val(),
      phone: $('#telefono').val(),
      password: $('#contrasena').val(),
    };
    saveClient(clientData, clientId);
  });

  // Evento al hacer clic en editar cliente
  $(document).on('click', '.edit-client-btn', function () {
    const clientId = $(this).data('id');

    $.ajax({
      url: `${apiUrl}/${clientId}`,
      method: 'GET',
      success: function (client) {
        $('#cliente-id').val(client.id);
        console.log("Nombre cliente: " + client.name);
        $('#nombre').val(client.name);
        $('#userName').val(client.nickname);
        $('#telefono').val(client.phone);

        $('#email').val(client.email);
        console.log("correo: " + client.email);

        $('#contrasena').val(client.encrypted_password);
        console.log("contraseña: " + client.encrypted_password);
        
        $('#modalClientesLabel').text('Editar Cliente');
        $('#modalClientes').modal('show');
      },
      error: function (error) {
        console.error('Error al obtener los detalles del cliente:', error);
        showAlert('Error al obtener los detalles del cliente', 'danger');
      }
    });
  
  }
);

  // Evento al hacer clic en eliminar cliente
  $(document).on('click', '.delete-client-btn', function () {
    const clientId = $(this).data('id');

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
        deleteClient(clientId);
      }
    });
  });

  // Resetear modal al cerrarlo
  $('#modalClientes').on('hidden.bs.modal', function () {
    $('#formClientes')[0].reset();
    $('#cliente-id').val('');
    $('#modalClientesLabel').text('Agregar Cliente');
  });

  // Inicializar la carga de clientes
  loadClients();
});
