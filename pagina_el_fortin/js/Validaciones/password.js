document.addEventListener('DOMContentLoaded', function () {
    const textInputs = document.querySelectorAll('input[type="password"]');

    textInputs.forEach(function(input) {
        const errorSpan = document.querySelector(`span#${input.name}`);

        input.addEventListener('input', function () {
            const isValid = validarPassword(input.value);

            if (!isValid) {
                errorSpan.textContent = 'No se permiten los siguientes caracteres especiales. (";<>&' + "')";
                input.setCustomValidity('Entrada no válida');
            } else {
                errorSpan.textContent = '';
                input.setCustomValidity('');
            }
        });
    });
});

function validarPassword(value) {
    const regex = /['";<>&]/g;
    return !regex.test(value);
}
