-- CREATE DATABASE nita_shop

CREATE DATABASE nita_shop


-- CREATE TABLE CUSTOMER

CREATE TABLE customer
(
    id integer NOT NULL ,
    username text NOT NULL,
    password text  NOT NULL,
    phone text ,
    address text ,
    CONSTRAINT customer_pkey PRIMARY KEY (username)
)


-- -- CREATE TABLE shoes


CREATE TABLE shoes
(
    id integer NOT NULL,
    shoes_name text ,
    shoes_color text ,
    shoes_price text ,
    shoes_number text ,
    shoes_image text ,
    shoes_catagory text ,
    shoes_quantity text ,
    CONSTRAINT shoes_pkey PRIMARY KEY (id)
)


-- -- -- CREATE TABLE orders


CREATE TABLE orders
(
    id integer NOT NULL ,
    customer text ,
    shoes_id text ,
    shoes_name text ,
    shoes_price text ,
    shoes_catagory text ,
    status text ,
    quantity integer,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
)
