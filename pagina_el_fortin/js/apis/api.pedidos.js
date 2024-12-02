$(document).ready(function () {
  const apiUrl = "https://fortin.christba.com/api/orders";
  const pageSize = 9; // Número de pedidos por página
  let currentPage = 1; // Página actual
  let orders = []; // Lista de pedidos

  // Función extendida para cargar los pedidos desde la API
  function loadOrders() {
    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (response) {
        console.log("Respuesta de la API:", response);
        orders = response.data || []; // Validar y asignar los datos de la API

        if (!Array.isArray(orders)) {
          console.error("La propiedad 'data' no es un arreglo:", orders);
          showAlert("Error al cargar los pedidos: datos inválidos", "danger");
          return;
        }

        showPage(currentPage);
        setupPagination();
      },
      error: function (error) {
        console.error("Error al cargar los pedidos:", error);
        showAlert("Error al cargar los pedidos", "danger");
      },
    });
  }

  // Función para mostrar los pedidos de la página actual
  function showPage(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageOrders = orders.slice(startIndex, endIndex);

    const orderTableBody = $("#employe-table-body");
    orderTableBody.empty();

    pageOrders.forEach((order) => {
      const formattedDate = new Date(order.order_date).toLocaleDateString(); // Formatear la fecha
      orderTableBody.append(`
          <tr>
            <td>${order.id}</td>
            <td>${order.client_id}</td>
            <td>${order.table_number}</td>
            <td>${order.total_amount}</td>
            <td>${formattedDate}</td>
            <td>
              <button class="btn btn-sm text-bg-secondary edit-order-btn" data-id="${order.id}">
                <i class="fa-solid fa-pen-to-square fs-6"></i>
              </button>
              <button class="btn btn-sm text-bg-primary delete-order-btn" data-id="${order.id}">
                <i class="fa-solid fa-trash fs-6"></i>
              </button>
            </td>
          </tr>
        `);
    });
  }

  function setupPagination() {
    const pageCount = Math.ceil(orders.length / pageSize);
    const paginationContainer = $("#pagination-container");
  
    // Update page info
    $("#page-info").text(`Página ${currentPage} de ${pageCount}`);
  
    // Disable/enable buttons based on the current page
    if (currentPage <= 1) {
      $("#prev-btn").prop("disabled", true);
    } else {
      $("#prev-btn").prop("disabled", false);
    }
  
    if (currentPage >= pageCount) {
      $("#next-btn").prop("disabled", true);
    } else {
      $("#next-btn").prop("disabled", false);
    }
  }
  
  // Handle "Previous" button click
  $("#prev-btn").click(function () {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
      setupPagination();
    }
  });
  
  // Handle "Next" button click
  $("#next-btn").click(function () {
    const pageCount = Math.ceil(orders.length / pageSize);
    if (currentPage < pageCount) {
      currentPage++;
      showPage(currentPage);
      setupPagination();
    }
  });
  

  // Función para mostrar alertas
  function showAlert(message, type) {
    $("#alert-container").html(`
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    setTimeout(() => {
      $("#alert-container").html("");
    }, 3000);
  }

  // Evento al enviar el formulario para agregar o editar pedidos
  $("#formVentas").submit(function (event) {
    event.preventDefault(); // Prevenir envío tradicional

    let orderId = $("#venta-id").val();
    let cliente = $("#cliente").val();
    let estado = $("#estado").val();
    let mesa = $("#mesa").val();
    let detalle = $("#detalle").val();

    let method = orderId ? "PUT" : "POST";
    let url = orderId ? `${apiUrl}/${orderId}` : apiUrl;

    $.ajax({
      url: url, // URL de la API
      method: method, // Método HTTP (POST o PUT)
      contentType: "application/json", // Tipo de contenido
      data: JSON.stringify({
        client_id: cliente,
        status_id: estado,
        table_number: mesa,
        description: detalle,
      }),
      success: function () {
        loadOrders();
        showAlert("Pedido guardado exitosamente", "success");
        $("#modalVentas").modal("hide");
      },
      error: function (error) {
        console.error("Error al guardar el pedido:", error);
        showAlert("Error al guardar el pedido", "danger");
      },
    });
  });

  // Evento al hacer clic en el botón de editar pedido
  $(document).on("click", ".edit-order-btn", function () {
    let orderId = $(this).data("id");

    $.ajax({
      url: `${apiUrl}/${orderId}`, // URL con el ID del pedido
      method: "GET", // Método HTTP para obtener datos
      success: function (order) {
        $("#venta-id").val(order.id);
        $("#cliente").val(order.client_id);
        $("#estado").val(order.status_id);
        $("#mesa").val(order.table_number);
        $("#detalle").val(order.description);

        $("#modalVentasLabel").text("Editar Pedido");
        $("#modalVentas").modal("show");
      },
      error: function (error) {
        console.error("Error al obtener los detalles del pedido:", error);
        showAlert("Error al obtener los detalles del pedido", "danger");
      },
    });
  });

  // Evento al hacer clic en el botón de eliminar pedido
  $(document).on("click", ".delete-order-btn", function () {
    let orderId = $(this).data("id");

    $.ajax({
      url: `${apiUrl}/${orderId}`, // URL con el ID del pedido
      method: "DELETE", // Método HTTP para eliminar datos
      success: function () {
        loadOrders();
        showAlert("Pedido eliminado exitosamente", "success");
      },
      error: function (error) {
        console.error("Error al eliminar el pedido:", error);
        showAlert("Error al eliminar el pedido", "danger");
      },
    });
  });

  // Evento al cerrar el modal
  $("#modalVentas").on("hidden.bs.modal", function () {
    $("#formVentas")[0].reset(); // Resetear el formulario
    $("#venta-id").val(""); // Limpiar el campo de ID
    $("#modalVentasLabel").text("Formulario de pedido");
  });

  // Inicializar los pedidos al cargar la página
  loadOrders();
});
