$(document).ready(function () {
  const apiUrl = 'https://fortin.christba.com/api/ventas'; // URL base de la API de ventas

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

  // Función para llenar la tabla con las ventas
  function populateSalesTable(sales) {
      const salesTableBody = $('#sales-table-body');
      salesTableBody.empty();

      sales.forEach(sale => {
          const formattedDate = new Date(sale.report_date).toLocaleDateString();
          salesTableBody.append(`
              <tr>
                  <td>${sale.id}</td>
                  <td>${sale.restaurant_id}</td>
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

  // Evento al hacer clic en el botón de editar venta
  $(document).on('click', '.edit-sale-btn', function () {
      const saleId = $(this).data('id');

      $.ajax({
          url: `${apiUrl}/${saleId}`,
          method: 'GET',
          success: function (sale) {
              $('#sale-id').val(sale.id);
              $('#restaurant-id').val(sale.restaurant_id);
              $('#report-date').val(new Date(sale.report_date).toISOString().split('T')[0]);
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
