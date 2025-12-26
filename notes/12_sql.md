# SQL

- Domain Specific (Can be used in RDBMS only)
- Declarative Language (We have to mention just what to do not how to do)

## Types of SQL commands

- DDL (Works with schema/structure) : CREATE,ALTER,DROP
- DML (Works with data inside the database schema) : INSERT,UPDATE,DELETE,SELECT
- DCL (Works with authorization purposes) : GRANT , REVOKE
- TCL (Transcation realated) : COMMIT , ROLLBACK , SAVEPOINTS
- DQL (Data Query Language) : SELECT

### CREATE table

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
   column1 datatype(length) column_contraint,
   column2 datatype(length) column_contraint,
   column3 datatype(length) column_contraint,
   table_constraints
);

```

### INSERT into table

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/

```sql

INSERT INTO table_name(column1, column2, …)
VALUES (value1, value2, …);
```

### ALTER TABLE

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/

```sql
ALTER TABLE table_name action;
```

### UPDATE

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/

```sql
UPDATE table_name
SET column1 = value1,
    column2 = value2,
    ...
WHERE condition;
```

### Difference b/w ALTER and UPDATE

| ALTER                                                                      | UPDATE                               |
| -------------------------------------------------------------------------- | ------------------------------------ |
| DDL                                                                        | DML                                  |
| Works with structure schema                                                | Works with change in data            |
| Example : Renaming a column,Changing datatype of a column,droping a column | Update a value inside the column.    |
| No condition                                                               | Can give condition with where clause |

### DELETE

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/

```sql
DELETE FROM table_name
WHERE condition;
```

### DROP

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-table/

```sql
DROP TABLE [IF EXISTS] table_name
[CASCADE | RESTRICT];
```

### TRUNCATE

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table/

```sql
TRUNCATE TABLE table_name;
```

### Difference b/w DELETE,DROP,TRUNCATE

| DELETE                                                               | DROP                     | TRUNCATE                                              |
| -------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| DML                                                                  | DDL                      | DDL                                                   |
| Deletes only rows row                                                | Deletes every row+schema | Deletes only rows                                     |
| Deletes rows one by one (can give where clause)                      | -                        | Deletes rows in one go                                |
| Slower, Rollback possible if done before commit as it maintains logs | -                        | Faster, Rollback not possible as it maintains no logs |

### Constraints

- `UNIQUE` (For unique values)
- `NOT NULL` (non-empty values)
- `PRIMARY KEY` (Unique + not null values)
- `FOREIGN KEY` (Maintains Referential Integrity)
- `CHECK` (Suppose we want to check the age of person during registration process in a website before inserting into the table)
- `DEFAULT` (default values if we do not give any values)

## Architectures in Database

### 1 tier architecture

- Only database layer
- Example : MS Office,Paint,Photoshop

### 2 tier architecture

- Client layer & database layer
- Not scalable,not secure
- Heavy load on database layer
- Example : Suppose we go to a bank to create an account,we fill the form then give the accountant the form
  and then accountant from his/her client machine will register our details or in this case data is pushed
  to the database layer.

### 3 tier architecture

- Client layer , Application/Business layer , & database layer
- scalable,secure
- Example : Suppose we we use the official bank mobile app (acts as an interface) to create an account ,then all the details will
  first go to the Application/Business layer where the details will be processed and then data is pushed into the database layer.

## Different Keys

### Candidate keys

**Set of keys/attributes which have the potential of being the primary key (Uniqe + can be null)**

Example : voter id, social security number, phone number can be the candidates for being primary keys

### Primary keys

Used to uniquely identify tuples in a table (Unique + not null)

<b> Note : There can only be one primary key per table.</b>

### Foreign keys

It is an attribute or set of attribute which references the primary key of same or another table.
Primarily Used for maintaining referential integrity.

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/

```sql
[CONSTRAINT fk_name]
   FOREIGN KEY(fk_columns)
   REFERENCES parent_table(parent_key_columns)
   [ON DELETE delete_action]
   [ON UPDATE update_action]
