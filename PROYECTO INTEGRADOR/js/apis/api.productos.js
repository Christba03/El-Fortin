
//Esta función se manda a llamar cuando se termina de cargar por completo la página
$(document).ready(function() {
    // Esta es la URL de la API donde se encuentran los usuarios.
    const apiUrl = 'http://test.utcv.edu.mx/api/products';

    // Función para cargar los usuarios desde la API.
    function loadProducts() {
        $.ajax({ // es la forma de acceder a las apis mediante Ajax
            url: apiUrl, // URL de la API para obtener los usuarios.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {// la variable “response” trae el resultado del api
                // La respuesta contiene los datos de los usuarios.
                let products = response; // data es una propiedad del json de la respuesta
                // Se selecciona el cuerpo de la tabla donde se mostrarán los usuarios.
                let productTableBody = $('#product-table-body');
                productTableBody.empty(); // Se vacía la tabla antes de llenarla.

                // Se recorre cada usuario y se añade una fila en la tabla para cada uno.
                products.forEach((product) => {
                    productTableBody.append(`
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.product} </td>
                            <td>${product.price}</td>
                            <td>${product.bar_code} </td>
                            <td>${product.stock}</td>
                            <td>${product.description}</td>
                        <td>
                           <button class="btn btn-sm text-bg-secondary edit-product-btn" data-id="${product.id}"><i class="fa-solid fa-pen-to-square fs-6"></i></button>
                           <button class="btn btn-sm text-bg-primary delete-product-btn" data-id="${product.id}"><i class="fa-solid fa-trash fs-6"></i></button>
                        </td>
                        </tr>
                    `);
                });
            }
            
        });
    }
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
    $('#formProductos').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional.

        let productId = $('#product-id').val(); // ID del usuario (si se está editando).
        let productName = $('##product').val(); // Nombre del usuario.
        let productPrice = $('#price').val(); // Email del usuario.
        let productBar_code = $('#bar_code').val();
        let productStock = $('#stock').val();
        let productDescription = $('d#escription').val();

        // Se determina si se trata de agregar (POST) o editar (PUT) un usuario.
        let method = productId ? 'PUT' : 'POST';
        let url = productId ? `${apiUrl}/${productId}` : apiUrl;

        // Se realiza la llamada AJAX para agregar o editar el usuario.
        $.ajax({
            url: url, // URL de la API.
            method: method, // Método HTTP (POST o PUT).
            contentType: 'application/json', // Tipo de contenido de los datos enviados.
            data: JSON.stringify({
                product: productName, // Primer nombre.
                price: productPrice, // Segundo nombre (si lo hay).
                stock: productStock, // Email.
                bar_code: productBar_code,
                description: productDescription
            }),
            success: function() {
                // Si la operación es exitosa, se recargan los usuarios y se muestra una alerta de éxito.
                loadProducts();
                showAlert('Producto guardado exitosamente', 'success');
                $('#modalProductos').modal('hide'); // Se cierra el modal.
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al guardar el usuario', 'danger');
            }
        });
    });

    // Evento que se dispara al hacer clic en el botón de editar un usuario.
    $(document).on('click', '.edit-product-btn', function() {
        let productId = $(this).data('id'); // Se obtiene el ID del usuario a editar.

        // Se realiza la llamada AJAX para obtener los datos del usuario.
        $.ajax({
            url: `${apiUrl}/${productId}`, // URL de la API con el ID del usuario.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {
                let product = response; // Datos del usuario.

                // Se rellenan los campos del formulario con los datos del usuario.
                $("#product-id").val(product.id);
                $("#product").val(product.product);
                $("#price").val(product.price);
                $("#bar_code").val(product.bar_code);
                $("#stock").val(product.stock);
                $("#description").val(product.description);
                $('#modalProductosTitle').text('Editar Producto'); // Se cambia el título del modal.
                $('#modalProductos').modal('show'); // Se muestra el modal.
            }
        });
        loadProducts();
        $("#modalProductos").modal("hide");
    });

    // Evento que se dispara al hacer clic en el botón de eliminar un usuario.
    $(document).on('click', '.delete-product-btn', function() {
        let productId = $(this).data('id'); // Se obtiene el ID del usuario a eliminar.

        // Se realiza la llamada AJAX para eliminar el usuario.
        $.ajax({
            url: `${apiUrl}/${productId}`, // URL de la API con el ID del usuario.
            method: 'DELETE', // Método HTTP para eliminar datos.
            success: function() {
                // Si la operación es exitosa, se recargan los usuarios y se muestra una alerta de éxito.
                loadProducts();
                showAlert('Usuario eliminado exitosamente', 'success');
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al eliminar el usuario', 'danger');
            }
        });
    });

    // Evento que se dispara al cerrar el modal.
    $('#modalProductos').on('hidden.bs.modal', function() {
        $('#formProductos')[0].reset(); // Se resetea el formulario.
        $('#product-id').val(''); // Se vacía el campo de ID.
        $('#modalProductosLabel').text('Agregar Usuario'); // Se cambia el título del modal.
    });

    // Se inicializan los usuarios al cargar la página.
    loadProducts();
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