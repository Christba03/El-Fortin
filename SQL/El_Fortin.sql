CREATE TABLE USUARIOS (
  usuario_id SERIAL NOT NULL, 
  user_name varchar(15) NOT NULL UNIQUE, 
  "password" varchar(15) NOT NULL, 
  email   varchar(30) NOT NULL UNIQUE, 
  PRIMARY KEY (usuario_id));

CREATE TABLE CLIENTES (
  Cliente_id SERIAL NOT NULL, 
  nombre varchar(35) NOT NULL, 
  apellidop  varchar(35) NOT NULL, 
  apellidom  varchar(35) NOT NULL, 
  usuario_id int4 NOT NULL, 
  PRIMARY KEY (Cliente_id),
  FOREIGN KEY(usuario_id) REFERENCES USUARIOS (usuario_id));

CREATE TABLE EMPLEADOS (
  empleado_id SERIAL NOT NULL, 
  nombre  varchar(35) NOT NULL, 
  apellidop varchar(35) NOT NULL, 
  apellidom varchar(35) NOT NULL, 
  salario  int NOT NULL, 
  fecha_pago date NOT NULL, 
  telefono char(10) NOT NULL, 
  usuario_id int NOT NULL, 
  PRIMARY KEY (empleado_id),
  FOREIGN KEY(usuario_id) REFERENCES USUARIOS (usuario_id));



CREATE TABLE RECETAS (
  recetas_id SERIAL NOT NULL, 
  "index"  int NOT NULL, 
  nombre varchar(45) NOT NULL, 
  tiempo_preparacion time NOT NULL, 
  Descripcion varchar(255) NOT NULL, 
  empleado_id int NOT NULL, 
  PRIMARY KEY (recetas_id),
  FOREIGN KEY(empleado_id) REFERENCES EMPLEADOS (empleado_id));


CREATE TABLE VENTAS (
  venta_id SERIAL NOT NULL, 
  forma_de_pago  varchar(12) NOT NULL, 
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
	cantidad int NOT NULL,
	mesa int,
	producto_id int NOT NULL,
	detalle_venta_id int,
	PRIMARY KEY (pedido_id),
	FOREIGN KEY(producto_id) REFERENCES PRODUCTOS (producto_id),
	FOREIGN KEY(detalle_venta_id) REFERENCES DETALLES_VENTA (detalle_venta_id));
