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
                var myModal = new bootstrap.Modal(document.getElementById('modalBebida'), {});
                myModal.show();
            } else {
                console.error('Producto no encontrado');
            }
        })
        .catch(error => console.error('Error:', error));
}

$(document).ready(function () {
    const apiUrl = 'https://fortin.christba.com/api/products';

    function loadDrinks() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                // Filtrar los productos de la categoría "Bebidas"
                const drinks = response.filter(product => product.category_name === "Bebidas");
                let productsContainer = $('#products-container');
                productsContainer.empty();

                // Renderizar los productos filtrados
                drinks.forEach(drink => {
                    productsContainer.append(`
                        <div class="card-product">
                            <div class="container-img">
                                <img src="${drink.image_url || 'placeholder.jpg'}" alt="${drink.name}" />
                            </div>
                            <div class="content-card-product">
                                <h3>${drink.name}</h3>
                                <p>${drink.description || 'Sin descripción'}</p>
                                <p class="precio">$${drink.price}</p>
                                <div class="button-container">
                                    <button class="add-cart" aria-label="Add to cart">
                                        <i class="fa-solid fa-clipboard"></i>
                                    </button>
                                    <button class="add-cart" aria-label="View details" onclick="viewDetails('${drink.id}')">
                                        <i class="fa-solid fa-circle-info"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (error) {
                console.error('Error al cargar los productos:', error);
            }
        });
    }

    // Cargar los productos al iniciar
    loadDrinks();
});



