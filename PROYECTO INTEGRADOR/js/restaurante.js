// Evento que se dispara al hacer clic en el botón de editar un producto.
function viewDetails(drinkId) {
    // Aquí deberías tener la URL de la API con el ID de la bebida
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const drink = data.drinks[0];
            // Llena el modal con los datos
            $('#modalBebidaTitle').text(drink.strDrink);
            $('#modalBebidaImage').attr('src', drink.strDrinkThumb);
            $('#modalBebidaDescription').text(drink.strInstructions);
            // Muestra el modal
            var myModal = new bootstrap.Modal(document.getElementById('modalBebida'), {});
            myModal.show();
        })
        .catch(error => console.error('Error:', error));
}

$(document).ready(function (){
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';

    let localDrinks = [];

    function loadDrinks() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                localDrinks = response;
                let productsContainer = $('#products-container');
                productsContainer.empty();

                localDrinks.drinks.forEach(drink => {
                    productsContainer.append(`
                        <div class="card-product">
                            <div class="container-img">
                                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
                            </div>
                            <div class="content-card-product">
                            <h3>${drink.strDrink}</h3>
                            <div class="button-container">
                                <button class="add-cart" aria-label="Add to cart">
                                    <i class="fa-solid fa-clipboard"></i>
                                </button>
                                <button class="add-cart" aria-label="Add to cart" onclick="viewDetails(${drink.idDrink})">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                                <p class="precio">$23 <span>$22</span></p>
                                <input type="hidden" value="${drink.idDrink}" class="drink-id">
                            </div>
                        </div>
                    `);
                });
            }
        });
    }
    loadDrinks();
});