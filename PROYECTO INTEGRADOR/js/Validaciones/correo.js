document.addEventListener('DOMContentLoaded', function () {
    const textInputs = document.querySelectorAll('input[type="email"]');

    textInputs.forEach(function(input) {
        const errorSpan = document.querySelector(`span#${input.name}`);

        input.addEventListener('input', function () {
            let isValid = validarCorreo(input.value);

            if (input.type === 'email') {
                isValid = validarEmail(input.value) && isValid;
                if (!validarEmail(input.value)) {
                    errorSpan.textContent = 'El formato del correo electrónico no es válido.';
                } else if (!validarCorreo(input.value)) {
                    errorSpan.textContent = 'No se permiten los siguientes caracteres especiales. (";<>&' + "')" ;
                } else {
                    errorSpan.textContent = '';
                }
            } else {
                if (!isValid) {
                    errorSpan.textContent = 'No se permiten los siguientes caracteres especiales. (";<>&' + "')" ;
                } else {
                    errorSpan.textContent = '';
                }
            }

            input.setCustomValidity(isValid ? '' : 'Entrada no válida');
        });
    });
});

function validarCorreo(value) {
    const regex = /['";<>&]/g;
    return !regex.test(value);
}

function validarEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}
