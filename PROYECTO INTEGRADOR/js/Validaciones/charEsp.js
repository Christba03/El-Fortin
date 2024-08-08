document.addEventListener('DOMContentLoaded', function () {
    const textInputs = document.querySelectorAll('textarea');

    textInputs.forEach(function(input) {
        const errorSpan = document.querySelector(`span#${input.name}`);

        input.addEventListener('input', function () {
            const isValid = validarCharEsp(input.value);

            if (!isValid) {
                errorSpan.textContent = 'No se permiten caracteres especiales.';
                input.setCustomValidity('Entrada no válida');
            } else {
                errorSpan.textContent = '';
                input.setCustomValidity('');
            }
        });
    });
});

function validarCharEsp(value) {
    const regex = /[/'";<>&]/g;
    return !regex.test(value);
}
