CREATE TABLE CATEGORIAS(
  IdCategoria SERIAL,
  Categoria VARCHAR(50) NOT NULL,
  PRIMARY KEY (IdCategoria));

CREATE TABLE USUARIOS (
  usuario_id SERIAL NOT NULL, 
  user_name varchar(15) NOT NULL UNIQUE, 
  contrasena varchar(15) NOT NULL, 
  email   varchar(30) NOT NULL UNIQUE, 
  PRIMARY KEY (usuario_id));

CREATE TABLE PERSONAS (
  persona_id SERIAL NOT NULL,
  Nombre varchar(35) NOT NULL,
  ApPaterno varchar(35) NOT NULL,
  ApMaterno varchar(35),
  Correo varchar(45) NOT NULL UNIQUE, 
  Telefono varchar(10) NOT NULL, 
  PRIMARY KEY (persona_id));

CREATE TABLE CLIENTES (
  Cliente_id SERIAL NOT NULL,
  persona_id INT NOT NULL, 
  usuario_id int NOT NULL, 
  PRIMARY KEY (Cliente_id),
  FOREIGN KEY(usuario_id) REFERENCES USUARIOS (usuario_id),
  FOREIGN KEY(persona_id) REFERENCES PERSONAS (persona_id));

CREATE TABLE EMPLEADOS (
  empleado_id SERIAL NOT NULL, 
  telefono char(10) NOT NULL, 
  usuario_id int NOT NULL, 
  PRIMARY KEY (empleado_id),
  FOREIGN KEY(usuario_id) REFERENCES USUARIOS (usuario_id));

CREATE TABLE RECETAS (
  recetas_id SERIAL NOT NULL, 
  /*preguntarle al profe "index"  int NOT NULL,*/ 
  nombre varchar(45) NOT NULL, 
  tiempo_preparacion time NOT NULL, 
  Descripcion varchar(255) NOT NULL, 
  empleado_id int NOT NULL, 
  PRIMARY KEY (recetas_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id));

CREATE TABLE PEDIDOS (
  pedido_id SERIAL NOT NULL, 
  mesa int, 
  estado varchar(10) NOT NULL, 
  Cliente_id int NOT NULL, 
  PRIMARY KEY (pedido_id),
  FOREIGN KEY(Cliente_id) REFERENCES CLIENTES (Cliente_id));

CREATE TABLE DETALLES_PEDIDOS (
  detalle_pedido_id SERIAL NOT NULL, 
  cantidad int NOT NULL, 
  fecha_pedido TIMESTAMP NOT NULL , 
  producto_id int NOT NULL, 
  pedido_id int NOT NULL, 
  PRIMARY KEY (detalle_pedido_id),
  FOREIGN KEY(producto_id) REFERENCES PRODUCTOS (producto_id),
  FOREIGN KEY(pedido_id) REFERENCES PEDIDOS (pedido_id)
  );


CREATE TABLE FORMAS_PAGOS_VENTAS (
  forma_pago_id int NOT NULL, 
  venta_id int NOT NULL, 
  PRIMARY KEY (forma_pago_id, venta_id),
  FOREIGN KEY(forma_pago_id) REFERENCES FORMAS_PAGOS (forma_pago_id),
  FOREIGN KEY(venta_id) REFERENCES VENTAS (venta_id));

CREATE TABLE FORMAS_PAGOS (
  forma_pago_id SERIAL NOT NULL, 
  nombre varchar(20) NOT NULL, 
  PRIMARY KEY (forma_pago_id));


CREATE TABLE VENTAS (
  venta_id SERIAL NOT NULL, 
  IVA_pagar   float NOT NULL, 
  pago_total  float NOT NULL, 
  fecha_venta  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  descuento_venta int, 
  empleado_id int NOT NULL, 
  Cliente_id  int NOT NULL, 
  PRIMARY KEY (venta_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id),
  FOREIGN KEY(Cliente_id) REFERENCES CLIENTES (Cliente_id));

CREATE TABLE DETALLES_VENTA (
	detalle_venta_id SERIAL NOT NULL,
	subtotal float NOT NULL,
	descuento_articulo int NOT NULL,
	p_cantidad INT NOT NULL,
	venta_id int NOT NULL,
	producto_id INT NOT NULL,
	PRIMARY KEY (detalle_venta_id),
	FOREIGN KEY(venta_id) REFERENCES VENTAS (venta_id),
	FOREIGN KEY (producto_id) REFERENCES PRODUCTOS(producto_id));

