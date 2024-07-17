document.addEventListener('DOMContentLoaded', () => {
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
});


function searchTable() {
  // Obtener el valor del input de búsqueda
  let input = document.getElementById("buscar").value.toLowerCase();
  // Obtener todas las filas de la tabla
  let rows = document.querySelectorAll("#contenidoTabla table tbody tr");

  // Iterar sobre cada fila y mostrar/ocultar según el criterio de búsqueda
  rows.forEach(row => {
    let match = false;
    // Obtener las celdas de la fila actual
    let cells = row.getElementsByTagName("td");
    // Iterar sobre las celdas y verificar si alguna coincide con la búsqueda
    Array.from(cells).forEach(cell => {
      let cellText = cell.textContent.toLowerCase();
      if (cellText.includes(input)) {
        match = true;
      }
    });
    // Mostrar u ocultar la fila según el resultado de la búsqueda
    if (match) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}