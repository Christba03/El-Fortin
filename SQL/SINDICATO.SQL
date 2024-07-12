CREATE TABLE REGIMENES (
    ID_REGIMEN SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(40) NOT NULL
);
CREATE TABLE ROLES (
    ID_ROL SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(40) NOT NULL
);
CREATE TABLE USUARIOS(
    ID_USUARIO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(15) UNIQUE NOT NULL,
    PASSWORD VARCHAR(12) NOT NULL,
    CORREO VARCHAR(30) UNIQUE NOT NULL,
    ID_ROL INT NOT NULL,
    FOREIGN KEY (ID_ROL) REFERENCES ROLES(ID_ROL),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO USUARIOS(NOMBRE,PASSWORD,CORREO,ID_ROL)
VALUES ('Aldebar','Aldeba1','SDF@AD.COM',1);
INSERT INTO ROLES(NOMBRE)
VALUES ('ADMINISTRADOR');
INSERT INTO REGIMENES(NOMBRE)
VALUES ('REGIMEN GENERAL');

CREATE TABLE SINDICATOS(
    ID_SINDICATO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(40) NOT NULL,
    RFC CHAR(12) NOT NULL,
    DIRECCION VARCHAR(75) NOT NULL,
    LIDER VARCHAR(50) NOT NULL,
    FECHA_FUNDACION DATE NOT NULL,
    NUMERO_EMPLEADOS INT NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_REGIMEN INT NOT NULL,
    ID_USUARIO INT NOT NULL,
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS(ID_USUARIO),
    FOREIGN KEY (ID_REGIMEN) REFERENCES REGIMENES(ID_REGIMEN)
);

CREATE TABLE BENEFICIOS(
    ID_BENEFICIO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(20) NOT NULL,
    DESCRIPCION VARCHAR(75) NOT NULL
);

CREATE TABLE EMPLEADOS(
    ID_EMPLEADO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL,
    RFC CHAR(13) NOT NULL,
    INE CHAR(13) NOT NULL,
    DIRECCION VARCHAR(50) NOT NULL,
    TELEFONO CHAR(10) NOT NULL,
    FECHA_NAC DATE NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_USUARIO INT NOT NULL,
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS(ID_USUARIO)
);

CREATE TABLE SINDICATOS_EMPLEADOS(
    ID_EMPLEADO INT NOT NULL,
    ID_SINDICATO INT NOT NULL ,
    FECHA_INGRESO DATE NOT NULL,
    FECHA_SALIDA DATE NOT NULL,
	PRIMARY KEY (ID_EMPLEADO,ID_SINDICATO),
    FOREIGN KEY (ID_EMPLEADO) REFERENCES EMPLEADOS(ID_EMPLEADO),
    FOREIGN KEY (ID_SINDICATO) REFERENCES SINDICATOS(ID_SINDICATO)
);

CREATE TABLE CONTRATOS(
    ID_CONTRATO SERIAL PRIMARY KEY,
    NUMERO_CONTRATO VARCHAR(10) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,
    CUOTA FLOAT NOT NULL,
    ID_EMPLEADO INT NOT NULL,
    ID_SINDICATO INT NOT NULL,
    FOREIGN KEY (ID_EMPLEADO) REFERENCES EMPLEADOS(ID_EMPLEADO),
    FOREIGN KEY (ID_SINDICATO) REFERENCES SINDICATOS(ID_SINDICATO)
);
CREATE TABLE CONTRATOS_BENEFICIOS(
    ID_CONTRATO INT NOT NULL ,
    ID_BENEFICIO INT NOT NULL,
	PRIMARY KEY (ID_CONTRATO,ID_BENEFICIO),
    FOREIGN KEY (ID_CONTRATO) REFERENCES CONTRATOS(ID_CONTRATO),
    FOREIGN KEY (ID_BENEFICIO) REFERENCES BENEFICIOS(ID_BENEFICIO)
);  
CREATE TABLE EMPRESAS(
    ID_EMPRESA SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(30) NOT NULL,
    RFC CHAR(12) NOT NULL,
    DIRECCION VARCHAR(75) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE SINDICATOS_EMPRESAS(
    ID_EMPRESA INT NOT NULL,
    ID_SINDICATO INT NOT NULL,
    FECHA_INGRESO DATE NOT NULL,
    FECHA_SALIDA DATE NOT NULL,
	PRIMARY KEY (ID_EMPRESA,ID_SINDICATO),
    FOREIGN KEY (ID_EMPRESA) REFERENCES EMPRESAS(ID_EMPRESA),
    FOREIGN KEY (ID_SINDICATO) REFERENCES SINDICATOS(ID_SINDICATO)
);
CREATE TABLE DEPARTAMENTOS (
    ID_DEPARTAMENTO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(30) NOT NULL
);
CREATE TABLE EMPRESAS_DEPARTAMENTOS(
    ID_EMPRESA INT NOT NULL,
    ID_DEPARTAMENTO INT NOT NULL,
	PRIMARY KEY (ID_EMPRESA,ID_DEPARTAMENTO),
    FOREIGN KEY (ID_EMPRESA) REFERENCES EMPRESAS(ID_EMPRESA),
    FOREIGN KEY (ID_DEPARTAMENTO) REFERENCES DEPARTAMENTOS(ID_DEPARTAMENTO)
);
CREATE TABLE DEPARTAMENTOS_EMPLEADOS(
    ID_EMPLEADO INT NOT NULL ,
    ID_DEPARTAMENTO INT NOT NULL,
    FECHA_INGRESO DATE NOT NULL,
    FECHA_SALIDA DATE NOT NULL,
    NUM_EMPLEADO INT NOT NULL,
	PRIMARY KEY (ID_EMPLEADO,ID_DEPARTAMENTO),
    FOREIGN KEY (ID_EMPLEADO) REFERENCES EMPLEADOS(ID_EMPLEADO),
    FOREIGN KEY (ID_DEPARTAMENTO) REFERENCES DEPARTAMENTOS(ID_DEPARTAMENTO)
);

CREATE TABLE BITACORA_USUARIOS(
 		id			SERIAL,
        table_name	TEXT NOT NULL,
        table_id	TEXT NOT NULL,
        description	TEXT NOT NULL,
        created_at	TIMESTAMP DEFAULT NOW(),
    operacion   TEXT NOT NULL,
        PRIMARY KEY(id)
);


CREATE FUNCTION registrar_cambios_usuarios() RETURNS trigger AS $BODY$
    DECLARE
        vDescription TEXT;
        vId INT;
        vReturn RECORD;
        vOperacion TEXT;
    BEGIN
        vDescription := TG_TABLE_NAME || ' ';
         IF (TG_OP = 'INSERT') THEN
            vId := NEW.id_usuario;
            vDescription := vDescription || 'added. Id: ' || vId;
            vOperacion := 'INSERT';
            vReturn := NEW;
         ELSIF (TG_OP = 'UPDATE') THEN
            vId := NEW.id_usuario;
            vDescription := vDescription || 'updated. Id: ' || vId;
            vOperacion := 'UPDATE';
            vReturn := NEW;
         ELSIF (TG_OP = 'DELETE') THEN
            vId := OLD.id_usuario;
            vDescription := vDescription || 'deleted. Id: ' || vId;
            vOperacion := 'DELETE';
            vReturn := OLD;
         END IF;

      RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;

  INSERT INTO bitacora_usuarios
         (table_name, table_id, description, created_at, Operacion)  
         VALUES
         (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);

      RETURN vReturn;
    END $BODY$ LANGUAGE plpgsql;

  CREATE TRIGGER registrar_cambios_usuarios AFTER INSERT OR UPDATE OR DELETE
    ON USUARIOS FOR EACH ROW
    EXECUTE PROCEDURE registrar_cambios_usuarios();

    CREATE TABLE BITACORA_CONTRATOS(
        id			SERIAL,
        table_name	TEXT NOT NULL,
        table_id	TEXT NOT NULL,
        description	TEXT NOT NULL,
        created_at	TIMESTAMP DEFAULT NOW(),
        operacion   TEXT NOT NULL,
        PRIMARY KEY(id)
    );

    CREATE FUNCTION registrar_cambios_contratos() RETURNS trigger AS $BODY$
        DECLARE
            vDescription TEXT;
            vId INT;
            vReturn RECORD;
            vOperacion TEXT;
        BEGIN
            vDescription := TG_TABLE_NAME || ' ';
             IF (TG_OP = 'INSERT') THEN
                vId := NEW.id_contrato;
                vDescription := vDescription || 'added. Id: ' || vId;
                vOperacion := 'INSERT';
                vReturn := NEW;
             ELSIF (TG_OP = 'UPDATE') THEN
                vId := NEW.id_contrato;
                vDescription := vDescription || 'updated. Id: ' || vId;
                vOperacion := 'UPDATE';
                vReturn := NEW;
             ELSIF (TG_OP = 'DELETE') THEN
                vId := OLD.id_contrato;
                vDescription := vDescription || 'deleted. Id: ' || vId;
                vOperacion := 'DELETE';
                vReturn := OLD;
             END IF;
    
          RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;
    
      INSERT INTO bitacora_contratos
             (table_name, table_id, description, created_at, Operacion)  
             VALUES
             (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);
    
          RETURN vReturn;
        END $BODY$ LANGUAGE plpgsql;
    
      CREATE TRIGGER registrar_cambios_contratos AFTER INSERT OR UPDATE OR DELETE
        ON CONTRATOS FOR EACH ROW
        EXECUTE PROCEDURE registrar_cambios_contratos();

        CREATE TABLE BITACORA_EMPLEADOS(
            id			SERIAL,
            table_name	TEXT NOT NULL,
            table_id	TEXT NOT NULL,
            description	TEXT NOT NULL,
            created_at	TIMESTAMP DEFAULT NOW(),
            operacion   TEXT NOT NULL,
            PRIMARY KEY(id)
        );
    
        CREATE FUNCTION registrar_cambios_empleados() RETURNS trigger AS $BODY$
            DECLARE
                vDescription TEXT;
                vId INT;
                vReturn RECORD;
                vOperacion TEXT;
            BEGIN
                vDescription := TG_TABLE_NAME || ' ';
                 IF (TG_OP = 'INSERT') THEN
                    vId := NEW.id_empleado;
                    vDescription := vDescription || 'added. Id: ' || vId;
                    vOperacion := 'INSERT';
                    vReturn := NEW;
                    ELSIF (TG_OP = 'UPDATE') THEN
                    vId := NEW.id_empleado;
                    vDescription := vDescription || 'updated. Id: ' || vId;
                    vOperacion := 'UPDATE';
                    vReturn := NEW;
                    ELSIF (TG_OP = 'DELETE') THEN
                    vId := OLD.id_empleado;
                    vDescription := vDescription || 'deleted. Id: ' || vId;
                    vOperacion := 'DELETE';
                    vReturn := OLD;
                    END IF;

                RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;

            INSERT INTO bitacora_empleados
                    (table_name, table_id, description, created_at, Operacion)  
                    VALUES
                    (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);

                RETURN vReturn;
            END $BODY$ LANGUAGE plpgsql;

            CREATE TRIGGER registrar_cambios_empleados AFTER INSERT OR UPDATE OR DELETE
            ON EMPLEADOS FOR EACH ROW
            EXECUTE PROCEDURE registrar_cambios_empleados();

            CREATE TABLE BITACORA_SINDICATOS(
                id			SERIAL,
                table_name	TEXT NOT NULL,
                table_id	TEXT NOT NULL,
                description	TEXT NOT NULL,
                created_at	TIMESTAMP DEFAULT NOW(),
                operacion   TEXT NOT NULL,
                PRIMARY KEY(id)
            );
            CREATE FUNCTION registrar_cambios_sindicatos() RETURNS trigger AS $BODY$
                DECLARE
                    vDescription TEXT;
                    vId INT;
                    vReturn RECORD;
                    vOperacion TEXT;
                BEGIN
                    vDescription := TG_TABLE_NAME || ' ';
                     IF (TG_OP = 'INSERT') THEN
                        vId := NEW.id_sindicato;
                        vDescription := vDescription || 'added. Id: ' || vId;
                        vOperacion := 'INSERT';
                        vReturn := NEW;
                     ELSIF (TG_OP = 'UPDATE') THEN
                        vId := NEW.id_sindicato;
                        vDescription := vDescription || 'updated. Id: ' || vId;
                        vOperacion := 'UPDATE';
                        vReturn := NEW;
                     ELSIF (TG_OP = 'DELETE') THEN
                        vId := OLD.id_sindicato;
                        vDescription := vDescription || 'deleted. Id: ' || vId;
                        vOperacion := 'DELETE';
                        vReturn := OLD;
                        END IF;
    
                    RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;
    
                INSERT INTO bitacora_sindicatos
                        (table_name, table_id, description, created_at, Operacion)  
                        VALUES
                        (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);
    
                    RETURN vReturn;
                END $BODY$ LANGUAGE plpgsql;
    
                CREATE TRIGGER registrar_cambios_sindicatos AFTER INSERT OR UPDATE OR DELETE
                ON SINDICATOS FOR EACH ROW
                EXECUTE PROCEDURE registrar_cambios_sindicatos();

                CREATE TABLE BITACORA_EMPRESAS(
                    id			SERIAL,
                    table_name	TEXT NOT NULL,
                    table_id	TEXT NOT NULL,
                    description	TEXT NOT NULL,
                    created_at	TIMESTAMP DEFAULT NOW(),
                    operacion   TEXT NOT NULL,
                    PRIMARY KEY(id)
                );
                CREATE FUNCTION registrar_cambios_empresas() RETURNS trigger AS $BODY$
                    DECLARE
                        vDescription TEXT;
                        vId INT;
                        vReturn RECORD;
                        vOperacion TEXT;
                    BEGIN
                        vDescription := TG_TABLE_NAME || ' ';
                         IF (TG_OP = 'INSERT') THEN
                            vId := NEW.id_empresa;
                            vDescription := vDescription || 'added. Id: ' || vId;
                            v
                            Operacion := 'INSERT';
                            vReturn := NEW;
                            ELSIF (TG_OP = 'UPDATE') THEN
                            vId := NEW.id_empresa;
                            vDescription := vDescription || 'updated. Id: ' || vId;
                            vOperacion := 'UPDATE';
                            vReturn := NEW;
                            ELSIF (TG_OP = 'DELETE') THEN
                            vId := OLD.id_empresa;
                            vDescription := vDescription || 'deleted. Id: ' || vId;
                            vOperacion := 'DELETE';
                            vReturn := OLD;
                            END IF;

                        RAISE NOTICE 'TRIGGER called on % - Log: %', TG_TABLE_NAME, vDescription;

                    INSERT INTO bitacora_empresas
                            (table_name, table_id, description, created_at, Operacion)  
                            VALUES
                            (TG_TABLE_NAME, vId, vDescription, NOW(), vOperacion);

                        RETURN vReturn;
                    END $BODY$ LANGUAGE plpgsql;

                    CREATE TRIGGER registrar_cambios_empresas AFTER INSERT OR UPDATE OR DELETE
                    ON EMPRESAS FOR EACH ROW
                    EXECUTE PROCEDURE registrar_cambios_empresas();
INSERT INTO EMPLEADOS (NOMBRE,RFC,INE,DIRECCION,TELEFONO,FECHA_NAC,ID_USUARIO)
VALUES ('JUAN PEREZ','SDF123456789','SDF123456789','CALLE 123','1234567890','2020-01-01',1);

                    
INSERT INTO REGIMENES(NOMBRE)
VALUES ('REGIMEN GENERAL');
INSERT INTO REGIMENES(NOMBRE)
VALUES ('REGIMEN DE INCORPORACION FISCAL');

INSERT INTO ROLES(NOMBRE)
VALUES ('ADMINISTRADOR');
INSERT INTO ROLES(NOMBRE)
VALUES ('USUARIO');

CREATE EXTENSION pgcrypto;
ALTER TABLE USUARIOS MODIFY COLUMN PASSWORD VARCHAR(255) NOT NULL;
INSERT INTO USUARIOS(NOMBRE,PASSWORD,CORREO,ID_ROL)
VALUES ('Aldereno', PGP_SYM_ENCRYPT('Aldebaran X1','AES_KEY'),'asdfdg@gmail.com',1),
('Leticvex', PGP_SYM_ENCRYPT('Galvex G123','AES_KEY'),'uodshaof@gmail.com',1),
('Xocxtlan', PGP_SYM_ENCRYPT('Nochi#90','AES_KEY'),'onsadmfp@gmail.com',1),
('Zejal', PGP_SYM_ENCRYPT('ZeUs8?','AES_KEY'),'paco@gmail.com',1),
('Glyan', PGP_SYM_ENCRYPT('Chago78#','AES_KEY'),'aspmasdpvdfdg@gmail.com',1),
('Chandere', PGP_SYM_ENCRYPT('Ander#123','AES_KEY'),'asdiosafdg@gmail.com',1);
/*SEGURIDAD*/


INSERT INTO SINDICATOS(NOMBRE,RFC,DIRECCION,LIDER,FECHA_FUNDACION,NUMERO_EMPLEADOS,ID_REGIMEN,ID_USUARIO)
VALUES ('SINDICATO DE TRABAJADORES','SDF123456789','CALLE 123','JUAN PEREZ','2020-01-01',100,1,1);
INSERT INTO SINDICATOS(NOMBRE,RFC,DIRECCION,LIDER,FECHA_FUNDACION,NUMERO_EMPLEADOS,ID_REGIMEN,ID_USUARIO)
VALUES ('SINDICATO DE MAESTRO','SDF121236789','CALLE ASFD23','JUAN PEREZ','2020-01-01',100,1,1);

INSERT INTO BENEFICIOS(NOMBRE,DESCRIPCION)
VALUES ('SEGURO DE VIDA','SEGURO DE VIDA');
INSER INTO EMPLEADOS(NOMBRE,RFC,INE,DIRECCION,TELEFONO,FECHA_NAC,ID_USUARIO)
VALUES ('JUAN PEREZ','SDF123456789','SDF123456789','CALLE 123','1234567890','2020-01-01',1);
INSERT INTO CONTRATOS(NUMERO_CONTRATO,FECHA_INICIO,FECHA_FIN,CUOTA,ID_EMPLEADO,ID_SINDICATO)
VALUES ('123456789','2020-01-01','2020-12-31',1000,1,1);

INSERT INTO EMPRESAS(NOMBRE,RFC,DIRECCION)
VALUES ('EMPRESA 1','SDF123456789','CALLE 123');
INSERT INTO DEPARTAMENTOS(NOMBRE)
VALUES ('DEPARTAMENTO 1');

CREATE VIEW EMPLEADOS_SINDICATOS AS
SELECT E.ID_EMPLEADO,E.NOMBRE,E.RFC,E.INE,E.DIRECCION,E.TELEFONO,E.FECHA_NAC,E.CREATED_AT,E.UPDATED_AT,E.ID_USUARIO,SE.ID_SINDICATO,SE.FECHA_INGRESO,SE.FECHA_SALIDA

CREATE VIEW USUARIOS_SINDICATOS_2 AS
SELECT NOMBRE
FROM USUARIOS U
JOIN SINDICATOS_EMPLEADOS SE ON SE.ID_USUARIO = U.ID_USUARIO
JOIN SINDICATOS S ON SE.ID_SINDICATO = S.ID_SINDICATO
WHERE COUNT (SE.ID_SINDICATO) > 1;	

SELECT VIEW USUARIOS_SINDICATOS_2;
INSERT INTO SINDICATOS_EMPLEADOS(ID_EMPLEADO,ID_SINDICATO,FECHA_INGRESO,FECHA_SALIDA)
VALUES (2,1,'2020-01-01','2020-12-31'),
(2,2,'2020-01-01','2020-12-31')
(2,3,'2020-01-01','2020-12-31');

INSERT INTO CONTRATOS(NUMERO_CONTRATO,FECHA_INICIO,FECHA_FIN,CUOTA,ID_EMPLEADO,ID_SINDICATO)
VALUES ('123456789','2020-01-01','2020-12-31',1000,3,1);

CREATE VIEW TV_Libros_AlfaOmega AS
SELECT l.Titulo
FROM  EDITORIALES e INNER JOIN LIBROS l
ON e.IdEditorial=l.IdEditorial
WHERE e.NombreEditorial='AlfaOmega';
SELECT *FROM TV_Libros_AlfaOmega;

SELECT *FROM USUARIOS;
SELECT *FROM ROLES;
SELECT *FROM REGIMENES;
SELECT *FROM SINDICATOS;
SELECT *FROM BENEFICIOS;
SELECT *FROM EMPLEADOS;
SELECT *FROM CONTRATOS;
SELECT *FROM EMPRESAS;
SELECT *FROM DEPARTAMENTOS;
SELECT *FROM SINDICATOS_EMPLEADOS;
SELECT *FROM CONTRATOS_BENEFICIOS;
SELECT *FROM SINDICATOS_EMPRESAS;
SELECT *FROM EMPRESAS_DEPARTAMENTOS;
SELECT *FROM DEPARTAMENTOS_EMPLEADOS;
SELECT *FROM BITACORA_USUARIOS;
SELECT *FROM BITACORA_CONTRATOS;
SELECT *FROM BITACORA_EMPLEADOS;
SELECT *FROM BITACORA_SINDICATOS;
SELECT *FROM BITACORA_EMPRESAS;


CREATE VIEW EMPLEADOS_MULTIPLES_SINDICATOS AS
SELECT E.*
FROM EMPLEADOS E
JOIN CONTRATOS C ON E.ID_EMPLEADO = C.ID_EMPLEADO
GROUP BY E.ID_EMPLEADO
HAVING COUNT(DISTINCT CO.ID_SINDICATO) > 1;

UPDATE USUARIOS SET PASSWORD = PGP_SYM_ENCRYPT('Xochi$900','AES_KEY') WHERE ID_USUARIO = 3;