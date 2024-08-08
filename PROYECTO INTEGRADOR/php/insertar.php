<?php

require 'conexion.php';
// Datos de entrada
$nombre = $_REQUEST['nombre'];
$apellidoP = $_REQUEST['apellidoP'];
$apellidoM = $_REQUEST['apellidoM'];
$correo = $_REQUEST['correo'];
$numeroTelefono = $_REQUEST['numeroTelefono'];
$nombreUsuario = $_REQUEST['nombreUsuario'];
$contrasena = $_REQUEST['contrasena'];

// Preparar la consulta de inserción
$query = "INSERT INTO PERSONAS (nombre, appaterno, apmaterno, correo, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING persona_id";
$params = array($nombre, $apellidoP, $apellidoM, $correo, $numeroTelefono);

// Ejecutar la consulta y obtener el ID del registro insertado

$result = pg_query_params($conn, $query, $params);
if($result){
    $row = pg_fetch_assoc($result);
    $persona_id = $row['persona_id'];

    $query2 = "INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ($1, $2, $3)";
    $params2 = array($nombreUsuario, $contrasena, $persona_id);

    // Ejecutar la consulta de inserción en USUARIOS
    $result2 = pg_query_params($conn, $query2, $params2);

    if ($result2) {
        echo "<script>alert('Usuario creado exitosamente.'); window.location.href='index.php';</script>";
    } else {
        echo "<script>alert('Error al crear usuario.'); window.location.href='index.php';</script>";
    }
}else{
    echo "<script>alert('Error al crear usuario.'); window.location.href='index.php';</script>";
}

?>