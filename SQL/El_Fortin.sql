CREATE EXTENSION pgcrypto;

CREATE TABLE CATEGORIAS(
  IdCategoria SERIAL,
  Categoria VARCHAR(50) NOT NULL,
  PRIMARY KEY (IdCategoria)
);

CREATE TABLE PERSONAS (
  persona_id SERIAL NOT NULL,
  Nombre varchar(35) NOT NULL,
  ApPaterno varchar(35) NOT NULL,
  ApMaterno varchar(35),
  Correo varchar(45) NOT NULL UNIQUE,
  CONSTRAINT correo_formato_correcto CHECK (Correo ~ '^[^@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), 
  Telefono varchar(10) NOT NULL, 	
  PRIMARY KEY (persona_id)
);

CREATE TABLE COMENTARIOS(
	comentario_id SERIAL NOT NULL,
	asunto VARCHAR (20) NOT NULL,
	comentario TEXT NOT NULL,
	fecha TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY(comentario_id)
);

CREATE TABLE FORMAS_PAGOS (
  forma_pago_id SERIAL NOT NULL, 
  nombre varchar(20) NOT NULL, 
  PRIMARY KEY (forma_pago_id)
);

CREATE TABLE USUARIOS (
  usuario_id SERIAL NOT NULL, 
  user_name varchar(15) NOT NULL UNIQUE, 
  contrasena TEXT NOT NULL, 
  persona_id INT NOT NULL,
  PRIMARY KEY (usuario_id),
  FOREIGN KEY(persona_id) REFERENCES PERSONAS (persona_id)
);

CREATE TABLE CLIENTES (
  Cliente_id SERIAL NOT NULL,
  persona_id INT NOT NULL,
  usuario_id INT NOT NULL,	
  PRIMARY KEY (Cliente_id),
  FOREIGN KEY(persona_id) REFERENCES PERSONAS (persona_id),
  FOREIGN KEY (usuario_id) REFERENCES USUARIOS (usuario_id)
);

CREATE TABLE EMPLEADOS (
  empleado_id SERIAL NOT NULL, 
  usuario_id int NOT NULL, 
  persona_id INT NOT NULL,
  PRIMARY KEY (empleado_id),
  FOREIGN KEY(persona_id) REFERENCES PERSONAS (persona_id)
);

CREATE TABLE PRODUCTOS (
	producto_id SERIAL NOT NULL,
	nombre varchar(25) NOT NULL,
	precio NUMERIC(8,2) NOT NULL,
	descripcion varchar(125) NOT NULL,
	stock int NOT NULL,
	IdCategoria INT NOT NULL,
	PRIMARY KEY (producto_id),
	FOREIGN KEY(IdCategoria) REFERENCES CATEGORIAS (IdCategoria)
);

CREATE TABLE RECETAS (
  recetas_id SERIAL NOT NULL,  
  nombre varchar(45) NOT NULL, 
  tiempo_preparacion INTERVAL NOT NULL, 
  Descripcion varchar(255) NOT NULL, 
  empleado_id int NOT NULL, 
  PRIMARY KEY (recetas_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id)
);

CREATE TABLE VENTAS (
  venta_id SERIAL NOT NULL, 
  IVA_pagar   NUMERIC(8,2) NULL, 
  pago_total  NUMERIC(8,2) NOT NULL, 
  fecha_venta  TIMESTAMP DEFAULT NOW(), 
  descuento_venta int NULL, 
  empleado_id int NOT NULL, 
  Cliente_id  int NOT NULL, 
  PRIMARY KEY (venta_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id),
  FOREIGN KEY(Cliente_id) REFERENCES CLIENTES (Cliente_id)
);

CREATE TABLE PEDIDOS (
  pedido_id SERIAL NOT NULL, 
  mesa int, 
  estado varchar(10) NOT NULL, 
  Cliente_id int NOT NULL, 
  PRIMARY KEY (pedido_id),
  FOREIGN KEY(Cliente_id) REFERENCES CLIENTES (Cliente_id)
);

CREATE TABLE DETALLES_VENTA (
	detalle_venta_id SERIAL NOT NULL,
	subtotal NUMERIC(8,2) NULL,
	descuento_articulo int NULL,
	p_cantidad INT NOT NULL,
	venta_id int NOT NULL,
	producto_id INT NOT NULL,
	PRIMARY KEY (detalle_venta_id),
	FOREIGN KEY(venta_id) REFERENCES VENTAS (venta_id),
	FOREIGN KEY (producto_id) REFERENCES PRODUCTOS(producto_id)
);

CREATE TABLE DETALLES_PEDIDOS (
  detalle_pedido_id SERIAL NOT NULL, 
  cantidad int NOT NULL, 
  fecha_pedido TIMESTAMP DEFAULT NOW() , 
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
  FOREIGN KEY(venta_id) REFERENCES VENTAS (venta_id)
);

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
			created_at	TIMESTAMP DEFAULT NOW(),tRIGGER
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
			vId := NEW.venta_id;
			vDescription := vDescription || 'added. Id: ' || vId;
			vOperacion := 'INSERT';
			vReturn := NEW;
		 ELSIF (TG_OP = 'UPDATE') THEN
			vId := NEW.venta_id;
			vDescription := vDescription || 'updated. Id: ' || vId;
			vOperacion := 'UPDATE';
			vReturn := NEW;
		 ELSIF (TG_OP = 'DELETE') THEN
			vId := OLD.venta_id;
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



/*FUNCION PARA PROTEGER DATOS*/
	CREATE OR REPLACE FUNCTION proteger_datos()
	RETURNS TRIGGER AS $$
	BEGIN
		RETURN NULL;
	END;
	$$ LANGUAGE plpgsql;

/*TRIGGER PARA PROTEGER DATOS DE LAS BITACORAS*/
	CREATE TRIGGER trigger_proteger_datos_bitacoras
	BEFORE DELETE OR UPDATE ON BITACORA_RECETAS
	FOR EACH ROW
	EXECUTE FUNCTION proteger_datos();

	CREATE TRIGGER trigger_proteger_datos_bitacoras
	BEFORE DELETE OR UPDATE ON  BITACORA_VENTAS
	FOR EACH ROW
	EXECUTE FUNCTION proteger_datos();

/*TRIGGER PARA PROTEGER DATOS DE LAS FORMAS DE PAGO*/
	CREATE TRIGGER trigger_proteger_datos_formasPagos
	BEFORE DELETE ON FORMAS_PAGOS
	FOR EACH ROW
	EXECUTE FUNCTION proteger_datos();

/*FUNCION PARA CALCULO DE SUBTOTAL*/

	
CREATE OR REPLACE  FUNCTION  calcular_rellenar_subtotal() RETURNS TRIGGER AS $subtotal_detalle_venta$

    DECLARE
	f_precio DECIMAL(10, 2);
	subtotal DECIMAL(10, 2);
	vRETURN RECORD;
BEGIN

    -- Obtener el precio del producto desde la tabla productos
    SELECT precio INTO f_precio
    FROM productos
    WHERE producto_id = NEW.producto_id;

    -- Calcular el subtotal
	NEW.subtotal := NEW.p_cantidad * f_precio;
	vRETURN := NEW;
	
		 RAISE NOTICE 'TRIGGER DISPARADO';
	RETURN vRETURN;

END; $subtotal_detalle_venta$ LANGUAGE plpgsql;

/*TRIGGEER*/
CREATE TRIGGER subtotal_detalle_venta
BEFORE INSERT ON detalles_venta
FOR EACH ROW
EXECUTE FUNCTION calcular_rellenar_subtotal();

/*FUNCION PARA ENCRIPTAR CONTRASEÑAS*/
	CREATE OR REPLACE FUNCTION encriptar_contrasenas()
	RETURNS TRIGGER AS $CUERPO$
	BEGIN
			NEW.contrasena := PGP_SYM_ENCRYPT(NEW.contrasena, 'AES_KEY');
		
		RETURN NEW;
	END;
	$CUERPO$ LANGUAGE plpgsql;

/*TRIGGER PARA ENCRIPTAR CONTRASEÑAS*/
	CREATE TRIGGER encriptar_contrasenas
	BEFORE INSERT OR UPDATE ON USUARIOS
	FOR EACH ROW
	EXECUTE FUNCTION encriptar_contrasenas();

SELECT *FROM USUARIOS;
/*INDICES*/

	/*Este indice permite la busqueda rapida de un producto mediante el nombre*/
	CREATE INDEX idx_producto_nombre ON PRODUCTOS(nombre);

	/*Este indice agiliza la busqueda de una venta mediante la fecha*/
	CREATE INDEX idx_fecha_venta ON VENTAS(fecha_venta);

	/*Indice que agiliza busquedas de ventas mediante el id de los clientes*/
	CREATE INDEX idx_cliente_id ON Ventas(cliente_id);

/*VISTAS*/

	/*Esta vista muestra los productos más vendidos con su nombre y 
	la cantidad total vendida*/
	CREATE VIEW TV_Productos_Mas_Vendidos AS
	SELECT 
		p.nombre AS producto,
		SUM(dv.p_cantidad) AS total_vendido
	FROM DETALLES_VENTA dv
	JOIN Productos p ON dv.producto_id = p.producto_id
	GROUP BY p.nombre
	ORDER BY total_vendido DESC;

	SELECT *FROM TV_Productos_Mas_Vendidos;
	
	/*Esta vista muestra el inventario actual de los productos ordenandolos
	del menor stock al mayor*/
		CREATE VIEW TV_Inventario_Actual AS
	SELECT 
		producto_id,
		nombre,
		stock
	FROM PRODUCTOS 
	ORDER BY stock ASC;
	
	/*Vista que muestra el total de las ventas y cantidad de productos vendidos
	en diferentes dias*/
		CREATE VIEW VistaVentasDiarias AS
	SELECT 
		v.fecha_venta,
		SUM(v.pago_total) AS total_diario,
		COUNT(dv.producto_id) AS cantidad_productos_vendidos
	FROM Ventas v JOIN DETALLES_VENTA dv ON v.venta_id = dv.venta_id
	GROUP BY fecha_venta
	ORDER BY fecha_venta DESC;
	SELECT *FROM VENTAS;
	
	/*FUNCION PARA CALCULO DE IVA*/
		CREATE OR REPLACE FUNCTION calcular_iva()
	RETURNS TRIGGER AS $$
	BEGIN
		-- Calcular IVA
		NEW.IVA_pagar := NEW.pago_total * 0.16;

		-- Devolver la nueva fila con el IVA calculado
		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

	/*TRIGGER PARA CALCULO DE IVA*/
		
		CREATE TRIGGER trigger_calcular_iva
		BEFORE INSERT ON VENTAS
		FOR EACH ROW
		EXECUTE FUNCTION calcular_iva();
	
	/*FUNCION PARA CALCULO DE PAGO TOTAL*/
		CREATE OR REPLACE FUNCTION actualizar_pago_total()
	RETURNS TRIGGER AS $$
	BEGIN
		-- Calcular la suma de los subtotales para la venta actual
		UPDATE VENTAS
		SET pago_total = (
			SELECT COALESCE(SUM(subtotal), 0)
			FROM DETALLES_VENTA
			WHERE venta_id = NEW.venta_id
		)
		WHERE venta_id = NEW.venta_id;

		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;
	
	/*TRIGGER PARA CALCULO DE PAGO TOTAL*/	
		CREATE TRIGGER trigger_actualizar_pago_total
	AFTER INSERT OR UPDATE ON DETALLES_VENTA
	FOR EACH ROW
	EXECUTE FUNCTION actualizar_pago_total();
	
/*----------------------------------------INSERT INTO---------------------------------------------*/
-- TABLA CATEGORIAS
INSERT INTO CATEGORIAS (categoria) VALUES ('Bebidas');
INSERT INTO CATEGORIAS (categoria) VALUES ('Restaurante');
INSERT INTO CATEGORIAS (categoria) VALUES ('Panaderia');

-- TABLA FORMAS_PAGOS
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Crédito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Débito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Efectivo');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Transferencia');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('PayPal');

