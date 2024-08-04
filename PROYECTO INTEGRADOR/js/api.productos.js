 //Aun no esta implementada//
//Esta función se manda a llamar cuando se termina de cargar por completo la página
$(document).ready(function() {
    // Esta es la URL de la API donde se encuentran los productos.
    const apiUrl = 'http://test.utcv.edu.mx/api/products';

    // Función para cargar los productos desde la API.
    function loadProducts() {
        $.ajax({ // es la forma de acceder a las apis mediante Ajax
            url: apiUrl, // URL de la API para obtener los productos.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {// la variable “response” trae el resultado del api
                // La respuesta contiene los datos de los productos.
                let products = response.data; // data es una propiedad del json de la respuesta
                // Se selecciona el cuerpo de la tabla donde se mostrarán los productos.
                let productTableBody = $('#product-table-body');
                productTableBody.empty(); // Se vacía la tabla antes de llenarla.

                // Se recorre cada producto y se añade una fila en la tabla para cada uno.
                products.forEach(product => {
                    productTableBody.append(`
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.product} </td>
                            <td>${product.price}</td>
                            <td>${product.stock}</td>

                            <td>
                                <button class="btn btn-warning btn-sm edit-product-btn" data-id="${product.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-product-btn" data-id="${product.id}">Eliminar</button>
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

    // Evento que se dispara al enviar el formulario para agregar o editar un producto.
    $('#product-form').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional.

        let productId = $('#product-id').val(); // ID del producto (si se está editando).
        let productName = $('#product-name').val().split(' '); // Nombre del producto.
        let productEmail = $('#product-email').val(); // Email del producto.

        // Se determina si se trata de agregar (POST) o editar (PUT) un producto.
        let method = productId ? 'PUT' : 'POST';
        let url = productId ? `${apiUrl}/${productId}` : apiUrl;

        // Se realiza la llamada AJAX para agregar o editar el producto.
        $.ajax({
            url: url, // URL de la API.
            method: method, // Método HTTP (POST o PUT).
            contentType: 'application/json', // Tipo de contenido de los datos enviados.
            data: JSON.stringify({
                first_name: productName[0], // Primer nombre.
                last_name: productName[1] || '', // Segundo nombre (si lo hay).
                email: productEmail // Email.
            }),
            success: function() {
                // Si la operación es exitosa, se recargan los productos y se muestra una alerta de éxito.
                loadProducts();
                showAlert('Producto guardado exitosamente', 'success');
                $('#productModal').modal('hide'); // Se cierra el modal.
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al guardar el producto', 'danger');
            }
        });
    });

    // Evento que se dispara al hacer clic en el botón de editar un producto.
    $(document).on('click', '.edit-product-btn', function() {
        let productId = $(this).data('id'); // Se obtiene el ID del producto a editar.

        // Se realiza la llamada AJAX para obtener los datos del producto.
        $.ajax({
            url: `${apiUrl}/${productId}`, // URL de la API con el ID del producto.
            method: 'GET', // Método HTTP para obtener datos.
            success: function(response) {
                let product = response.data; // Datos del producto.

                // Se rellenan los campos del formulario con los datos del producto.
                $('#product-id').val(product.id);
                $('#product-name').val(`${product.first_name} ${product.last_name}`);
                $('#product-email').val(product.email);
                $('#productModalLabel').text('Editar Producto'); // Se cambia el título del modal.
                $('#productModal').modal('show'); // Se muestra el modal.
            }
        });
    });

    // Evento que se dispara al hacer clic en el botón de eliminar un producto.
    $(document).on('click', '.delete-product-btn', function() {
        let productId = $(this).data('id'); // Se obtiene el ID del producto a eliminar.

        // Se realiza la llamada AJAX para eliminar el producto.
        $.ajax({
            url: `${apiUrl}/${productId}`, // URL de la API con el ID del producto.
            method: 'DELETE', // Método HTTP para eliminar datos.
            success: function() {
                // Si la operación es exitosa, se recargan los productos y se muestra una alerta de éxito.
                loadProducts();
                showAlert('Producto eliminado exitosamente', 'success');
            },
            error: function() {
                // Si hay un error, se muestra una alerta de error.
                showAlert('Error al eliminar el producto', 'danger');
            }
        });
    });

    // Evento que se dispara al cerrar el modal.
    $('#productModal').on('hidden.bs.modal', function() {
        $('#product-form')[0].reset(); // Se resetea el formulario.
        $('#product-id').val(''); // Se vacía el campo de ID.
        $('#productModalLabel').text('Agregar Producto'); // Se cambia el título del modal.
    });

    // Se inicializan los productos al cargar la página.
    loadProducts();
});

