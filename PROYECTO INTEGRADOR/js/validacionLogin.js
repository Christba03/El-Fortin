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


  $(document).ready(function(){
  //debemos validar lo que enviemos con un arreglo de usuarios registrados XD
  let usuariosRegistrados = [
    {
      id: 1,
      correo: "angel@gmail.com",
      contrasena: "angel1234",
    },
    {
      id: 2,
      correo: "joseangel@gmail.com",
      contrasena: "pepe",
    },
  ];


  function correcto(){
    Swal.fire({
      icon: "success",
      title: "Credenciales correctas",
    });
  }

  function error(){
    Swal.fire({
      icon: "error",
      title: "Credenciales incorrectas.",
    });
  }


  $("#user-form").submit(function (event) {
    event.preventDefault();
    let correo = $("#user-email").val();
    let contrasena = $("#user-password").val();

    // Verificar si los campos están vacíos
        if (correo === "" || contrasena === "") {
        return; // No hacer nada si los campos están vacíos
      }

      let credencialesCorrectas = false;

    for(let i = 0; i<usuariosRegistrados.length; i++){
       if(correo == usuariosRegistrados[i].correo && contrasena == usuariosRegistrados[i].contrasena){
           credencialesCorrectas = true;
           break;
       }
    }

    if(credencialesCorrectas){
      correcto();
      $("#userModal").modal("hide");
    }else{
      error();
    }
  });
});