-- TABLA COMENTARIOS
INSERT INTO COMENTARIOS (asunto, comentario) VALUES ('Mala recepción', 'Me atendieron mal');

-- TABLA PERSONAS
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('John', 'Doe', 'Smith', 'john.doe@example.com', '1234567890');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Anna', 'Smith', 'Johnson', 'anna.smith@example.com', '0987654321');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Michael', 'Jackson', 'Brown', 'michael.jackson@example.com', '1122334455');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Linda', 'King', 'White', 'linda.king@example.com', '2233445566');
INSERT INTO PERSONAS (Nombre, ApPaterno, ApMaterno, Correo, Telefono) VALUES ('Kobe', 'Bryant', 'Black', 'kobe.bryant@example.com', '3344556677');

-- TABLA FORMAS_PAGOS
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Crédito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Tarjeta de Débito');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Efectivo');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('Transferencia');
INSERT INTO FORMAS_PAGOS (nombre) VALUES ('PayPal');

-- TABLA USUARIOS
INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ('jdoe', 'password123', 2);
INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ('asmith', 'securepass', 1);
INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ('mjackson', 'moonwalk1', 3);
INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ('lking', 'lion123', 4);
INSERT INTO USUARIOS (user_name, contrasena, persona_id) VALUES ('kbryant', 'mamba24', 5);

