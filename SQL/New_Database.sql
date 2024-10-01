-- Migrations will appear here as you chat with AI

create table categories (
  id bigint primary key generated always as identity,
  name text not null,
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