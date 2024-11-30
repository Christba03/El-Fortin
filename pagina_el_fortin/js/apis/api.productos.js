$(document).ready(function () {
    const apiUrl = 'https://fortin.christba.com/api/products'; // URL base de la API de productos

    // Función para cargar productos desde la API
    function loadProducts() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const products = response;
                populateProductTable(products);
            },
            error: function (error) {
                console.error('Error al cargar los productos:', error);
                showAlert('Error al cargar los productos', 'danger');
            }
        });
    }

    // Función para llenar la tabla con los productos
    function populateProductTable(products) {
        const productTableBody = $('#product-table-body');
        productTableBody.empty();

        products.forEach(product => {
            // Renderizar la fila de la tabla
            productTableBody.append(`
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.category_name}</td>
                    <td>${product.description || "Descripción no disponible"}</td>
                    <td>
                        <button class="btn btn-sm text-bg-secondary edit-product-btn" data-id="${product.id}">
                            <i class="fa-solid fa-pen-to-square fs-6"></i>
                        </button>
                        <button class="btn btn-sm text-bg-primary delete-product-btn" data-id="${product.id}">
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

    // Función para guardar o actualizar un producto
    function saveProduct(productData, productId = null) {
        const method = productId ? 'PUT' : 'POST';
        const url = productId ? `${apiUrl}/${productId}` : apiUrl;

        const payload = {
            name: productData.name || "",
            price: productData.price || "",
            bar_code: productData.bar_code || "",
            stock: productData.stock || 0,
            description: productData.description || ""
        };

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                loadProducts(); // Recargar la lista de productos
                showAlert('Producto guardado exitosamente', 'success');
                $('#modalProductos').modal('hide'); // Cerrar el modal
            },
            error: function (error) {
                console.error('Error al guardar el producto:', error);
                showAlert('Error al guardar el producto', 'danger');
            }
        });
    }

    // Función para eliminar un producto
    function deleteProduct(productId) {
        $.ajax({
            url: `${apiUrl}/${productId}`,
            method: 'DELETE',
            success: function () {
                loadProducts(); // Recargar la lista de productos
                showAlert('Producto eliminado exitosamente', 'success');
            },
            error: function (error) {
                console.error('Error al eliminar el producto:', error);
                showAlert('Error al eliminar el producto', 'danger');
            }
        });
    }

    // Manejo del formulario para guardar o actualizar producto
    $('#formProductos').submit(function (event) {
        event.preventDefault();

        const productId = $('#product-id').val();
        const productData = {
            name: $('#product').val(),
            price: $('#price').val(),
            bar_code: $('#bar_code').val(),
            stock: $('#stock').val(),
            description: $('#description').val(),
        };
        saveProduct(productData, productId);
    });

    // Evento al hacer clic en editar producto
// Evento al hacer clic en editar producto
$(document).on('click', '.edit-product-btn', function () {
    const productId = $(this).data('id');

    $.ajax({
        url: `${apiUrl}/${productId}`,
        method: 'GET',
        success: function (product) {
            // Asignar valores a los campos del formulario
            $('#product-id').val(product.id);  // ID del producto
            $('#name').val(product.name);  // Nombre del producto
            console.log($('#name').val());  
            $('#price').val(product.price);  // Precio
            $('#description').val(product.description);  // Descripción

            // Asignar la categoría correctamente
            $('#category').val(product.category_name); // Se asigna la categoría

            // Mostrar modal con los datos cargados
            $('#modalProductosLabel').text('Editar Producto');
            $('#modalProductos').modal('show');

            // Mostrar el objeto del producto para depuración
            console.log(product);
        },
        error: function (error) {
            console.error('Error al obtener los detalles del producto:', error);
            showAlert('Error al obtener los detalles del producto', 'danger');
        }
    });
});


    // Evento al hacer clic en eliminar producto
    $(document).on('click', '.delete-product-btn', function () {
        const productId = $(this).data('id');

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
                deleteProduct(productId);
            }
        });
    });

    // Resetear modal al cerrarlo
    $('#modalProductos').on('hidden.bs.modal', function () {
        $('#formProductos')[0].reset();
        $('#product-id').val('');
        $('#modalProductosLabel').text('Agregar Producto');
    });

    // Inicializar la carga de productos
    loadProducts();
});