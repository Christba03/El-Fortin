 //Aun no esta implementada//
//Esta función se manda a llamar cuando se termina de cargar por completo la página
$(document).ready(function() {
    // Esta es la URL de la API donde se encuentran los usuarios.
    const apiUrl = 'https://reqres.in/api/users';

    // Función para cargar los usuarios desde la API.
    function loadUsers() {
        $.ajax({ // es la forma de acceder a las apis mediante Ajax
            url: apiUrl, // URL de la API para obtener los usuarios.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {// la variable “response” trae el resultado del api
                // La respuesta contiene los datos de los usuarios.
                let users = response.data; // data es una propiedad del json de la respuesta
                // Se selecciona el cuerpo de la tabla donde se mostrarán los usuarios.
                let userTableBody = $('#user-table-body');
                userTableBody.empty(); // Se vacía la tabla antes de llenarla.

                // Se recorre cada usuario y se añade una fila en la tabla para cada uno.
                users.forEach(user => {
                    userTableBody.append(`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name} ${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    // Función para mostrar una alerta en la interfaz.
    function showAlert(message, type) {
        // alert container es una sección de html en la cual se pintará un mensaje
        $('#alert-container').html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>(
        `);
        setTimeout(()=>{
            $('#alert-container').html('');
        })
    }

    // Evento que se dispara al enviar el formulario para agregar o editar un usuario.
    $('#user-form').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional.

        let userId = $('#user-id').val(); // ID del usuario (si se está editando).
        let userName = $('#user-name').val().split(' '); // Nombre del usuario.
        let userEmail = $('#user-email').val(); // Email del usuario.

        // Se determina si se trata de agregar (POST) o editar (PUT) un usuario.
        let method = userId ? 'PUT' : 'POST';
        let url = userId ? `${apiUrl}/${userId}` : apiUrl;

        // Se realiza la llamada AJAX para agregar o editar el usuario.
        $.ajax({
            url: url, // URL de la API.
            method: method, // Método HTTP (POST o PUT).
            contentType: 'application/json', // Tipo de contenido de los datos enviados.
            data: JSON.stringify({
                first_name: userName[0], // Primer nombre.
                last_name: userName[1] || '', // Segundo nombre (si lo hay).
                email: userEmail // Email.
            }),
            success: function() {
                // Si la operación es exitosa, se recargan los usuarios y se muestra una alerta de éxito.
                loadUsers();
                showAlert('Usuario guardado exitosamente', 'success');
                $('#userModal').modal('hide'); // Se cierra el modal.
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al guardar el usuario', 'danger');
            }
        });
    });

    // Evento que se dispara al hacer clic en el botón de editar un usuario.
    $(document).on('click', '.edit-user-btn', function() {
        let userId = $(this).data('id'); // Se obtiene el ID del usuario a editar.

        // Se realiza la llamada AJAX para obtener los datos del usuario.
        $.ajax({
            url: `${apiUrl}/${userId}`, // URL de la API con el ID del usuario.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {
                let user = response.data; // Datos del usuario.

                // Se rellenan los campos del formulario con los datos del usuario.
                $('#user-id').val(user.id);
                $('#user-name').val(`${user.first_name} ${user.last_name}`);
                $('#user-email').val(user.email);
                $('#userModalLabel').text('Editar Usuario'); // Se cambia el título del modal.
                $('#userModal').modal('show'); // Se muestra el modal.
            }
        });
    });

    // Evento que se dispara al hacer clic en el botón de eliminar un usuario.
    $(document).on('click', '.delete-user-btn', function() {
        let userId = $(this).data('id'); // Se obtiene el ID del usuario a eliminar.

        // Se realiza la llamada AJAX para eliminar el usuario.
        $.ajax({
            url: `${apiUrl}/${userId}`, // URL de la API con el ID del usuario.
            method: 'DELETE', // Método HTTP para eliminar datos.
            success: function() {
                // Si la operación es exitosa, se recargan los usuarios y se muestra una alerta de éxito.
                loadUsers();
                showAlert('Usuario eliminado exitosamente', 'success');
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al eliminar el usuario', 'danger');
            }
        });
    });

    // Evento que se dispara al cerrar el modal.
    $('#userModal').on('hidden.bs.modal', function() {
        $('#user-form')[0].reset(); // Se resetea el formulario.
        $('#user-id').val(''); // Se vacía el campo de ID.
        $('#userModalLabel').text('Agregar Usuario'); // Se cambia el título del modal.
    });

    // Se inicializan los usuarios al cargar la página.
    loadUsers();
});

