---
layout: default
title: SQL 250+ Formulas
permalink: /sql-250-formulas/
---

## SQL 250+ Formulas

### Basic Retrieval Formulas
- **SELECT**: `SELECT first_name, last_name FROM employees;` — Pulls particular columns from a database table
- **SELECT ***: `SELECT * FROM products;` — Fetch all columns quickly when exploring data
- **DISTINCT**: `SELECT DISTINCT country FROM customers;` — Eliminate duplicate entries and show only unique values
- **FROM (sub-query)**: `SELECT * FROM (SELECT * FROM sales WHERE year=2025) AS y25;` — Use a nested query result as a virtual table
- **AS (alias)**: `SELECT price AS unit_price FROM sales;` — Give a column or table a temporary readable name
- **Literals**: `SELECT 'John' AS name, 123 AS num, NULL AS nothing;` — Insert fixed values directly into query output
- **Expression (arith)**: `SELECT price*qty AS total FROM order_items;` — Calculate new values from existing columns
- **ORDER BY**: `SELECT * FROM students ORDER BY score DESC;` — Arrange results in a specified sequence
- **ASC / DESC**: `SELECT * FROM flights ORDER BY depart_dt ASC;` — Choose between ascending and descending ordering
- **LIMIT**: `SELECT * FROM logs LIMIT 100;` — Return only the first handful of rows for a quick look
- **OFFSET**: `SELECT * FROM logs LIMIT 50 OFFSET 100;` — Skip a number of rows to enable page-by-page browsing
- **FETCH FIRST**: `SELECT * FROM employees ORDER BY hire_date FETCH FIRST 5 ROWS ONLY;` — Standard-compliant way to restrict row count
- **TOP (T-SQL)**: `SELECT TOP 10 * FROM Customers;` — SQL Server shorthand for grabbing the top rows
- **User Variable**: `SET @row_num:=0; SELECT @row_num:=@row_num+1 AS n, name FROM people;` — Hold temporary values within a session for later reuse
- **USE (DB)**: `USE sakila;` — Point the session to a particular database
- **SHOW DATABASES**: `SHOW DATABASES;` — Display every database available on the server
- **SHOW TABLES**: `SHOW TABLES FROM sakila;` — List all tables inside a given database
- **DESCRIBE / DESC**: `DESC employees;` — Quickly view the structure (columns, types) of a table
- **EXPLAIN**: `EXPLAIN SELECT * FROM sales WHERE id=1;` — See how MySQL plans to run a query, useful for spotting slow spots
- **HELP**: `HELP SELECT;` — Access MySQL's built-in reference for any command
- **COMMENT in DDL**: `CREATE TABLE t(id INT COMMENT 'Primary key');` — Add descriptive notes to schema objects
- **Inline Comments**: `-- Single line comment` — Annotate code or temporarily turn off parts of a statement
- **FORCE INDEX()**: `SELECT * FROM t FORCE INDEX(idx_col) WHERE col=1;` — Tell the optimizer to use a particular index
- **SQL_MODE**: `SET sql_mode='STRICT_ALL_TABLES';` — Adjust SQL behavior rules (like strictness) for the session
- **SELECT INTO OUTFILE**: `SELECT * FROM employees INTO OUTFILE '/tmp/emp.csv' FIELDS TERMINATED BY ',';` — Write query results straight to a file on disk
