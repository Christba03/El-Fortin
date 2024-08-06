document.addEventListener('DOMContentLoaded', function () {
    // Selecciona todos los inputs de tipo text con name que comienzan con 'letras'
    const textInputs = document.querySelectorAll('input[type="text"][name^="letras"]');

    textInputs.forEach(function(input) {
        const errorSpan = document.querySelector(`span#${input.name}`);

        input.addEventListener('input', function () {
            const isValid = validarTexto(input.value);

            if (!isValid) {
                errorSpan.textContent = 'Solo se permiten caracteres alfabéticos.';
                input.setCustomValidity('Entrada no válida'); // Establece el mensaje de error de validación
            } else {
                errorSpan.textContent = ''; // Limpia cualquier mensaje de error
                input.setCustomValidity(''); // Limpia la validez personalizada
            }
        });
    });
});

function validarTexto(value) {
    // Expresión regular para letras incluyendo acentos y ñ/Ñ
    const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]*$/;
    return regex.test(value);
}
