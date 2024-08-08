document.addEventListener('DOMContentLoaded', function () {
    // Selecciona todos los inputs de tipo date
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const maxYears = 50; // Puedes cambiar esto a cualquier número de años máximo que desees

    dateInputs.forEach(function(input) {
        const errorSpanName = `Error-${input.name}`;
        const errorSpan = document.querySelector(`span[name="${errorSpanName}"]`);

        input.addEventListener('change', function () {
            const fechaString = input.value;
            const validationResult = validateBirthDate(fechaString, maxYears);

            if (typeof validationResult === 'string') {
                errorSpan.textContent = validationResult; // Muestra el mensaje de error
                input.setCustomValidity(validationResult); // Establece el mensaje de error de validación
            } else {
                errorSpan.textContent = ''; // Limpia cualquier mensaje de error
                input.setCustomValidity(''); // Limpia la validez personalizada
            }
        });
    });
});

function validateBirthDate(fechaString, maxYears) {
    const fecha = new Date(fechaString);
    const today = new Date();

    if (isNaN(fecha.getTime())) {
        return "Fecha no válida.";
    }

    if (fecha > today) {
        return "La fecha no puede estar en el futuro.";
    }

    const age = today.getFullYear() - fecha.getFullYear();
    const monthDifference = today.getMonth() - fecha.getMonth();
    const dayDifference = today.getDate() - fecha.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    if (age > maxYears) {
        return "Fecha no válida.";
    }

    return age;
}

