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
    event.preventDefault(); // Previene el envío predeterminado del formulario

    $.ajax({
        url: "php/validarUsuarios.php", // El archivo PHP que procesará la solicitud
        type: "POST", // Método de envío
        data: $(this).serialize(), // Serializa los datos del formulario
        dataType: 'json', // Espera una respuesta JSON
        success: function(response) {
            if (response.status === 'success') {
                Swal.fire({
                    title: 'Correcto',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirigir si es necesario
                    window.location.href = 'paginas/panelAdministrativo/usuarios.html';
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