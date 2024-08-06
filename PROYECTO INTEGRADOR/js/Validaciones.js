
/*--Validacion de fecha de nacimiento--*/
function validateBirthDate(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        return "Fecha no válida.";
    }

    if (birthDate > today) {
        return "La fecha de nacimiento no puede estar en el futuro.";
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    if (age < 110) {
        return age;
    }

    return "Fecha no valida";
}

// Ejemplo de uso
const birthDateString = "2005-07-15"; // formato YYYY-MM-DD
console.log(validateBirthDate(birthDateString));


/*--Validacion de alfanumerico--*/
function validarLetras(e,field){
    const key = e.keyCode ? e.keyCode : e.which;

    console.log(event);
    console.log(field);
    if (key === 8) {
        return true;
    }
    if (key > 47 && key < 58) {
    return false;
    }
    if (key ===(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+([a-zA-ZÀ-ÿ\u00f1\u00d1])[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g)){
    return true;
    } else {
        return false

    }

}

/*--Validacion de flotantes--*/
function onlyFloat(e, field) {
    const key = e.keyCode ? e.keyCode : e.which;
    // backspace
    if (key === 8) {
        return true;
    }
    // 0-9 a partir del .decimal
    if (field.value === '.') {
        field.value = '0';
        return false;
    }
    if (field.value !== '') {
        if ((field.value.indexOf('.')) > 0) {
            if (key > 47 && key < 58) {
                if (field.value === '') {
                    return true;
                }
                const regexp = /[0-9]{2}$/;
                return !(regexp.test(field.value));
            } else {
                return false;
            }
        }
    }
    // 0-9
    if (key > 47 && key < 58) {
        if (field.value === '') {
            return true;
        }
        const regexp = /[0-9]{6}/;
        return !(regexp.test(field.value));
    }
    // .
    if (key === 46) {
        if (field.value === '') {
            return false;
        }
        const regexp = /^[0-9]+$/;
        return regexp.test(field.value);
    }
    // other key
    return false;
}

/*--Validacion de correo--*/
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

// Ejemplo de uso
const email = "example@example.com";
console.log(validateEmail(email));

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

  // Función para establecer la fecha máxima permitida
  function setMaxDate(inputId, maxYearsAgo) {
    // Obtiene la fecha actual
    var today = new Date();

    // Calcula la fecha hace maxYearsAgo años
    var maxDate = new Date(today.getFullYear() - maxYearsAgo, today.getMonth(), today.getDate());

    // Formatea la fecha en el formato 'YYYY-MM-DD' para el atributo 'max'
    var maxDateString = maxDate.toISOString().split('T')[0];

    // Establece el atributo 'max' del input date
    document.getElementById(inputId).setAttribute('max', maxDateString);
  }

  // Llamada a la función para establecer el máximo de 50 años atrás
  setMaxDate('birthdate', 50);