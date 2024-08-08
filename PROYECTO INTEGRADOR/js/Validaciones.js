

/*--Validacion de maximo caracteres--*/
function validateMaxLength(input, maxLength) {
    return input.length <= maxLength ? "Entrada válida." : `La entrada no puede tener más de ${maxLength} caracteres.`;
}

// Ejemplo de uso
const input = "Este es un texto de ejemplo";
const maxLength = 20;
console.log(validateMaxLength(input, maxLength));


/*--Validacion de copy paste--*/
//html//
function handlePaste(event) {
    event.preventDefault();
    alert("El copiar y pegar no está permitido en este campo.");
}

function handleCopy(event) {
    event.preventDefault();
    alert("El copiar y pegar no está permitido en este campo.");
}

/*--Validacion de evitar inyecciones sql o javascript--*/
        function validateInput() {
            const input = document.getElementById('userInput').value;
            const sanitizedInput = sanitizeInput(input);

            if (sanitizedInput) {
                alert("Entrada válida: " + sanitizedInput);
            } else {
                alert("Entrada no válida. Intenta de nuevo.");
            }
        }

        function sanitizeInput(input) {
            // Elimina caracteres potencialmente peligrosos
            const sanitized = input.replace(/['";<>&]/g, "");
            // Comprueba si la entrada contenía caracteres potencialmente peligrosos
            const isValid = (sanitized === input);
            
            return isValid ? sanitized : null;
        }
