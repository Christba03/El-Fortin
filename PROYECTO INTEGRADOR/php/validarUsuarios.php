<?php
 
 require 'conexion.php';

 session_start();

 $correo=$_POST['correo'];
 $contrasena=$_POST['contrasena'];

 $query=("SELECT * FROM vista_usuarios WHERE contrasena='$contrasena' AND correo='$correo'");

 
 $consulta =pg_query($conn, $query);
 $cantidad=pg_num_rows($consulta);

 header('Content-Type: application/json');

if ($cantidad > 0) {
    $_SESSION['correo'] = $correo;
    echo json_encode(['status' => 'success', 'message' => 'Iniciando Sesion.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
}
?>