CREATE TABLE PRODUCTOS (
	producto_id SERIAL NOT NULL,
	nombre varchar(25) NOT NULL,
	precio float NOT NULL,
	descripcion varchar(125) NOT NULL,
	stock int NOT NULL,
	IdCategoria INT NOT NULL,
	PRIMARY KEY (producto_id)
	FOREIGN KEY(IdCategoria) REFERENCES CATEGORIAS (IdCategoria));

CREATE TABLE TIPOS (
	tipos_id SERIAL NOT NULL,
	producto_id int NOT NULL,
	nombre varchar(15) NOT NULL,
	PRIMARY KEY (tipos_id),
	FOREIGN KEY(producto_id) REFERENCES PRODUCTOS (producto_id));

CREATE TABLE PEDIDOS (
	pedido_id SERIAL NOT NULL,
	mesa int,
	producto_id int NOT NULL,
	detalle_venta_id int NOT NULL,
	PRIMARY KEY (pedido_id),
	FOREIGN KEY(producto_id) REFERENCES PRODUCTOS (producto_id),
	FOREIGN KEY(detalle_venta_id) REFERENCES DETALLES_VENTA (detalle_venta_id));



/*BITACORA PARA REGISTRAR CAMBIOS DE RECETAS*/
CREATE TABLE BITACORA_RECETAS(
 		id			SERIAL,
		table_name	TEXT NOT NULL,
		table_id	TEXT NOT NULL,
		description	TEXT NOT NULL,
		created_at	TIMESTAMP DEFAULT NOW(),
    	operacion   TEXT NOT NULL,
		PRIMARY KEY(id)
);

/*FUNCION DE REGISTRO DE CAMBIOS DE RECETAS*/

CREATE OR REPLACE FUNCTION registrar_cambios_recetas() RETURNS trigger AS $BODY$
	DECLARE
		vDescription TEXT;
		vId INT;
		vReturn RECORD;
		vOperacion TEXT;
	BEGIN
		vDescription := TG_TABLE_NAME || ' ';
		 IF (TG_OP = 'INSERT') THEN
			vId := NEW.recetas_id;
			vDescription := vDescription || 'added. Id: ' || vId;
			vOperacion := 'INSERT';
			vReturn := NEW;
		 ELSIF (TG_OP = 'UPDATE') THEN
			vId := NEW.recetas_id;
			vDescription := vDescription || 'updated. Id: ' || vId;
			vOperacion := 'UPDATE';
			vReturn := NEW;
		 ELSIF (TG_OP = 'DELETE') THEN
			vId := OLD.recetas_id;
			vDescription := vDescription || 'deleted. Id: ' || vId;
			vOperacion := 'DELETE';
			vReturn := OLD;
		 END IF;

	  RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;

  INSERT INTO bitacora_recetas
		 (table_name, table_id, description, created_at, Operacion)  
		 VALUES
		 (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);

	  RETURN vReturn;
	END $BODY$ LANGUAGE plpgsql;

  CREATE TRIGGER registrar_cambios_recetas AFTER INSERT OR UPDATE OR DELETE
	ON RECETAS FOR EACH ROW
	EXECUTE PROCEDURE registrar_cambios_recetas();

/*BITACORA DE VENTAS*/
CREATE TABLE BITACORA_VENTAS(
 		id			SERIAL,
		table_name	TEXT NOT NULL,
		table_id	TEXT NOT NULL,
		description	TEXT NOT NULL,
		created_at	TIMESTAMP DEFAULT NOW(),
    operacion   TEXT NOT NULL,
		PRIMARY KEY(id)
);

/*FUNCION DE REGISTRO DE VENTAS*/

CREATE OR REPLACE FUNCTION registrar_ventas() RETURNS trigger AS $BODY$
	DECLARE
		vDescription TEXT;
		vId INT;
		vReturn RECORD;
		vOperacion TEXT;
	BEGIN
		vDescription := TG_TABLE_NAME || ' ';
		 IF (TG_OP = 'INSERT') THEN
			vId := NEW.ventas_id;
			vDescription := vDescription || 'added. Id: ' || vId;
			vOperacion := 'INSERT';
			vReturn := NEW;
		 ELSIF (TG_OP = 'UPDATE') THEN
			vId := NEW.ventas_id;
			vDescription := vDescription || 'updated. Id: ' || vId;
			vOperacion := 'UPDATE';
			vReturn := NEW;
		 ELSIF (TG_OP = 'DELETE') THEN
			vId := OLD.ventas_id;
			vDescription := vDescription || 'deleted. Id: ' || vId;
			vOperacion := 'DELETE';
			vReturn := OLD;
		 END IF;

	  RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;

  INSERT INTO bitacora_ventas
		 (table_name, table_id, description, created_at, Operacion)  
		 VALUES
		 (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);

	  RETURN vReturn;
	END $BODY$ LANGUAGE plpgsql;

