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


function searchTable(){
   // Obtener el valor del input de búsqueda
   let input = document.getElementById("buscar").value.toLowerCase();
   // Obtener la tabla y sus filas
   let table = document.getElementById("table");
   let tr = table.getElementsByTagName("tr");

   // Iterar sobre todas las filas de la tabla (excepto la cabecera)
   for (let i = 1; i < tr.length; i++) {
       // Ocultar la fila por defecto
       tr[i].style.display = "none";

       // Obtener todas las celdas de la fila actual
       let td = tr[i].getElementsByTagName("td");

       // Iterar sobre todas las celdas de la fila actual
       for (let j = 0; j < td.length; j++) {
           if (td[j]) {
               // Si el contenido de la celda coincide con la búsqueda, mostrar la fila
               if (td[j].innerHTML.toLowerCase().indexOf(input) > -1) {
                   tr[i].style.display = "";
                   break;
               }
           }
       }
   }
}