<?php
include 'conexion.php';

$id = $_GET['id'];

$query = "DELETE FROM usuarios WHERE usuario_id = $id";
$result = pg_query($conn, $query);

if ($result) {
   header('Location: paginas/usuarios.php');
} else {
    echo "Error al eliminar usuario.";
}
?>