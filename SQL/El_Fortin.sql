CREATE TABLE CLIENTES (
	cliente_id SERIAL NOT NULL, 
	nombre varchar(35) NOT NULL, 
	apellidop varchar(35) NOT NULL, 
	apellidom varchar(35) NOT NULL, 
	email varchar(50) NOT NULL, 
	password varchar(15) NOT NULL, 
	usuario varchar(20) NOT NULL UNIQUE, 
	PRIMARY KEY (Cliente_id));
INSERT INTO CLIENTES(nombre, apellidop, apellidom, email, password, usuario) 
	VALUES (?, ?, ?, ?, ?, ?, ?);

CREATE TABLE EMPLEADOS (
	empleado_id SERIAL NOT NULL,
	nombre varchar(35) NOT NULL,
	apellidop varchar(35) NOT NULL,
	apellidom varchar(35) NOT NULL,
	salario int NOT NULL, fecha_pago date NOT NULL,
	email varchar(50) NOT NULL, password varchar(15) NOT NULL,
	usuario varchar(20) NOT NULL UNIQUE,
	telefono char(10) NOT NULL,
	PRIMARY KEY (empleado_id));

INSERT INTO EMPLEADOS(nombre, apellidop, apellidom, salario, fecha_pago, email, password, usuario, telefono) 
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);


CREATE TABLE PEDIDOS (
	pedido_id SERIAL NOT NULL,
	mesa int NOT NULL,
	forma_de_pago varchar(12) NOT NULL,
	IVA_pagar float NOT NULL,
	costo_total float NOT NULL,
	fecha_venta date NOT NULL,
	descuento int,
	Empleado int NOT NULL,
	Cliente int NOT NULL,
	PRIMARY KEY (ticket_id),
	FOREIGN KEY(Empleado) REFERENCES CLIENTES (Cliente_id),
	FOREIGN KEY(Cliente) REFERENCES EMPLEADOS (empleado_id));

INSERT INTO PEDIDOS(mesa, forma_de_pago, IVA_pagar, costo_total, fecha_venta, descuento, EMPLEADOSEmpleado_id, CLIENTESCliente_id) 
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

CREATE TABLE PRODUCTOS (
	producto_id SERIAL NOT NULL,
	nombre varchar(25) NOT NULL,
	costo float NOT NULL,
	descripcion varchar(125) NOT NULL,
	categoria varchar(11) NOT NULL,
	tipo varchar(25) NOT NULL, stock int4 NOT NULL,
	PRIMARY KEY (producto_id));
INSERT INTO PRODUCTOS(nombre, costo, descripcion, categoria, tipo) 
	VALUES (?, ?, ?, ?, ?);

CREATE TABLE RECETAS (
	recetas_id SERIAL NOT NULL,
	"index" int NOT NULL,
	nombre varchar(45) NOT NULL,
	tiempo_preparacion time NOT NULL,
	Descripcion varchar(255) NOT NULL,
	producto int NOT NULL,
	PRIMARY KEY (recetas_id),
	FOREIGN KEY(producto) REFERENCES PRODUCTOS (producto_id));

INSERT INTO RECETAS("index", nombre, tiempo_preparacion, Descripcion, producto) 
	VALUES (?, ?, ?, ?, ?);


CREATE TABLE "DETALLES DE VENTA" (
	detalle_id SERIAL NOT NULL,
	cantidad int NOT NULL,
	costo_parcial float NOT NULL,
	pedido int NOT NULL,
	producto int NOT NULL,
	PRIMARY KEY (detalle_id),
	FOREIGN KEY(pedido) REFERENCES PEDIDOS (pedido_id))
	FOREIGN KEY(producto) REFERENCES PRODUCTOS (producto_id));

INSERT INTO PEDIDO(cantidad, costo_parcial, pedido, producto) 
	VALUES (?, ?, ?, ?);