/*TRIGGER DE REGISTRO DE VENTAS*/
  
  CREATE TRIGGER registrar_ventas BEFORE INSERT OR UPDATE OR DELETE
	ON VENTAS FOR EACH ROW
	EXECUTE PROCEDURE registrar_ventas();



--FUNCION DE RESTAR A STOCK--
CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $cuerpo$
BEGIN
    -- Actualiza el stock del producto basado en la cantidad en detalles_venta
    UPDATE productos
    SET stock = stock - NEW.p_cantidad
    WHERE producto_id = NEW.producto_id;

    RETURN NEW;  -- Retorna la fila para el trigger AFTER
END;
$cuerpo$ LANGUAGE plpgsql;

--TRIGGER PARA RESTAR STOCK

CREATE TRIGGER actualizar_stock_venta
AFTER INSERT OR UPDATE
ON detalles_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_venta();


--CONSULTAS 
SELECT *FROM PRODUCTOS
SELECT *FROM VENTAS
SELECT *FROM DETALLES_VENTA

--TRANSACCION USANDO SECUENCIAS
--SECUENCIA DE VENTAS	
	CREATE SEQUENCE ventas_seq
START WITH 1
INCREMENT BY 1
MINVALUE 1
NO MAXVALUE
CYCLE;

BEGIN;
--Insertar una nueva venta
INSERT INTO VENTAS (Venta_Id, IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id)
VALUES (nextval('ventas_seq') ,0.16, 150.00, '2021-06-01', 0, 1, 1);


--Insertar detalles de la venta
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad,producto_id)
VALUES (currval('ventas_seq'), 250.0, 0, 5, 4),
		(currval('ventas_seq'), 100.0, 0, 2, 5);
    
COMMIT ;

--CONSULTAS 
SELECT *FROM PRODUCTOS
SELECT *FROM VENTAS
SELECT *FROM DETALLES_VENTA


--TRANSACCION USANDO RETURNING

DO $cuerpo$
DECLARE
v_venta_id INT;
BEGIN
--Insertar una nueva venta y obtener el ID generado
WITH nueva_venta AS (
    INSERT INTO ventas ( IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) 
    VALUES (0.16, 100.00, '2021-06-01', 0, 1, 1)
    RETURNING venta_id
)
--Obtener el ID de la venta recién insertada
SELECT venta_id INTO v_venta_id FROM nueva_venta;

--Generar un detalle de venta con el return del id de venta
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad,producto_id)
VALUES (v_venta_id, 250.0, 0, 5, 4),
		(v_venta_id, 100.0, 0, 2, 5);


COMMIT;
END;
$cuerpo$ LANGUAGE plpgsql;

--CONSULTAS 
SELECT *FROM PRODUCTOS
SELECT *FROM VENTAS
SELECT *FROM DETALLES_VENTA


/*FUNCION PARA PROTEGER DATOS*/
CREATE OR REPLACE FUNCTION proteger_datos()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

/*TRIGGER PARA PROTEGER DATOS DE LAS BITACORAS*/
CREATE TRIGGER trigger_proteger_datos_bitacoras
BEFORE DELETE,UPDATE ON BITACORA_RECETAS, BITACORA_VENTAS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

/*TRIGGER PARA PROTEGER DATOS DE LAS FORMAS DE PAGO*/
CREATE TRIGGER trigger_evitar_borrado
BEFORE DELETE ON FORMAS_PAGOS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

/*TRANSSACCIONES VENTAS*/

BEGIN 

-- 1. Insertar una nueva venta
INSERT INTO VENTAS ( IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id)
VALUES ( 0.16, 100.00, '2021-06-01', 0, 1, 1);


-- 2. Insertar detalles de la venta
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad)
VALUES (5, 250.0, 25, 5);

COMMIT

BEGIN 
INSERT INTO VENTAS ( IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) 
VALUES ( 0.16, 100.00, '2021-06-01', 0, 1, 1);
COMMIT

