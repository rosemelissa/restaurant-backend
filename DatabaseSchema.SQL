DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS customers;
  
 CREATE TABLE tables (
   table_id serial primary key,
   capacity integer not null
   );
   
  CREATE TABLE customers (
    customer_id serial primary key,
    firstname varchar(255),
    surname varchar(255),
    email varchar(255),
    mailing_list boolean not null
    );

CREATE TABLE bookings (
  booking_id serial primary key,
  customer_id integer not null,
  table_id integer not null,
  date varchar(255) not null,
  time varchar(255) not null,
  CONSTRAINT fk_customer FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_table FOREIGN KEY(table_id) REFERENCES tables(table_id)
  );

/*
The below is to populate the tables table. This records the tables in the 
restauarant and their capacities (number of seats). In my example I have used 
10 tables with tha capacities shown, feel free to adapt the below to fit your restaurant's needs.
*/

INSERT INTO tables(capacity) VALUES (2);
INSERT INTO tables(capacity) VALUES (2);
INSERT INTO tables(capacity) VALUES (2);
INSERT INTO tables(capacity) VALUES (3);
INSERT INTO tables(capacity) VALUES (4);
INSERT INTO tables(capacity) VALUES (4);
INSERT INTO tables(capacity) VALUES (4);
INSERT INTO tables(capacity) VALUES (6);
INSERT INTO tables(capacity) VALUES (10);
INSERT INTO tables(capacity) VALUES (10);