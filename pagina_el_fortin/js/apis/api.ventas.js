$(document).ready(function () {
    const apiUrl = 'https://fortin.christba.com/api/ventas'; // URL base de la API de ventas

    function loadRestaurant(idRestaurant) {
        const urlRestaurants = 'https://fortin.christba.com/api/restaurantes/';

        return new Promise((resolve, reject) => {
            $.ajax({
                url: urlRestaurants + idRestaurant,
                method: 'GET',
                success: function (response) {
                    // Verificar si la respuesta contiene la clave `data` con la información del restaurante
                    if (response.data) {
                        const restaurant = response.data;
                        resolve(restaurant); // Retorna los datos del restaurante
                    } else {
                        reject('No se encontraron datos para este restaurante');
                    }
                },
                error: function (error) {
                    reject('Error al cargar los datos del restaurante');
                }
            });
        });
    }

    // Función para cargar las ventas desde la API
    function loadSales() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                if (response.codigo !== 200 || !Array.isArray(response.data)) {
                    showAlert("Error al cargar las ventas: datos inválidos", "danger");
                    return;
                }

                const sales = response.data;
                populateSalesTable(sales); // Llenar la tabla con las ventas
            },
            error: function (error) {
                console.error("Error al cargar las ventas:", error);
                showAlert("Error al cargar las ventas", "danger");
            }
        });
    }

    function populateSalesTable(sales) {
        const salesTableBody = $('#sales-table-body');
        salesTableBody.empty();

        sales.forEach(sale => {
            // Llamamos a la función loadRestaurant dentro de la promesa
            loadRestaurant(sale.restaurant_id)
                .then(restaurant => {
                    // Verificar si sale.report_date tiene un valor válido
                    const reportDate = sale.report_date ? new Date(sale.report_date) : null;
                    const formattedDate = reportDate && !isNaN(reportDate.getTime()) 
                        ? reportDate.toLocaleDateString() 
                        : 'Fecha no válida';

                    // Ahora que tenemos los datos del restaurante, agregamos la fila a la tabla
                    salesTableBody.append(`
                        <tr>
                        <td>${sale.id}</td>
                            <td>${restaurant.name}</td> <!-- Nombre del restaurante -->
                            <td>${formattedDate}</td>
                            <td>$${sale.total_sales}</td>
                            <td>
                                <button class="btn btn-sm text-bg-secondary edit-sale-btn" data-id="${sale.id}">
                                    <i class="fa-solid fa-pen-to-square fs-6"></i>
                                </button>
                                <button class="btn btn-sm text-bg-primary delete-sale-btn" data-id="${sale.id}">
                                    <i class="fa-solid fa-trash fs-6"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                })
                .catch(error => {
                    console.error('Error al obtener el restaurante:', error);
                    // Si hay un error, podríamos mostrar un nombre de restaurante predeterminado
                    salesTableBody.append(`
                        <tr>
                        <td>${sale.restaurant_id}</td>
                            <td>Error al cargar restaurante</td>
                            <td>${new Date(sale.report_date).toLocaleDateString()}</td>
                            <td>$${sale.total_sales}</td>
                            <td>
                                <button class="btn btn-sm text-bg-secondary edit-sale-btn" data-id="${sale.id}">
                                    <i class="fa-solid fa-pen-to-square fs-6"></i>
                                </button>
                                <button class="btn btn-sm text-bg-primary delete-sale-btn" data-id="${sale.id}">
                                    <i class="fa-solid fa-trash fs-6"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });
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

    // Función para guardar ventas (crear o actualizar)
    function saveSale(saleData, saleId = null) {
        const method = saleId ? 'PUT' : 'POST';
        const url = saleId ? `${apiUrl}/${saleId}` : apiUrl;

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(saleData),
            success: function () {
                loadSales();
                showAlert('Venta guardada exitosamente', 'success');
                $('#modalSales').modal('hide');
            },
            error: function (error) {
                console.error("Error al guardar la venta:", error);
                showAlert('Error al guardar la venta', 'danger');
            }
        });
    }

    // Función para eliminar una venta
    function deleteSale(saleId) {
        $.ajax({
            url: `${apiUrl}/${saleId}`,
            method: 'DELETE',
            success: function () {
                loadSales();
                showAlert('Venta eliminada exitosamente', 'success');
            },
            error: function (error) {
                console.error("Error al eliminar la venta:", error);
                showAlert('Error al eliminar la venta', 'danger');
            }
        });
    }

    // Evento al enviar el formulario para agregar o editar ventas
    $('#formSales').submit(function (event) {
        event.preventDefault();

        const saleId = $('#sale-id').val();
        const saleData = {
            restaurant_id: $('#restaurant-id').val(),
            report_date: $('#report-date').val(),
            total_sales: $('#total-sales').val()
        };

        saveSale(saleData, saleId);
    });

    $(document).on('click', '.edit-sale-btn', function () {
        const saleId = $(this).data('id');
    
        $.ajax({
            url: `${apiUrl}/${saleId}`,
            method: 'GET',
            success: function (sale) {
                $('#sale-id').val(sale.id);
                $('#restaurant-id').val(sale.restaurant_id);
    
                // Verificar si sale.report_date existe y es válida
                let reportDate = sale.report_date ? new Date(sale.report_date) : null;
                console.log("sale.report_date:", sale.report_date);
    
                // Si la fecha es válida, formatearla
                if (reportDate && !isNaN(reportDate.getTime())) {
                    $('#report-date').val(reportDate.toISOString().split('T')[0]); // Convertir la fecha
                } else {
                    // Si la fecha es inválida, mostrar un mensaje de error
                    console.error("Fecha inválida:", reportDate);
                    showAlert('La fecha de la venta es inválida', 'danger');
                    $('#report-date').val(''); // Limpiar el campo de fecha en el modal
                }
    
                $('#total-sales').val(sale.total_sales);
    
                $('#modalSalesLabel').text('Editar Venta');
                $('#modalSales').modal('show');
            },
            error: function (error) {
                console.error("Error al obtener los detalles de la venta:", error);
                showAlert('Error al obtener los detalles de la venta', 'danger');
            }
        });
    });
    

    // Función para verificar si una fecha es válida
    function isValidDate(date) {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()); // Retorna true si la fecha es válida, de lo contrario false
    }

    // Evento al hacer clic en el botón de eliminar venta
    $(document).on('click', '.delete-sale-btn', function () {
        const saleId = $(this).data('id');

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
                deleteSale(saleId);
            }
        });
    });

    // Resetear modal al cerrarlo
    $('#modalSales').on('hidden.bs.modal', function () {
        $('#formSales')[0].reset();
        $('#sale-id').val('');
        $('#modalSalesLabel').text('Agregar Venta');
    });

    // Inicializar la carga de ventas
    loadSales();
});