/*TRANSSACCIONES PEDIDOS*/
BEGIN 
INSERT INTO PEDIDOS ( mesa, estado, Cliente_id)
VALUES ( 1, 'Pendiente', 1);

BEGIN 
INSERT INTO PEDIDOS ( mesa, estado, Cliente_id)
VALUES ( NULL, 'Pendiente', 2);

/*FUNCION PARA CALCULO DE SUBTOTAL*/

CREATE OR REPLACE  FUNCTION  calcular_subtotal(cantidad INT, f_producto_id INT) 
RETURNS DECIMAL (10,2) AS $cuerpo$

    DECLARE
	f_precio DECIMAL(10, 2);
	subtotal DECIMAL(10, 2);
BEGIN

    -- Obtener el precio del producto desde la tabla productos
    SELECT precio INTO f_precio
    FROM productos
    WHERE f_producto_id = producto_id;

    -- Calcular el subtotal
	subtotal := cantidad * f_precio;
	
	
		 RAISE NOTICE 'TRIGGER DISPARADO';
	RETURN subtotal;

END; $cuerpo$ LANGUAGE plpgsql;

 SELECT calcular_subtotal(2,4)
 
 
/*TRIGGEER*/
CREATE TRIGGER subtotal_detalle_venta
BEFORE INSERT ON detalle_venta
FOR EACH ROW
 EXECUTE FUNCTION calcular_subtotal(NEW.p_cantidad, NEW.producto_id)
 
/*VISTAS*/

CREATE VIEW VISTA_VENTAS AS 

/*----------------------------------------INSERT INTO---------------------------------------------*//

/*TABLA USUARIOS*/
INSERT INTO USUARIOS (user_name, contrasena, email) VALUES ('jdoe', 'password123', 'jdoe@example.com');
INSERT INTO USUARIOS (user_name, contrasena, email) VALUES ('asmith', 'securepass', 'asmith@example.com');
INSERT INTO USUARIOS (user_name, contrasena, email) VALUES ('mjackson', 'moonwalk1', 'mjackson@example.com');
INSERT INTO USUARIOS (user_name, contrasena, email) VALUES ('lking', 'lion123', 'lking@example.com');
INSERT INTO USUARIOS (user_name, contrasena, email) VALUES ('kbryant', 'mamba24', 'kbryant@example.com');

/*TABLA PERSONAS*/
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('John', 'Doe', 'Smith', 'john.doe@example.com', '1234567890');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Anna', 'Smith', 'Johnson', 'anna.smith@example.com', '0987654321');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Michael', 'Jackson', 'Brown', 'michael.jackson@example.com', '1122334455');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Linda', 'King', 'White', 'linda.king@example.com', '2233445566');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Kobe', 'Bryant', 'Black', 'kobe.bryant@example.com', '3344556677');

/*TABLA CLIENTES*/
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (1, 1);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (2, 2);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (3, 3);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (4, 4);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (5, 5);

/*TABLA EMPLEADOS*/
INSERT INTO EMPLEADOS (salario, fecha_pago, telefono, usuario_id) VALUES (1600, '2024-07-01', '1234567890', 1);
INSERT INTO EMPLEADOS (salario, fecha_pago, telefono, usuario_id) VALUES (1800, '2024-07-15', '0987654321', 2);
INSERT INTO EMPLEADOS (salario, fecha_pago, telefono, usuario_id) VALUES (1600, '2024-07-10', '1122334455', 3);
INSERT INTO EMPLEADOS (salario, fecha_pago, telefono, usuario_id) VALUES (1500, '2024-07-20', '2233445566', 4);
INSERT INTO EMPLEADOS (salario, fecha_pago, telefono, usuario_id) VALUES (1900, '2024-07-25', '3344556677', 5);

/*TABLA RECETAS*/
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Pasta Carbonara', '00:30:00', 'Delicious Italian pasta', 1);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Chicken Curry', '01:00:00', 'Spicy Indian chicken curry', 2);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Beef Stroganoff', '00:45:00', 'Creamy Russian beef dish', 3);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Caesar Salad', '00:20:00', 'Fresh Caesar salad with homemade dressing', 4);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Chocolate Cake', '01:30:00', 'Rich chocolate dessert', 5);
SELECT *FROM BITACORA_RECETAS
/*TABLA PEDIDOS*/
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (1, 'Pendiente', 1);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (2, 'En Proceso', 2);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (3, 'Completado', 3);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (4, 'Cancelado', 4);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (5, 'Pendiente', 5);