-- TABLA PRODUCTOS
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, IdCategoria) VALUES ('Producto A', 10.0, 'Descripción A', 100, 2);
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, IdCategoria) VALUES ('Producto B', 20.0, 'Descripción B', 200, 1);
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, IdCategoria) VALUES ('Producto C', 30.0, 'Descripción C', 300, 3);
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, IdCategoria) VALUES ('Producto D', 40.0, 'Descripción D', 400, 1);
INSERT INTO PRODUCTOS (nombre, precio, descripcion, stock, IdCategoria) VALUES ('Producto E', 50.0, 'Descripción E', 500, 2);

-- TABLA CLIENTES
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (1, 1);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (2, 2);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (3, 3);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (4, 4);
INSERT INTO CLIENTES (persona_id, usuario_id) VALUES (5, 5);

-- TABLA EMPLEADOS
INSERT INTO EMPLEADOS (usuario_id, persona_id) VALUES (1, 1);
INSERT INTO EMPLEADOS (usuario_id, persona_id) VALUES (2, 2);
INSERT INTO EMPLEADOS (usuario_id, persona_id) VALUES (3, 3);
INSERT INTO EMPLEADOS (usuario_id, persona_id) VALUES (4, 4);
INSERT INTO EMPLEADOS (usuario_id, persona_id) VALUES (5, 5);

