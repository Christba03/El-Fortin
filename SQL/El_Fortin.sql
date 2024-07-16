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
  Correo varchar(45) NOT NULL, 
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
  salario  int NOT NULL, 
  fecha_pago date NOT NULL, 
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
  fecha_pedido date NOT NULL, 
  producto_id int NOT NULL, 
  pedido_id int NOT NULL, 
  PRIMARY KEY (detalle_pedido_id),
  FOREIGN KEY(producto_id) REFERENCES PRODUCTOS (producto_id),
  FOREIGN KEY(pedido_id) REFERENCES PEDIDOS (pedido_id),
  );


CREATE TABLE FORMAS_PAGOS_VENTAS (
  forma_pago_id int NOT NULL, 
  venta_id int NOT NULL, 
  PRIMARY KEY (forma_pago_id, VENTASventa_id),
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
  fecha_venta  date NOT NULL, 
  descuento_venta int, 
  empleado_id int NOT NULL, 
  Cliente_id  int NOT NULL, 
  PRIMARY KEY (venta_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id),
  FOREIGN KEY(Cliente_id) REFERENCES CLIENTES (Cliente_id));

CREATE TABLE DETALLES_VENTA (
	detalle_venta_id SERIAL NOT NULL,
	venta_id int NOT NULL,
	subtotal float NOT NULL,
	descuento_articulo int NOT NULL,
	p_cantidad INT NOT NULL,
	PRIMARY KEY (detalle_venta_id),
	FOREIGN KEY(venta_id) REFERENCES VENTAS (venta_id));

CREATE TABLE PRODUCTOS (
	producto_id SERIAL NOT NULL,
	nombre varchar(25) NOT NULL,
	precio float NOT NULL,
	descripcion varchar(125) NOT NULL,
	stock int NOT NULL,
	PRIMARY KEY (producto_id));

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

  INSERT INTO bitacora_comerciales
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
CREATE OR REPLACE FUNCTION actualizar_stock_venta(p_producto_id INT, p_cantidad INT) RETURNS VOID AS $$
BEGIN
    UPDATE PRODUCTOS
    SET stock = stock - p_cantidad
    WHERE producto_id = p_producto_id;
    
END;
$$ LANGUAGE plpgsql;


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
INSERT INTO VENTAS ( IVA_pagar, pago_total, fecha_venta, descuento_venta, empleado_id, Cliente_id)
VALUES ( 0.16, 100.00, '2021-06-01', 0, 1, 1);
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

/*VISTAS*/

CREATE VIEW VISTA_VENTAS AS 