/*TABLA DETALLE_PEDIDO*/
INSERT INTO DETALLES_PEDIDOS (cantidad, fecha_pedido, producto_id, pedido_id) VALUES (2, '2024-07-01', 1, 1);
INSERT INTO DETALLES_PEDIDOS (cantidad, fecha_pedido, producto_id, pedido_id) VALUES (1, '2024-07-02', 2, 2);
INSERT INTO DETALLES_PEDIDOS (cantidad, fecha_pedido, producto_id, pedido_id) VALUES (3, '2024-07-03', 3, 3);
INSERT INTO DETALLES_PEDIDOS (cantidad, fecha_pedido, producto_id, pedido_id) VALUES (4, '2024-07-04', 4, 4);
INSERT INTO DETALLES_PEDIDOS (cantidad, fecha_pedido, producto_id, pedido_id) VALUES (5, '2024-07-05', 5, 5);

/*TABLA FORMAS_PAGOS_VENTAS*/
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (1, 1);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (2, 2);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (3, 3);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (4, 4);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (5, 5);
SELECT *FROM formas_pagos_ventas

/*TABLA FORMAS_PAGOS*/
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Crédito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Débito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Efectivo');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Transferencia ');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('PayPal');

/*TABLAS VENTAS*/
INSERT INTO VENTAS (IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES (16.0, 100.0, '2024-07-01 10:00:00', 5, 1, 1);
INSERT INTO VENTAS (IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES (16.0, 200.0, '2024-07-02 11:00:00', 10, 2, 2);
INSERT INTO VENTAS (IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES (16.0, 150.0, '2024-07-03 12:00:00', 15, 3, 3);
INSERT INTO VENTAS (IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES (16.0, 300.0, '2024-07-04 13:00:00', 20, 4, 4);
INSERT INTO VENTAS (IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES (16.0, 250.0, '2024-07-05 14:00:00', 25, 5, 5);

/*TABLA_DETALLES_VENTA*/
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad) VALUES (1, 100.0, 5, 2);
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad) VALUES (2, 200.0, 10, 3);
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad) VALUES (3, 150.0, 15, 1);
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad) VALUES (4, 300.0, 20, 4);
INSERT INTO DETALLES_VENTA (venta_id, subtotal, descuento_articulo, p_cantidad) VALUES (5, 250.0, 25, 5);

/*TABLA PRODUCTOS*/
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, categoria) VALUES ('Producto A', 10.0, 'Descripción A', 100, 'Categoría 1');
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, categoria) VALUES ('Producto B', 20.0, 'Descripción B', 200, 'Categoría 2');
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, categoria) VALUES ('Producto C', 30.0, 'Descripción C', 300, 'Categoría 3');
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, categoria) VALUES ('Producto D', 40.0, 'Descripción D', 400, 'Categoría 4');
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, categoria) VALUES ('Producto E', 50.0, 'Descripción E', 500, 'Categoría 5');

/*TABLA TIPOS*/
INSERT INTO TIPOS (producto_id, nombre) VALUES (1, 'Tipo 1');
INSERT INTO TIPOS (producto_id, nombre) VALUES (2, 'Tipo 2');
INSERT INTO TIPOS (producto_id, nombre) VALUES (3, 'Tipo 3');
INSERT INTO TIPOS (producto_id, nombre) VALUES (4, 'Tipo 4');
INSERT INTO TIPOS (producto_id, nombre) VALUES (5, 'Tipo 5');

/*TABLA BITACORA_RECETAS*/
INSERT INTO BITACORA_RECETAS (table_name, table_id, description, operacion) VALUES ('RECETAS', '1', 'Descripción de cambio 1', 'INSERT');
INSERT INTO BITACORA_RECETAS (table_name, table_id, description, operacion) VALUES ('RECETAS', '2', 'Descripción de cambio 2', 'UPDATE');
INSERT INTO BITACORA_RECETAS (table_name, table_id, description, operacion) VALUES ('RECETAS', '3', 'Descripción de cambio 3', 'DELETE');
INSERT INTO BITACORA_RECETAS (table_name, table_id, description, operacion) VALUES ('RECETAS', '4', 'Descripción de cambio 4', 'INSERT');
INSERT INTO BITACORA_RECETAS (table_name, table_id, description, operacion) VALUES ('RECETAS', '5', 'Descripción de cambio 5', 'UPDATE');




