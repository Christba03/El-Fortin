document.getElementById('myForm').addEventListener('submit', function(event) {
    // Selecciona todos los inputs de tipo texto
    const inputs = document.querySelectorAll('input[type="textarea"][name^="charEsp"]');
    const ProhibidosCharsRegex = /['";<>&]/g;
    let isValid = true;

    inputs.forEach(input => {
        const errorSpan = document.querySelector(`span[name="Error-${input.name}"]`);
        const value = input.value;

        // Validación del valor del campo
        const validationResult = ProhibidosCharsRegex.test(value)
            ? 'El campo no debe contener los caracteres siguientes: [\'";<>&]'
            : '';

        if (validationResult) {
            errorSpan.textContent = validationResult; // Muestra el mensaje de error
            input.setCustomValidity(validationResult); // Establece el mensaje de error de validación
            isValid = false;
        } else {
            errorSpan.textContent = ''; // Limpia cualquier mensaje de error
            input.setCustomValidity(''); // Limpia la validez personalizada
        }
    });

    if (!isValid) {
        event.preventDefault(); // Evita el envío del formulario si hay errores
    }
});