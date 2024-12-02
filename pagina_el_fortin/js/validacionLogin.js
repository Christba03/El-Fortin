(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  
  // Resetear modal al cerrarlo
  $("#userModal").on("hidden.bs.modal", function () {
    const form = $("#user-form")[0];
    form.reset();
    form.classList.remove('was-validated');
  });

  $('#user-form').submit(function(event) {
    const apiUrl = 'https://fortin.christba.com/api/login'; // URL base de la API de usuarios

    event.preventDefault(); // Previene el envío predeterminado del formulario

    // Capturar los valores de los campos del formulario
    const emailOrNickname = $('#user-email').val();
    const password = $('#user-password').val();

    // Crear el payload JSON esperado por la API
    const payload = JSON.stringify({
        emailOrNickname: emailOrNickname,
        password: password
    });

    $.ajax({
        url: apiUrl,
        type: "POST", // Método de envío
        contentType: 'application/json', // Tipo de contenido
        data: payload, // Datos en formato JSON
        dataType: 'json', // Espera una respuesta JSON
        success: function(response) {
            if (response.token) {
                // Guardar el token en localStorage
                localStorage.setItem('authToken', response.token);

                Swal.fire({
                    title: 'Correcto',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirigir a una página protegida o dashboard
                    window.location.href = './paginas/panelAdministrativo/clientes.html';
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function(xhr, status, error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema con la solicitud.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});
