# SQL

-   Domain Specific (Can be used in RDBMS only)
-   Declarative Language (We have to mention just what to do not how to do)

## Types of SQL commands

-   DDL (Works with schema/structure) : CREATE,ALTER,DROP
-   DML (Works with data inside the database schema) : INSERT,UPDATE,DELETE,SELECT
-   DCL (Works with authorization purposes) : GRANT , REVOKE
-   TCL (Transcation realated) : COMMIT , ROLLBACK , SAVEPOINTS

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

-   `UNIQUE` (For unique values)
-   `NOT NULL` (non-empty values)
-   `PRIMARY KEY` (Unique + not null values)
-   `FOREIGN KEY` (Maintains Referential Integrity)
-   `CHECK` (Suppose we want to check the age of person during registration process in a website before inserting into the table)
-   `DEFAULT` (default values if we do not give any values)

## Architectures in Database

### 1 tier architecture

-   Only database layer
-   Example : MS Office,Paint,Photoshop

### 2 tier architecture

-   Client layer & database layer
-   Not scalable,not secure
-   Heavy load on database layer
-   Example : Suppose we go to a bank to create an account,we fill the form then give the accountant the form
    and then accountant from his/her client machine will register our details or in this case data is pushed
    to the database layer.

### 3 tier architecture

-   Client layer , Application/Business layer , & database layer
-   scalable,secure
-   Example : Suppose we we use the official bank mobile app (acts as an interface) to create an account ,then all the details will
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

-   Insert : No violation
-   Update and Delete : May cause violation

<b>Child Table (Referencing Table)</b>

-   Insert : May cause Violation
-   Delete : No violation
-   Update : May cause violation

<b>PostgreSQL supports the following actions:</b>

-   SET NULL
-   SET DEFAULT
-   RESTRICT
-   NO ACTION
-   CASCADE

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

-   Aggreagte Functions
-   Nested,Correlated [Subqueries]
-   GROUP BY
-   HAVING
-   IN , NOT IN
-   EXISTS , NOT EXISTS

### Varchar vs Varchar2

-   Varchar is ANSI standard
-   Varchar2 is Oracles standard

### ACID

-   Atomicity : Either all changes are performed or none of them.
-   Consistency : Data is consistent after and before the transcation.
-   Isolation : Transcation takes place concurrently in an isolated manner.
-   Durability: After a transcation completes successfuly all the data changes persists even after the events of system failure

### Joins

-   Cross Join : Cartesian prodocut of 2 tables (combinations of rows of 2 tables).
-   Self Join : Joininig a table with itself.
-   Natural Join/Inner Join : Returns records matching in both the tables.
-   Left Outer Join : Returns the common records in both the tables as well as records not in right table but in left.Fills the columns not in right table with null.
-   Right Outer Join : Returns the common records in both the tables as well as records not in left table but in right.Fills the columns not in left table with null.

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
