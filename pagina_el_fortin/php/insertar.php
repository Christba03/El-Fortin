<?php

require 'conexion.php';
// Datos de entrada
$nombre = $_REQUEST['letras1'];
$apellidoP = $_REQUEST['letras2'];
$apellidoM = $_REQUEST['letras3'];
$correo = $_REQUEST['correo1'];
$numeroTelefono = $_REQUEST['numeroTelefono'];
$nombreUsuario = $_REQUEST['letras4'];
$contrasena = $_REQUEST['contrasena1'];
$rol = $_REQUEST['rol'];

// Preparar la consulta de inserción
$query = "INSERT INTO PERSONAS (nombre, appaterno, apmaterno, correo, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING persona_id";
$params = array($nombre, $apellidoP, $apellidoM, $correo, $numeroTelefono);

// Ejecutar la consulta y obtener el ID del registro insertado

$result = pg_query_params($conn, $query, $params);
if($result){
    $row = pg_fetch_assoc($result);
    $persona_id = $row['persona_id'];

    $query2 = "INSERT INTO USUARIOS (user_name, contrasena, persona_id, rol) VALUES ($1, $2, $3, $4)";
    $params2 = array($nombreUsuario, $contrasena, $persona_id, $rol);

    // Ejecutar la consulta de inserción en USUARIOS
    $result2 = pg_query_params($conn, $query2, $params2);

    if ($result2) {
        echo "<script>alert('Usuario creado exitosamente.'); window.location.href='index.php';</script>";
    } else {
        echo "<script>alert('Error al crear usuario: " . pg_last_error($conn) . "'); window.location.href='index.php';</script>";
    }
}else{
    echo "<script>alert('Error al crear usuario: " . pg_last_error($conn) . "'); window.location.href='index.php';</script>";
}

?>