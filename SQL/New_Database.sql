-- Cleaned up schema

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

create table orders (
  id bigint primary key generated always as identity,
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

create table categories (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

create table users (
  id bigint primary key generated always as identity,
  name text not null,
  email text unique not null,
  phone text,
  user_type text check (user_type in ('client', 'worker')) not null,
  nickname text,
  encrypted_password text,
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

create table payment_methods (
  id bigint primary key generated always as identity,
  name text not null
);

create table order_statuses (
  id bigint primary key generated always as identity,
  name text not null
);

create table preparation_areas (
  id bigint primary key generated always as identity,
  name text not null
);

create table order_preparation (
  id bigint primary key generated always as identity,
  order_id bigint references orders (id),
  preparation_area_id bigint references preparation_areas (id),
  status_id bigint references order_statuses (id),
  updated_at timestamp with time zone default now()
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
