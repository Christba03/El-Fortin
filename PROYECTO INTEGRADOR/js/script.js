// Obtener todos los enlaces de navegación
const navLinks = document.querySelectorAll('#nav-links .nav-link');

// Obtener la URL actual y extraer el nombre del archivo
const currentUrl = window.location.pathname.split('/').pop();

// Iterar sobre los enlaces y añadir la clase 'active' al enlace que coincide con la URL actual
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentUrl) {
    link.classList.add('active');
  }
});