-- TABLA RECETASS
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Pasta Carbonara', '1 hour', 'Delicious Italian pasta', 1);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Chicken Curry', '30 minutes', 'Spicy Indian chicken curry', 2);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Beef Stroganoff', '1 hour 15 minutes', 'Creamy Russian beef dish', 3);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Caesar Salad', '15 minutes', 'Fresh Caesar salad with homemade dressing', 4);
INSERT INTO RECETAS (nombre, tiempo_preparacion, Descripcion, empleado_id) VALUES ('Chocolate Cake', '25 minutes', 'Rich chocolate dessert', 5);

-- TABLA PEDIDOS
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (1, 'Pendiente', 1);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (2, 'En Proceso', 2);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (3, 'Completado', 3);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (4, 'Cancelado', 4);
INSERT INTO PEDIDOS (mesa, estado, Cliente_id) VALUES (NULL, 'Pendiente', 5);

-- TABLA DETALLES_PEDIDOS
INSERT INTO DETALLES_PEDIDOS (cantidad, producto_id, pedido_id) VALUES (2, 1, 1);
INSERT INTO DETALLES_PEDIDOS (cantidad, producto_id, pedido_id) VALUES (1, 2, 2);
INSERT INTO DETALLES_PEDIDOS (cantidad, producto_id, pedido_id) VALUES (3, 3, 3);
INSERT INTO DETALLES_PEDIDOS (cantidad, producto_id, pedido_id) VALUES (4, 4, 4);
INSERT INTO DETALLES_PEDIDOS (cantidad, producto_id, pedido_id) VALUES (5, 5, 5);

-- TABLA VENTAS
INSERT INTO VENTAS ( pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES ( 100.00, '2024-08-01', 10, 1, 1);
INSERT INTO VENTAS (pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES ( 227.53, '2024-08-02', 15, 2, 2);
INSERT INTO VENTAS (pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES ( 300.00, '2024-08-03', 20, 3, 3);
INSERT INTO VENTAS (pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES ( 400.00, '2024-08-04', 25, 4, 4);
INSERT INTO VENTAS (pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id) VALUES ( 500.00, '2024-08-05', 30, 5, 5);
SELECT *FROM VENTAS;

-- TABLA FORMAS_PAGOS_VENTAS
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (1, 1);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (2, 2);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (3, 3);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (4, 4);
INSERT INTO FORMAS_PAGOS_VENTAS (forma_pago_id, venta_id) VALUES (5, 5);

-- TABLA DETALLES_VENTA
INSERT INTO DETALLES_VENTA (venta_id, descuento_articulo, p_cantidad, producto_id) VALUES (1, 5.0, 5, 2);
INSERT INTO DETALLES_VENTA (venta_id, descuento_articulo, p_cantidad, producto_id) VALUES (2, 2.0,  10, 3);
INSERT INTO DETALLES_VENTA (venta_id, descuento_articulo, p_cantidad, producto_id) VALUES (3, 5.0,  15, 1);
INSERT INTO DETALLES_VENTA (venta_id, descuento_articulo, p_cantidad, producto_id) VALUES (4, 33.0, 20, 4);
INSERT INTO DETALLES_VENTA (venta_id, descuento_articulo, p_cantidad, producto_id) VALUES (5, 55.0, 25, 5);
SELECT *FROM DETALLES_VENTA;

CREATE VIEW vista_usuarios AS  
	SELECT u.usuario_id, pe.correo, pgp_sym_decrypt(u.contrasena::bytea, 'AES_KEY') AS contrasena 
	FROM PERSONAS pe INNER JOIN USUARIOS u 
	ON pe.persona_id = u.persona_id;
	

CREATE VIEW vista_usuarios_encriptada AS  
	SELECT u.usuario_id, pe.correo, u.contrasena 
	FROM PERSONAS pe INNER JOIN USUARIOS u 
	ON pe.persona_id = u.persona_id;
		

CREATE USER ADMINISTRADOR WITH PASSWORD 'administrador';
CREATE USER VISITANTE  WITH PASSWORD 'visitante';

GRANT SELECT ON ALL TABLES IN SCHEMA PUBLIC TO VISITANTE;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA PUBLIC TO ADMINISTRADOR;
	
	
/*----------------------------------------TRANSACCIONES----------------------------------------*/

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


	