```

<b>Parent Table (Referenced Table)</b>

- Insert : No violation
- Update and Delete : May cause violation

<b>Child Table (Referencing Table)</b>

- Insert : May cause Violation
- Delete : No violation
- Update : May cause violation

<b>PostgreSQL supports the following actions:</b>

- SET NULL
- SET DEFAULT
- RESTRICT
- NO ACTION
- CASCADE

<b> Note : There can only be more than one foreign key per table.</b>

### Difference between RESTRICT and NO ACTION

RESTRICT blocks updates that would violate the referential integrity of the constraint, while NO ACTION allows updates to proceed without enforcing the constraint.

### Super Key

Supeset of any candidate key (all possible values to uniquely identify two tuples in a table)

Formula : 2^n-k-(2^n-commonsets) , k no of candiate keys

### Difference b/w Nested Subqueries , Correlated Subqueries

| Nested                                                               | Correlated                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Inner query runs first once and acts as a result for the outer query | Outer query runs first and for each outer query inner query runs multiple times |
| Example : IN , NOT IN                                                | Example : EXISTS , NOT EXISTS                                                   |
| Bottom up approach                                                   | Top Down approach                                                               |

### Common things to do

- Aggreagte Functions
- Nested,Correlated [Subqueries]
- GROUP BY
- HAVING
- IN , NOT IN
- EXISTS , NOT EXISTS

### Varchar vs Varchar2

- Varchar is ANSI standard
- Varchar2 is Oracles standard

### ACID

- Atomicity : Either all changes are performed or none of them.
- Consistency : Data is consistent after and before the transcation.
- Isolation : Transcation takes place concurrently in an isolated manner.
- Durability: After a transcation completes successfuly all the data changes persists even after the events of system failure

### Joins

- Cross Join : Cartesian prodocut of 2 tables (combinations of rows of 2 tables).
- Self Join : Joininig a table with itself.
- Natural Join/Inner Join : Returns records matching in both the tables.
- Left Outer Join : Returns the common records in both the tables as well as records not in right table but in left.Fills the columns not in right table with null.
- Right Outer Join : Returns the common records in both the tables as well as records not in left table but in right.Fills the columns not in left table with null.

> Alternate way of inner join

```
select
  pt.patient_id,
  pt.first_name,
  pt.last_name,
  doc.specialty
from
  patients as pt,
  doctors as doc,
  admissions as adm
where
  pt.patient_id = adm.patient_id
  AND adm.attending_doctor_id = doc.doctor_id
  AND adm.diagnosis='Epilepsy'
  AND doc.first_name='Lisa'
```

> Inner Joins Syntax

```
SELECT
  p.patient_id,
  p.first_name AS patient_first_name,
  p.last_name AS patient_last_name,
  ph.specialty AS attending_doctor_specialty
FROM patients p
  JOIN admissions a ON a.patient_id = p.patient_id
  JOIN doctors ph ON ph.doctor_id = a.attending_doctor_id
WHERE
  ph.first_name = 'Lisa' and
  a.diagnosis = 'Epilepsy'
