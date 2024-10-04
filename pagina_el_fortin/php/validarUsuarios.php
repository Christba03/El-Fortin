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
    $usuario = pg_fetch_assoc($consulta);
    $_SESSION['correo'] = $correo;
    $_SESSION['rol'] = $usuario['rol']; // Suponiendo que tienes una columna 'rol' en tu tabla de usuarios

    if ($usuario['rol'] == 'administrador') {
        echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso.', 'redirect' => './index.php']);
    } else {
        echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso.', 'redirect' => './index.php']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos.']);
}
?>