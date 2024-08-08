        // Obtener el elemento input de tipo date
        const dateInput = document.getElementById('fecha');

        // Verificar si el campo de fecha ya tiene un valor
        if (!dateInput.value) {
            // Obtener la fecha actual en formato YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];

            // Establecer la fecha actual como el valor predeterminado
            dateInput.value = today;
        }