```

Link : https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/

### SQL Cheatsheet

---

## Table Operations

> Create

```sql
CREATE TABLE products (
    code INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prod_name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    release_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--  DEFAULT NOW()
--  DEFAULT CURRENT_TIMESTAMP

-- TIMESTAMP WITHOUT TIME ZONE
-- TIMESTAMP

-- Composite primary key
CREATE TABLE products (
    code INT GENERATED ALWAYS AS IDENTITY,
    prod_name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_prod PRIMARY KEY (code, prod_name)
);
```

Note: `GENERATED ALWAYS AS IDENTITY` auto-generates values, no manual insert allowed

> Drop / Truncate

```sql
DROP TABLE products;
TRUNCATE TABLE products;
```

> Copy Table

```sql
CREATE TABLE prod_bkp AS (SELECT * FROM products WHERE 1=2);  -- structure only
CREATE TABLE prod_bkp AS (SELECT * FROM products);            -- structure + data
```

---

## CRUD Operations

> Insert

```sql
INSERT INTO products(prod_name, price, release_date)
VALUES ('name-1', 12.23, to_date('31-10-2025','dd-mm-yyyy'));

INSERT INTO products(prod_name, price, release_date)
VALUES ('name-2', 15.23, to_timestamp('31-12-2025 13:08:07','dd-mm-yyyy hh24:mi:ss'));
```

> Update

```sql
UPDATE products SET prod_name='updated-1', price=51.23 WHERE code=1;
```

Note: Without `WHERE`, all rows will be updated

> Delete

```sql
DELETE FROM products WHERE code=1;
```

Note: Without `WHERE`, all rows will be deleted

---

## Alter Operations

```sql
ALTER TABLE products RENAME TO test1;                             -- rename table
ALTER TABLE test1 RENAME COLUMN price TO prize;                   -- rename column
ALTER TABLE test1 ALTER COLUMN prize TYPE FLOAT;                  -- change data type
ALTER TABLE test1 ALTER COLUMN prize SET NOT NULL;                -- add NOT NULL
ALTER TABLE test1 ALTER COLUMN prize DROP NOT NULL;               -- drop NOT NULL
ALTER TABLE products ADD CONSTRAINT uq_name UNIQUE (prod_name);   -- add constraint
ALTER TABLE products DROP CONSTRAINT uq_name;                     -- drop constraint
```

Note: PostgreSQL columns are nullable by default

---

## Constraints

> PRIMARY KEY

```sql
-- Inline
CREATE TABLE products (
    id INT PRIMARY KEY
);

-- Named
CREATE TABLE products (
    id INT,
    code INT,
    CONSTRAINT pk_products PRIMARY KEY (id, code)
);
```

> FOREIGN KEY

```sql
-- Inline
CREATE TABLE orders (
    id INT PRIMARY KEY,
    product_id INT REFERENCES products(id)
);

-- Named with ON DELETE
CREATE TABLE orders (
    id INT PRIMARY KEY,
    product_id INT,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

| Option        | Meaning                           |
| ------------- | --------------------------------- |
| `CASCADE`     | Delete child rows                 |
| `SET NULL`    | Set child column to NULL          |
| `SET DEFAULT` | Set child column to default value |
| `RESTRICT`    | Prevent deletion if child exists  |
| `NO ACTION`   | Same as RESTRICT (default)        |

> NOT NULL

```sql
CREATE TABLE products (
    prod_name VARCHAR(255) NOT NULL
);
```

> UNIQUE

```sql
-- Inline
CREATE TABLE users (
    email VARCHAR(255) UNIQUE
);

-- Named
CREATE TABLE users (
    email VARCHAR(255),
    CONSTRAINT uq_email UNIQUE (email)
);
```

> CHECK

```sql
-- Inline
CREATE TABLE products (
    price NUMERIC(10,2) CHECK (price > 0)
);

-- Named
CREATE TABLE products (
    price NUMERIC(10,2),
    CONSTRAINT chk_price CHECK (price > 0)
);
```

> DEFAULT

```sql
CREATE TABLE products (
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);
```

---

## Filtering & Pattern Matching

> LIKE / ILIKE

```sql
SELECT * FROM products WHERE prod_name LIKE '%name%';       -- case-sensitive
SELECT * FROM products WHERE prod_name ILIKE '%NAME%';      -- case-insensitive
SELECT * FROM products WHERE prod_name NOT LIKE '%name%';
```

Note: `%` = 0 or more characters, `_` = single character

> Regex Matching

```sql
SELECT * FROM products WHERE prod_name ~ '^name';    -- case-sensitive
SELECT * FROM products WHERE prod_name ~* '^NAME';   -- case-insensitive
SELECT * FROM products WHERE prod_name !~ '^name';   -- NOT match
```

> BETWEEN / IN / NULL

```sql
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
SELECT * FROM products WHERE prod_name IN ('name-1', 'name-2');
SELECT * FROM products WHERE prod_name NOT IN ('name-1', 'name-2');
SELECT * FROM products WHERE release_date IS NULL;
SELECT * FROM products WHERE release_date IS NOT NULL;
```

> LOWER / UPPER

```sql
SELECT LOWER(prod_name), UPPER(prod_name) FROM products;
SELECT * FROM products WHERE LOWER(prod_name) = 'name-1';
```

---

## Date Operations

> Insert with Date

```sql
INSERT INTO products(prod_name, price, release_date)
VALUES ('name-1', 12.23, to_date('31-10-2025','dd-mm-yyyy'));

INSERT INTO products(prod_name, price, release_date)
VALUES ('name-2', 15.23, to_timestamp('31-12-2025 13:08:07','dd-mm-yyyy hh24:mi:ss'));
```

> Filter by Date

```sql
SELECT * FROM products WHERE release_date BETWEEN '2025-01-01' AND '2025-12-31';
SELECT * FROM products WHERE EXTRACT(YEAR FROM release_date) = 2025;
SELECT * FROM products WHERE to_char(release_date, 'yyyy') = '2025';
```

> Index

```sql
CREATE INDEX contacts_name
ON contacts(name);
```

> Case statements

```sql
SELECT product_name,
CASE
  WHEN price < 10 THEN 'Low price product'
  WHEN price > 50 THEN 'High price product'
ELSE
  'Normal product'
END
FROM products;
```

> Orders

"Friendly Jaguars Wear Green Hats, Serve Delicious Orange Lunches"

FROM
JOIN / ON
WHERE
GROUP BY
HAVING
SELECT
DISTINCT
ORDER BY
LIMIT / OFFSET

Note:

- cannot drop a table which is being referred(used) by other table.
- First drop the child table which refers other tables

> Group By

- can only have agg func
- only columns inside group by

Note : add conditions join to also include null values

> Case Study

Below is sales data:

```sql
drop table if exists products;
create table products
(
	id				    int generated always as identity primary key,
	name			    varchar(100),
	price			    float,
	release_date 	date
);
insert into products
values(default,'iPhone 15', 800, to_date('22-08-2023','dd-mm-yyyy'));
insert into products
values(default,'Macbook Pro', 2100, to_date('12-10-2022','dd-mm-yyyy'));
insert into products
values(default,'Apple Watch 9', 550, to_date('04-09-2022','dd-mm-yyyy'));
insert into products
values(default,'iPad', 400, to_date('25-08-2020','dd-mm-yyyy'));
insert into products
values(default,'AirPods', 420, to_date('30-03-2024','dd-mm-yyyy'));

drop table if exists customers;
create table customers
(
    id         int generated always as identity primary key,
    name       varchar(100),
    email      varchar(30)
);
insert into customers values(default,'Meghan Harley', 'mharley@demo.com');
insert into customers values(default,'Rosa Chan', 'rchan@demo.com');
insert into customers values(default,'Logan Short', 'lshort@demo.com');
insert into customers values(default,'Zaria Duke', 'zduke@demo.com');

drop table if exists employees;
create table employees
(
    id         int generated always as identity primary key,
    name       varchar(100)
);
insert into employees values(default,'Nina Kumari');
insert into employees values(default,'Abrar Khan');
insert into employees values(default,'Irene Costa');

drop table if exists sales_order;
create table sales_order
(
	order_id		  int generated always as identity primary key,
	order_date	  date,
	quantity		  int,
	prod_id			  int references products(id),
	status			  varchar(20),
	customer_id		int references customers(id),
	emp_id			  int,
	constraint fk_so_emp foreign key (emp_id) references employees(id)
);
insert into sales_order
values(default,to_date('01-01-2024','dd-mm-yyyy'),2,1,'Completed',1,1);
insert into sales_order
values(default,to_date('01-01-2024','dd-mm-yyyy'),3,1,'Pending',2,2);
insert into sales_order
values(default,to_date('02-01-2024','dd-mm-yyyy'),3,2,'Completed',3,2);
insert into sales_order
values(default,to_date('03-01-2024','dd-mm-yyyy'),3,3,'Completed',3,2);
insert into sales_order
values(default,to_date('04-01-2024','dd-mm-yyyy'),1,1,'Completed',3,2);
insert into sales_order
values(default,to_date('04-01-2024','dd-mm-yyyy'),1,3,'completed',2,1);
insert into sales_order
values(default,to_date('04-01-2024','dd-mm-yyyy'),1,2,'On Hold',2,1);
insert into sales_order
values(default,to_date('05-01-2024','dd-mm-yyyy'),4,2,'Rejected',1,2);
insert into sales_order
values(default,to_date('06-01-2024','dd-mm-yyyy'),5,5,'Completed',1,2);
insert into sales_order
values(default,to_date('06-01-2024','dd-mm-yyyy'),1,1,'Cancelled',1,1);
insert into sales_order
values(default,to_date('06-01-2024','dd-mm-yyyy'),1,1,'Pending',1,1);

SELECT * FROM products;
SELECT * FROM customers;
SELECT * FROM employees;
SELECT * FROM sales_order;

select distinct status from sales_order;
```

1. Identify the total no of products sold

```sql
select sum(quantity) as total_products_sold from sales_order;
```

2. Other than Completed, display the available delivery status's

```sql
select distinct(status) from sales_order where status NOT ILIKE 'completed';
```

3. Display the order id, order_date and product_name for all the completed orders.

```sql
select
  *
from
  sales_order so
  inner join products p on p.id = so.prod_id
where
  status ilike 'completed';
```

4. Sort the above query to show the earliest orders at the top. Also, display the customer who purchased these orders.

```sql
select
  so.order_id,
  so.order_date,
  p.name as product,
  c.name as customer
from
  sales_order so
  join products p on p.id = so.prod_id
  join customers c on c.id = so.customer_id
where
  lower(so.status) = 'completed'
order by
  so.order_date;
```

5. Display the total no of orders corresponding to each delivery status

Note: Every column in SELECT must be either

in the GROUP BY, or

inside an aggregate function (MAX, SUM, AVG, etc.)

```sql
select status,count(*) from sales_order group by status;
```

6. How many orders are still not completed for orders purchasing more than 1 item?

```sql
select
  count(*)
from
  sales_order
where
  status ilike 'completed'
  and quantity > 1;
```

7. Find the total number of orders corresponding to each delivery status by ignoring the case in the delivery status.

```sql
select
  count(*),
  lower(status)
from
  sales_order
group by
  lower(status)
order by
  count desc;
```

8. Write a query to identify the total products purchased by each customer

```sql
select
  c.name,
  sum(so.quantity)
from
  sales_order so
  inner join customers c on c.id = so.customer_id
group by
  c.name;
```

9. Display the total sales and average sales done for each day.

```sql
select
  sum(p.price * so.quantity) as total_sale,
  avg(quantity * p.price) as avg_sales,
  order_date
from
  sales_order so
  inner join products p on so.prod_id = p.id
group by
  order_date
order by
  total_sale desc
```

10. Display the customer name, employee name, and total sale amount of all orders which are either on hold or pending.

```sql
select
  c.name as customer_name,
  e.name as employee_name,
  sum(p.price * so.quantity) as total_sales
from
  sales_order so
  inner join customers c on c.id = so.customer_id
  inner join employees e on e.id = so.emp_id
  inner join products p on p.id = so.prod_id
where
  status = 'On Hold'
  or status = 'Pending'
group by
  e.name,
  c.name;
```

11. Fetch all the orders which were neither completed/pending or were handled by the employee Abrar. Display employee name aswell

```sql
select
  e.name,
  so.*
from
  sales_order so
  inner join employees e on so.emp_id = e.id
where
  lower(so.status) not in ('complete', 'pending')
  or e.name ilike 'Abrar';
```

12. Fetch the orders which cost more than 2000 but did not include the MacBook Pro. Print the total sale amount as well.

```sql
select
  (p.price * so.quantity) as price,p.name
from
  sales_order so
  inner join products p on p.id = so.prod_id
where
  p.name not ilike '%macbook%'
```

13. Identify the customers who have not purchased any product yet.

```sql
select * from customers where customers.id not in (select sales_order.customer_id from sales_order);
```

14. Write a query to identify the total products purchased by each customer.
    Return all customers irrespective of whether they have made a purchase or not.
    Sort the result with the highest no of orders at the top.

```sql
select
  c.name,
  coalesce(sum(so.quantity),0) as qty
from
  customers c
  left join sales_order so on c.id = so.customer_id
group by
  c.name
order by
  qty desc;
```

15. Corresponding to each employee, display the total sales they made of
    all the completed orders. Display total sales as 0 if an employee made no sales yet.

```sql
select
  e.name,
  coalesce(sum(p.price * so.quantity), 0) as total_sale
from
  sales_order so
  inner join products p on p.id = so.prod_id
  right join employees e on e.id = so.emp_id
  and lower(so.status) = 'completed'
group by
  e.name
order by
  total_sale desc;
```

16. Re-write the above query to display the total sales made by each employee
    corresponding to each customer. If an employee has not served a customer
    yet then display "-" under the customer.

```sql
select
  coalesce(sum(so.quantity * p.price), 0) as total_sales,
  coalesce(c.name, '-') as customer_name,
  e.name as emp_name
from
  sales_order so
  inner join products p on p.id = so.prod_id
  inner join customers c on c.id = so.customer_id
  right join employees e on e.id = so.emp_id and lower(so.status) = 'completed'
group by
  e.name,
  c.name
order by
  total_sales desc;
```

17. Re-write the above query to display only those records where the total sales are above 1000.

```sql
select
  coalesce(sum(so.quantity * p.price), 0) as total_sales,
  coalesce(c.name, '-') as customer_name,
  e.name as emp_name
from
  sales_order so
  inner join products p on p.id = so.prod_id
  inner join customers c on c.id = so.customer_id
  right join employees e on e.id = so.emp_id
  and lower(so.status) = 'completed'
group by
  e.name,
  c.name
having
  sum(so.quantity * p.price) > 1000
order by
  total_sales desc;
```

18. Identify employees who have served more than 2 customers.

```sql
select
  e.name,
  count(distinct (c.name)) as customer_served
from
  employees e
  inner join sales_order so on so.emp_id = e.id
  inner join customers c on c.id = so.customer_id
group by
  e.name
having
  count(distinct (c.name)) > 2;
```

19. Identify the customers who have purchased more than 5 products

```sql
select c.name,sum(so.quantity) as qty
from customers c
inner join sales_order so on so.customer_id=c.id
group by c.name
  having sum(so.quantity)>5;
```

20. Identify customers whose average purchase cost exceeds the average sale of all the orders.

```sql
select c.name,avg(so.quantity*p.price) as avg_cost
from customers c
inner join sales_order so on so.customer_id=c.id
inner join products p on p.id=so.prod_id
group by c.name
having (avg(so.quantity*p.price))>(
  select avg(p.price*so.quantity)
  from sales_order so
  inner join products p on p.id=so.prod_id
)
```
