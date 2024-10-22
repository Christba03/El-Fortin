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
        cliente: "Jose Angel Lopez Rivera",
        empleado: "Jose Manuel Lara Villalobos",
        mesa: "1",
        formaPago: "Efectivo",
        iva: "128",
        total: "929",
        fecha: "2023-05-10"
      },
      {
        id: 2,
        cliente: "Jose Manuel Lara Villalobos",
        empleado: "Jose Angel Lopez Rivera",
        mesa: "2",
        formaPago: "Tarjeta de Debito",
        iva: "138",
        total: "1929",
        fecha: "2022-06-10"
      },
    ];
  
    //se creara una funcion para cargar los usuarios que esten en la tabla.
    function loadEmployes() {
      let pedidos = arreglo;
      let pedidoTableBody = $("#employe-table-body");
      pedidoTableBody.empty();
      pedidos.forEach((pedido) => {
        pedidoTableBody.append(`
                      <tr>
                          <td>${pedido.id}</td>
                          <td>${pedido.cliente}</td>
                          <td>${pedido.empleado}</td>                          
                          <td>${pedido.mesa}</td>
                          <td>${pedido.formaPago}</td>
                          <td>$${pedido.iva}</td>
                          <td>$${pedido.total}</td>                          
                          <td>${pedido.fecha}</td>
                          <td>
                             <button class="btn btn-sm text-bg-secondary edit-user-btn" data-id="${pedido.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                             <button class="btn btn-sm text-bg-primary delete-user-btn" data-id="${pedido.id}"><i class="fa-solid fa-trash fs-6"></i></button>
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
  
  
    //funcion para agregar los ventas
    $("#formUsuarios").submit(function (event){
      event.preventDefault();
      let userId = $("#pedido-id").val();
      let cliente = $("#nombreCliente").val();
      let empleado = $("#nombreEmpleado").val();
      let mesa = $("#mesa").val();
      let formaPago = $("#formaPago").val();
      let iva = $("#iva").val();
      let total = $("#total").val();      
      let fecha = $("#fecha").val();
      let method = userId ? "PUT" : "POST";
  
      if(method == "POST"){
        let newId = arreglo[arreglo.length - 1].id + 1;
        arreglo.push({
          id: newId,
          cliente: cliente,
          empleado: empleado,
          mesa: mesa,
          formaPago:formaPago,
          iva: iva,
          total: total,
          fecha: fecha                       
        });
      }else {
        let objeto = searchObject(userId);

        objeto.cliente = cliente;
        objeto.empleado= empleado;
        objeto.mesa= mesa;
        objeto.formaPago= formaPago;
        objeto.iva = iva;
        objeto.total= total;
        objeto.fecha = fecha;
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
      $("#pedido-id").val(employe.id);
      $("#nombreCliente").val(employe.cliente);
      $("#nombreEmpleado").val(employe.empleado);
      $("#mesa").val(employe.mesa);
      $("#total").val(employe.total);
      $("#formaPago").val(employe.formaPago);
      $("#iva").val(employe.iva);              
      $("#fecha").val(employe.fecha);        
      $("#modalUsuariosLabel").text("Editar Pedido");
      $("#modalUsuarios").modal("show");
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
            text: "No podras revertir el cambio!",
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
                text: "Tu registro fue eliminado.",
                icon: "success"
              });
            }else if(result.dismiss === Swal.DismissReason.cancel){
              Swal.fire({
                title: "Cancelado",
                text: "Tu registro no fue alterado.",
                icon: "error"
              })
            }
          });
        }
      });
  
      // Resetear modal al cerrarlo
      $("#modalUsuarios").on("hidden.bs.modal", function () {
        $("#formUsuarios")[0].reset();
        $("#pedido-id").val("");
        $("#modalUsuariosLabel").text("Agregar Pedido");
      });
    
  
     // Inicializar la tabla de usuarios
  
     loadEmployes();
  });