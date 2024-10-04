
create table categories (
  id bigint primary key generated always as identity,
  name VARCHAR(50) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table payment_methods (
  id bigint primary key generated always as identity,
  name varchar(30) not null
);

create table order_statuses (
  id bigint primary key generated always as identity,
  name varchar(20) not null
);

create table preparation_areas (
  id bigint primary key generated always as identity,
  name varchar(20) not null
);

create table discounts (
  id bigint primary key generated always as identity,
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  value numeric(5, 2) not null,
  start_date date,
  end_date date,
  active boolean default true
);

create table restaurants (
  id bigint primary key generated always as identity,
  name text not null,
  location text not null,
  opening_hours text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table menu_items (
  id bigint primary key generated always as identity,
  restaurant_id bigint references restaurants (id),
  name text not null,
  description text,
  price numeric(5, 2) not null,
  category_id bigint references categories (id),
  pre_tax_cost numeric(5, 2),
  post_tax_cost numeric(5, 2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    user_type TEXT CHECK (user_type IN ('client', 'worker')) NOT NULL,
    nickname TEXT,
    encrypted_password TEXT,  -- Store the hashed password
    salt TEXT,                -- Store the salt used for hashing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

create table orders (
  id bigint primary key generated always as identity,
  table_number int,
  restaurant_id bigint references restaurants (id),
  order_date timestamp with time zone default now(),
  total_amount numeric(6, 2) not null,
  client_id bigint references users (id),
  pre_tax_total numeric(6, 2),
  post_tax_total numeric(6, 2),
  payment_method_id bigint references payment_methods (id),
  status_id bigint references order_statuses (id),
  order_type text check (order_type in ('in_store', 'online')) not null,
  discount_id bigint references discounts (id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table order_items (
  id bigint primary key generated always as identity,
  order_id bigint references orders (id),
  menu_item_id bigint references menu_items (id),
  quantity int not null,
  item_cost numeric(5, 2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table workers (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  "position" text not null,
  hire_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table recipes (
  id bigint primary key generated always as identity,
  menu_item_id bigint references menu_items (id),
  worker_id bigint references workers (id),
  description text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table order_preparation (
  id bigint primary key generated always as identity,
  order_id bigint references orders (id),
  preparation_area_id bigint references preparation_areas (id),
  status_id bigint references order_statuses (id),
  updated_at timestamp with time zone default now()
);

create table suppliers (
  id bigint primary key generated always as identity,
  name text not null,
  contact_info text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table inventory (
  id bigint primary key generated always as identity,
  item_name text not null,
  quantity int not null,
  reorder_point int,
  supplier_id bigint references suppliers (id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table reviews (
  id bigint primary key generated always as identity,
  restaurant_id bigint references restaurants (id),
  user_id bigint references users (id),
  rating int check (
    rating >= 1
    and rating <= 5
  ),
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table feedback (
  id bigint primary key generated always as identity,
  restaurant_id bigint references restaurants (id),
  user_id bigint references users (id),
  feedback_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table loyalty_points (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  points int not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table promotions (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  discount_id bigint references discounts (id),
  start_date date,
  end_date date,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table shift_management (
  id bigint primary key generated always as identity,
  worker_id bigint references workers (id),
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table time_tracking (
  id bigint primary key generated always as identity,
  worker_id bigint references workers (id),
  clock_in timestamp with time zone,
  clock_out timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table sales_reports (
  id bigint primary key generated always as identity,
  restaurant_id bigint references restaurants (id),
  report_date date not null,
  total_sales numeric(10, 2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table customer_insights (
  id bigint primary key generated always as identity,
  restaurant_id bigint references restaurants (id),
  insights_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);


-----------------------------------------------------------------
--table logs

CREATE TABLE discounts_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE menu_items_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE users_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE orders_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE order_items_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE workers_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE recipes_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE inventory_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE shift_management_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE reviews_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE feedback_log (
  id bigint primary key generated always as identity,
  operation text check (operation in ('INSERT', 'UPDATE', 'DELETE')) not null,
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

CREATE TABLE error_logs (
    id BIGSERIAL PRIMARY KEY,
    error_message TEXT,
    table_name TEXT,
    operation TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-----------------------------------------------------------------
--table funtions
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO logs (table_name, operation, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO logs (table_name, operation, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO logs (table_name, operation, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
    RETURN OLD;
  END IF;

  RETURN NULL;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error message to a separate error log table or raise an exception
    INSERT INTO error_logs (error_message, table_name, operation, timestamp)
    VALUES (SQLERRM, TG_TABLE_NAME, TG_OP, now());
    
    -- Optionally raise an exception to halt the operation
    RAISE EXCEPTION 'Error in log_changes function: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


-----------------------------------------------------------------
--table triggers
CREATE TRIGGER log_discounts_changes
AFTER INSERT OR UPDATE OR DELETE
ON discounts
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_menu_items_changes
AFTER INSERT OR UPDATE OR DELETE
ON menu_items
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_users_changes
AFTER INSERT OR UPDATE OR DELETE
ON users
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_orders_changes
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_order_items_changes
AFTER INSERT OR UPDATE OR DELETE
ON order_items
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_workers_changes
AFTER INSERT OR UPDATE OR DELETE
ON workers
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_recipes_changes
AFTER INSERT OR UPDATE OR DELETE
ON recipes
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_inventory_changes
AFTER INSERT OR UPDATE OR DELETE
ON inventory
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_shift_management_changes
AFTER INSERT OR UPDATE OR DELETE
ON shift_management
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_reviews_changes
AFTER INSERT OR UPDATE OR DELETE
ON reviews
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER log_feedback_changes
AFTER INSERT OR UPDATE OR DELETE
ON feedback
FOR EACH ROW
EXECUTE FUNCTION log_changes();

---------------------------------------------------------------------------
--funcion para proteger datos de bitacora
/* FUNCTION TO PROTECT DATA */
CREATE OR REPLACE FUNCTION proteger_datos()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent deletion or update
  RAISE EXCEPTION 'Data modification is not allowed in logs';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------------
--triggers para proteger datos de bitacora
CREATE TRIGGER trigger_proteger_datos_bitacora_descuentos
BEFORE DELETE OR UPDATE ON BITACORA_DESCUENTOS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_menu_items
BEFORE DELETE OR UPDATE ON BITACORA_MENU_ITEMS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_usuarios
BEFORE DELETE OR UPDATE ON BITACORA_USUARIOS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_ordenes
BEFORE DELETE OR UPDATE ON BITACORA_ORDENES
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_orden_items
BEFORE DELETE OR UPDATE ON BITACORA_ORDEN_ITEMS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_trabajadores
BEFORE DELETE OR UPDATE ON BITACORA_TRABAJADORES
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_recetas
BEFORE DELETE OR UPDATE ON BITACORA_RECETAS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_inventario
BEFORE DELETE OR UPDATE ON BITACORA_INVENTARIO
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_gestion_turnos
BEFORE DELETE OR UPDATE ON BITACORA_GESTION_TURNOS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_reviews
BEFORE DELETE OR UPDATE ON BITACORA_REVIEWS
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

CREATE TRIGGER trigger_proteger_datos_bitacora_feedback
BEFORE DELETE OR UPDATE ON BITACORA_FEEDBACK
FOR EACH ROW
EXECUTE FUNCTION proteger_datos();

/* FUNCION PARA ENCRIPTAR CONTRASEÑAS */
CREATE OR REPLACE FUNCTION encrypt_passwords()
RETURNS TRIGGER AS $BODY$
BEGIN
    -- Encrypt the password using PGP_SYM_ENCRYPT
    NEW.encrypted_password := PGP_SYM_ENCRYPT(NEW.encrypted_password, 'AES_KEY');

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Log the error message to a separate error log table
        INSERT INTO error_logs (error_message, table_name, operation, timestamp)
        VALUES (SQLERRM, TG_TABLE_NAME, TG_OP, now());

        -- Optionally, you can raise an exception to halt the operation
        RAISE EXCEPTION 'Error encrypting password: %', SQLERRM;

END;
$BODY$ LANGUAGE plpgsql;


/* TRIGGER PARA ENCRIPTAR CONTRASEÑAS */
CREATE TRIGGER encrypt_passwords_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION encrypt_passwords();

------------------------------------------------------------------------------
--encriptacion y desencriptacion de contraseñas
-- Enable the pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;



-- Function to hash passwords with a randomly generated salt
CREATE OR REPLACE FUNCTION hash_passwords()
RETURNS TRIGGER AS $$
DECLARE
    salt TEXT;
BEGIN
    -- Generate a random salt using bcrypt
    salt := gen_salt('bf');  

    -- Hash the password with the salt
    NEW.encrypted_password := crypt(NEW.encrypted_password, salt);
    
    -- Store the salt in a separate column
    NEW.salt := salt; 

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for the users table
CREATE TRIGGER hash_passwords_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION hash_passwords();

-- Function to verify the password
CREATE OR REPLACE FUNCTION verify_password(user_password TEXT, stored_hash TEXT, stored_salt TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Compare the hashed input password with the stored hash
    RETURN crypt(user_password, stored_salt) = stored_hash;
END;
$$ LANGUAGE plpgsql;
