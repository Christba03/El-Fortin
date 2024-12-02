// Evento que se dispara al hacer clic en el botón de ver detalles de un producto.
function viewDetails(productId) {
    const apiUrl = `https://fortin.christba.com/api/products`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Encuentra el producto por su ID
            const product = data.find(item => item.id === productId);

            if (product) {
                // Llena el modal con los datos
                $('#modalBebidaTitle').text(product.name);
                $('#modalBebidaImage').attr('src', product.image_url); 
                $('#modalBebidaDescription').text(product.description);
 
                // Muestra el modal
                const myModal = new bootstrap.Modal(document.getElementById('modalBebida'), {});
                myModal.show();
            } else {
                console.error('Producto no encontrado');
            }
        })
        .catch(error => console.error('Error al cargar los detalles del producto:', error));
}

$(document).ready(function () {
    const apiUrl = 'https://fortin.christba.com/api/products';

    function loadProducts() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                // Filtrar los productos por categoría "Restaurante"
                const restaurantProducts = response.filter(product => product.category_name === "Panaderia");
                const productsContainer = $('#products-container');
                productsContainer.empty();

                // Renderizar los productos filtrados
                restaurantProducts.forEach(product => {
                    productsContainer.append(`
                        <div class="card-product">
                            <div class="container-img">
                                <img src="${product.image_url || 'placeholder.jpg'}" alt="${product.name}" />
                            </div>
                            <div class="content-card-product">
                                <h3>${product.name}</h3>
                                <p>${product.description || 'Sin descripción disponible'}</p>
                                <p class="precio">$${product.price || 'N/A'}</p>
                                <div class="button-container">
                                    <button class="add-cart" aria-label="Add to cart">
                                        <i class="fa-solid fa-clipboard"></i>
                                    </button>
                                    <button class="add-cart" aria-label="View details" onclick="viewDetails('${product.id}')">
                                        <i class="fa-solid fa-circle-info"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                });

                if (restaurantProducts.length === 0) {
                    productsContainer.append('<p>No hay productos disponibles en la categoría "Restaurante".</p>');
                }
            },
            error: function (error) {
                console.error('Error al cargar los productos:', error);
            }
        });
    }

    // Cargar los productos al iniciar
    loadProducts();
});
