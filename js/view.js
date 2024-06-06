document.addEventListener("DOMContentLoaded", function() {
    // Selecciona el enlace para abrir la ventana modal
    var openModalLink = document.querySelector(".open-modalview");
    
    // Selecciona la ventana modal
    var modal = document.getElementById("myModalView");

    // Selecciona el elemento de cierre de la ventana modal
    var span = document.getElementsByClassName("closeView")[0];

    // Agrega un evento de clic al enlace para abrir la ventana modal
    openModalLink.addEventListener("click", function(event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        modal.style.display = "block"; // Muestra la ventana modal
    });

    // Cuando el usuario hace clic en <span> (x), cierra la ventana modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Cuando el usuario hace clic en cualquier parte fuera de la ventana modal, ciérrala
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});