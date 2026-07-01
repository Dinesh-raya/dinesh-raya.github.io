---
layout: default
title: SQL 250+ Formulas
permalink: /sql-250-formulas/
---

## SQL 250+ Formulas

### Basic Retrieval Formulas
- **SELECT**: `SELECT first_name, last_name FROM employees;` — Pulls particular columns from a database table
- **SELECT ***: `SELECT * FROM products;` — Grabs every column, handy for initial data exploration
- **DISTINCT**: `SELECT DISTINCT country FROM customers;` — Eliminates duplicate rows to show only unique values
- **FROM (sub-query)**: `SELECT * FROM (SELECT * FROM sales WHERE year=2025) AS y25;` — Uses an inner query result as a virtual input table
- **AS (alias)**: `SELECT price AS unit_price FROM sales;` — Gives a column or table a temporary friendly name
- **Literals**: `SELECT 'John' AS name, 123 AS num, NULL AS nothing;` — Inserts hard-coded values straight into the output
- **Expression (arith)**: `SELECT price*qty AS total FROM order_items;` — Calculates new values directly inside the query
- **ORDER BY**: `SELECT * FROM students ORDER BY score DESC;` — Sorts the result set by one or more columns
- **ASC / DESC**: `SELECT * FROM flights ORDER BY depart_dt ASC;` — Chooses ascending (low-to-high) or descending (high-to-low) sort order
- **LIMIT**: `SELECT * FROM logs LIMIT 100;` — Cuts the output to only the first N rows
- **OFFSET**: `SELECT * FROM logs LIMIT 50 OFFSET 100;` — Skips a number of rows before returning results, great for pagination
- **FETCH FIRST**: `SELECT * FROM employees ORDER BY hire_date FETCH FIRST 5 ROWS ONLY;` — ANSI-standard way to restrict row count
- **TOP (T-SQL)**: `SELECT TOP 10 * FROM Customers;` — SQL Server's non-standard equivalent of LIMIT
- **User Variable**: `SET @row_num:=0; SELECT @row_num:=@row_num+1 AS n, name FROM people;` — Stores a value in a session variable for reuse later
- **USE (DB)**: `USE sakila;` — Switches the active database context
- **SHOW DATABASES**: `SHOW DATABASES;` — Lists every database on the server
- **SHOW TABLES**: `SHOW TABLES FROM sakila;` — Lists every table inside a specific database
- **DESCRIBE / DESC**: `DESC employees;` — Shows the column structure (names, types, nullability) of a table
- **EXPLAIN**: `EXPLAIN SELECT * FROM sales WHERE id=1;` — Displays how the query executor plans to run the statement
- **HELP**: `HELP SELECT;` — Brings up built-in MySQL documentation for a keyword
- **COMMENT in DDL**: `CREATE TABLE t(id INT COMMENT 'Primary key');` — Attaches a human-readable note to a schema object like a column
- **Inline Comments**: `-- Single line comment` — Lets you annotate SQL code or temporarily disable part of a query
- **FORCE INDEX()**: `SELECT * FROM t FORCE INDEX(idx_col) WHERE col=1;` — Tells the optimizer to use a specific index regardless of cost estimates
- **SQL_MODE**: `SET sql_mode='STRICT_ALL_TABLES';` — Adjusts SQL behavior like strictness or compatibility for the session
- **SELECT INTO OUTFILE**: `SELECT * FROM employees INTO OUTFILE '/tmp/emp.csv' FIELDS TERMINATED BY ',';` — Writes query results directly to a file on the server

### Filtering & Boolean Logic Formulas
- **WHERE**: `SELECT * FROM orders WHERE amount > 500;` — Restricts rows to those meeting a specified condition
- **AND / OR / NOT**: `SELECT * FROM users WHERE active=1 AND NOT country='IN';` — Combines multiple filter conditions with logical operators
- **Comparison Operators**: `SELECT * FROM items WHERE qty <> 0;` — Compares column values against constants or other columns (=, <>, >, <, >=, <=)
- **BETWEEN**: `WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31';` — Filters for values that fall inside an inclusive range
- **NOT BETWEEN**: `WHERE age NOT BETWEEN 18 AND 30;` — Excludes rows whose values lie inside a given range
- **IN**: `WHERE status IN ('NEW','PENDING');` — Checks if a value matches any item in a provided list
- **NOT IN**: `WHERE status NOT IN ('CANCELLED');` — Excludes rows where the value appears in a given list
- **LIKE**: `WHERE name LIKE 'A%';` — Searches text using `%` (any sequence) and `_` (single char) wildcards
- **NOT LIKE**: `WHERE code NOT LIKE 'ERR%';` — Removes rows whose text matches the given wildcard pattern
- **REGEXP / RLIKE**: `WHERE email REGEXP '@gmail\\.com$';` — Matches column text against a regular expression pattern
- **NOT REGEXP**: `WHERE phone NOT REGEXP '^\\+91';` — Excludes rows whose text matches a regex pattern
- **IS NULL**: `WHERE manager_id IS NULL;` — Finds rows where a column holds a missing (NULL) value
- **IS NOT NULL**: `WHERE manager_id IS NOT NULL;` — Finds rows where a column contains a real value (not NULL)
- **EXISTS**: `WHERE EXISTS (SELECT 1 FROM payments p WHERE p.order_id=o.id);` — Returns rows only when a subquery yields at least one result
- **NOT EXISTS**: `WHERE NOT EXISTS (SELECT 1 FROM blacklist b WHERE b.user_id=u.id);` — Returns rows only when a subquery yields zero results
- **ANY / SOME / ALL**: `WHERE salary > ALL (SELECT salary FROM staff WHERE dept='HR');` — Compares a column against every value returned by a subquery
- **CASE WHEN**: `SELECT CASE WHEN score>=60 THEN 'Pass' ELSE 'Fail' END AS result FROM tests;` — Creates conditional columns with if-then-else logic
- **IF() (MySQL)**: `SELECT IF(qty>0,'In Stock','Out') FROM products;` — MySQL shorthand for a simple inline conditional expression
- **COALESCE**: `SELECT COALESCE(nickname,name) AS display_name FROM users;` — Returns the first argument that is not NULL
- **NULLIF**: `SELECT NULLIF(col1,col2) AS diff FROM t;` — Evaluates to NULL when both arguments are equal, otherwise returns the first
- **GREATEST / LEAST**: `SELECT GREATEST(q1,q2,q3) AS best FROM scores;` — Picks the largest (or smallest) value from a list of columns
- **INTERVAL()**: `SELECT INTERVAL(score,50,60,70) AS grade_band FROM exams;` — Returns the index of the bucket into which a value falls
- **Row Sub-query**: `WHERE (a,b) IN (SELECT x,y FROM t2);` — Compares multiple columns as a composite key against a subquery result
- **WITH RECURSIVE**: `WITH RECURSIVE nums AS (...) SELECT * FROM nums;` — Builds recursive CTEs for hierarchical or sequential data

### Set & Join Operations Formulas
- **INNER JOIN**: `SELECT e.name,d.name FROM emp e INNER JOIN dept d ON e.dept_id=d.id;` — Returns only rows where the join condition is met in both tables
- **LEFT JOIN**: `SELECT * FROM a LEFT JOIN b ON a.id=b.id;` — Preserves every row from the left table, filling in NULLs when no match exists on the right
- **RIGHT JOIN**: `SELECT * FROM a RIGHT JOIN b ON a.id=b.id;` — Preserves every row from the right table, filling in NULLs when no match exists on the left
- **CROSS JOIN**: `SELECT * FROM colors CROSS JOIN sizes;` — Produces every possible combination (Cartesian product) of the two tables
- **NATURAL JOIN**: `SELECT * FROM t1 NATURAL JOIN t2;` — Joins tables automatically on columns that share the same name
- **SELF JOIN**: `SELECT a.name,b.name FROM employees a JOIN employees b ON a.manager_id=b.id;` — Joins a table to itself to compare rows within the same table
- **USING()**: `SELECT * FROM orders JOIN customers USING(customer_id);` — A shorter join syntax when the foreign key column name is identical in both tables
- **UNION**: `SELECT city FROM a UNION SELECT city FROM b;` — Stacks two result sets vertically, removing any duplicate rows
- **UNION ALL**: `SELECT city FROM a UNION ALL SELECT city FROM b;` — Stacks result sets vertically, keeping duplicates for faster performance
- **INTERSECT**: `SELECT id FROM a INTERSECT SELECT id FROM b;` — Returns only rows that appear in both result sets
- **EXCEPT**: `SELECT id FROM a EXCEPT SELECT id FROM b;` — Returns rows from the first query that are absent in the second
- **APPLY (T-SQL)**: `SELECT * FROM a CROSS APPLY dbo.fn(a.id);` — Invokes a table-valued function once for every row in the outer table (SQL Server)
- **Join ON TRUE**: `SELECT * FROM a LEFT JOIN b ON TRUE;` — Emulates a FULL OUTER JOIN in MySQL by unioning LEFT and RIGHT joins
- **WINDOW clause**: `SELECT sum(v) OVER w FROM t WINDOW w AS (PARTITION BY c);` — Names a window specification so it can be reused across multiple functions
- **LATERAL**: `SELECT * FROM t1, LATERAL (SELECT MAX(val) m FROM t2 WHERE t2.id=t1.id) AS x;` — Lets a subquery reference columns from tables that appear before it in the FROM clause
- **MERGE**: `MERGE INTO dest USING src ON(dest.id=src.id) WHEN MATCHED THEN UPDATE SET ...;` — Performs an upsert (insert or update) in a single atomic statement (ANSI SQL)
- **PIVOT / UNPIVOT**: `SELECT ... PIVOT(SUM(amt) FOR qtr IN ('Q1','Q2','Q3','Q4')) AS p;` — Rotates row values into column headers (or vice versa) for reporting

### Aggregation & Grouping Formulas
- **GROUP BY**: `SELECT dept,COUNT(*) c FROM emp GROUP BY dept;` — Groups rows that share the same values in specified columns for aggregate computation
- **HAVING**: `SELECT dept,COUNT(*) c FROM emp GROUP BY dept HAVING c>5;` — Filters groups after aggregation, just like WHERE filters rows before
- **COUNT()**: `SELECT COUNT(*) FROM t;` — Counts the number of rows or non-NULL values in a group
- **SUM() / AVG() / MIN() / MAX()**: `SELECT AVG(salary) FROM emp;` — Computes the total, average, minimum, or maximum of a numeric column
- **GROUP_CONCAT()**: `SELECT GROUP_CONCAT(name ORDER BY name) FROM products;` — Concatenates values from grouped rows into a single string, optionally ordered
- **ROLLUP**: `GROUP BY year,quarter WITH ROLLUP;` — Generates subtotal rows at each hierarchy level plus a grand total
- **CUBE**: `GROUP BY CUBE(year,quarter);` — Produces subtotals for every combination of the grouping columns
- **GROUPING SETS**: `GROUP BY GROUPING SETS ((year,quarter),(year),());` — Defines exactly which grouping combinations to aggregate rather than all possible ones
- **ANY_VALUE()**: `SELECT year,ANY_VALUE(product) FROM sales GROUP BY year;` — Returns an arbitrary value from a non-aggregated column, bypassing ONLY_FULL_GROUP_BY restrictions
- **STDDEV() / VARIANCE()**: `SELECT STDDEV(population) FROM cities;` — Measures statistical dispersion (how spread out the values are)

### Window Functions Formulas
- **ROW_NUMBER()**: `SELECT ROW_NUMBER() OVER(ORDER BY score DESC) AS rnk FROM exams;` — Assigns a unique sequential integer to each row within the window partition
- **RANK()**: `SELECT RANK() OVER(PARTITION BY dept ORDER BY salary DESC) r FROM emp;` — Ranks rows with gaps when ties occur (1, 1, 3, 4)
- **DENSE_RANK()**: `SELECT DENSE_RANK() OVER(PARTITION BY dept ORDER BY salary DESC) dr FROM emp;` — Ranks rows consecutively without gaps (1, 1, 2, 3)
- **NTILE()**: `SELECT NTILE(4) OVER(ORDER BY salary) quartile FROM emp;` — Divides rows into a specified number of roughly equal buckets
- **LAG()**: `SELECT year,sales,LAG(sales) OVER(ORDER BY year) prev FROM rev;` — Fetches the value from the row that comes before the current row
- **LEAD()**: `SELECT year,sales,LEAD(sales) OVER(ORDER BY year) next FROM rev;` — Fetches the value from the row that comes after the current row
- **FIRST_VALUE()**: `SELECT FIRST_VALUE(price) OVER(ORDER BY dt) AS first_price FROM btc;` — Returns the first value in the window frame
- **LAST_VALUE()**: `SELECT LAST_VALUE(price) OVER(ORDER BY dt RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) last_price FROM btc;` — Returns the last value in the window frame
- **NTH_VALUE()**: `SELECT NTH_VALUE(sales,3) OVER(ORDER BY year) AS third_year FROM rev;` — Returns the Nth value from the window frame
- **CUME_DIST()**: `SELECT CUME_DIST() OVER(ORDER BY score) cd FROM exams;` — Calculates the cumulative distribution (relative position) of a row
- **PERCENT_RANK()**: `SELECT PERCENT_RANK() OVER(ORDER BY score) pr FROM exams;` — Computes the relative rank of a row as a fraction between 0 and 1
- **ROWS BETWEEN**: `SUM(sales) OVER(PARTITION BY prod ORDER BY dt ROWS BETWEEN 3 PRECEDING AND CURRENT ROW);` — Defines a physical window frame based on row offsets
- **RANGE BETWEEN**: `AVG(price) OVER(ORDER BY dt RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW);` — Defines a logical window frame based on value ranges
- **EXCLUDE CURRENT ROW**: `AVG(score) OVER(ORDER BY score DESC EXCLUDE CURRENT ROW);` — Removes the current row from the window frame calculation
- **WINDOW NAMED clause**: `SELECT SUM(v) OVER w FROM t WINDOW w AS (PARTITION BY c);` — Defines a reusable window spec to avoid repeating the same OVER clause

### String Functions Formulas
- **CONCAT()**: `SELECT CONCAT(first,' ',last) AS fullname FROM users;` — Joins two or more strings end-to-end
- **CONCAT_WS()**: `SELECT CONCAT_WS('-',year,month,day) FROM dates;` — Concatenates strings with a separator placed between each element
- **SUBSTRING()**: `SELECT SUBSTRING(code,1,3) FROM sku;` — Extracts a portion of a string starting at a given position
- **LEFT()**: `SELECT LEFT(name,5) FROM customers;` — Takes a specified number of characters from the beginning of a string
- **RIGHT()**: `SELECT RIGHT(name,4) FROM customers;` — Takes a specified number of characters from the end of a string
- **LENGTH()**: `SELECT LENGTH(title) FROM books;` — Returns the byte length of a string
- **CHAR_LENGTH()**: `SELECT CHAR_LENGTH(title) FROM books;` — Returns the number of characters (not bytes) in a string
- **OCTET_LENGTH()**: `SELECT OCTET_LENGTH(title) FROM books;` — Returns the string length in bytes, useful for multibyte character sets
- **TRIM()**: `SELECT TRIM(' xyz ') AS t;` — Strips leading and trailing spaces from a string
- **LTRIM()**: `SELECT LTRIM(' abc');` — Removes leading (left-side) spaces only
- **RTRIM()**: `SELECT RTRIM('abc ');` — Removes trailing (right-side) spaces only
- **LOWER()**: `SELECT LOWER(city) FROM locations;` — Converts every character in a string to lowercase
- **UPPER()**: `SELECT UPPER(city) FROM locations;` — Converts every character in a string to uppercase
- **REPLACE()**: `SELECT REPLACE(txt,'foo','bar') FROM msgs;` — Substitutes every occurrence of a substring with a new string
- **INSERT()**: `SELECT INSERT('ABCDE',3,2,'--') AS new;` — Replaces a substring starting at a given position with a specified length
- **SUBSTRING_INDEX()**: `SELECT SUBSTRING_INDEX(email,'@',1) FROM users;` — Returns the part of a string before (or after) a delimiter occurrence
- **LOCATE()**: `SELECT LOCATE('ab',text) FROM docs;` — Finds the starting position of a substring within a string
- **INSTR()**: `SELECT INSTR(text,'ab') FROM docs;` — Same as LOCATE but with the argument order reversed (string, substring)
- **POSITION()**: `SELECT POSITION('ab' IN text) FROM docs;` — ANSI SQL equivalent of LOCATE using keyword syntax
- **REPEAT()**: `SELECT REPEAT('*',5);` — Returns a string formed by repeating the input N times
- **REVERSE()**: `SELECT REVERSE(name) FROM people;` — Returns the string with its characters in reverse order
- **LPAD()**: `SELECT LPAD(num,4,'0') FROM seq;` — Pads the left side of a string with given characters until it reaches a target length
- **RPAD()**: `SELECT RPAD(num,4,'0') FROM seq;` — Pads the right side of a string with given characters until it reaches a target length
- **FORMAT()**: `SELECT FORMAT(12345.678,2);` — Formats a number with grouped thousands and a specified number of decimal places
- **QUOTE()**: `SELECT QUOTE("O'Reilly");` — Returns a string properly escaped and quoted for safe SQL insertion
- **ELT()**: `SELECT ELT(2,'x','y','z');` — Returns the Nth element from a list of strings
- **FIELD()**: `SELECT FIELD('y','x','y','z');` — Returns the index (position) of a value within a list of strings
- **MAKE_SET()**: `SELECT MAKE_SET(5,'a','b','c','d');` — Creates a comma-separated string from the bits set in a number
- **FIND_IN_SET()**: `SELECT FIND_IN_SET('b','a,b,c');` — Locates a string inside a comma-separated list and returns its position
- **SOUNDEX()**: `SELECT SOUNDEX('juice');` — Generates a phonetic hash code representing how a word sounds
- **DIFFERENCE()**: `SELECT DIFFERENCE('juice','juce');` — Compares the Soundex codes of two strings and returns a similarity score (SQL Server)
- **HEX()**: `SELECT HEX('abc');` — Converts a string to its hexadecimal representation
- **UNHEX()**: `SELECT UNHEX('616263');` — Converts a hexadecimal string back to a readable binary string
- **UUID()**: `SELECT UUID();` — Generates a universally unique identifier (UUID)
- **SPACE()**: `SELECT CONCAT('Hi',SPACE(3),'Bye');` — Inserts a specific number of space characters
- **CHAR()**: `SELECT CHAR(65,66,67);` — Converts one or more ASCII codes into their corresponding characters
- **CHARSET()**: `SELECT CHARSET('abc');` — Returns the character set of the input string
- **COLLATION()**: `SELECT COLLATION('abc');` — Shows the collation (sorting/comparison rule) used for the string
- **MD5()**: `SELECT MD5('password');` — Computes the 128-bit MD5 hash of a string
- **SHA2()**: `SELECT SHA2('password',256);` — Generates a SHA-2 hash of the specified bit length (224, 256, 384, 512)

### Numeric Functions Formulas
- **ABS()**: `SELECT ABS(-9);` — Returns the absolute (non-negative) value of a number
- **SIGN()**: `SELECT SIGN(-9);` — Returns -1, 0, or 1 indicating whether the input is negative, zero, or positive
- **CEIL()**: `SELECT CEIL(4.2);` — Rounds a number up to the nearest integer
- **FLOOR()**: `SELECT FLOOR(4.8);` — Rounds a number down to the nearest integer
- **ROUND()**: `SELECT ROUND(4.567,2);` — Rounds a number to a specified number of decimal places
- **TRUNCATE()**: `SELECT TRUNCATE(123.456,1);` — Truncates a number to a given number of decimal places without rounding
- **MOD()**: `SELECT MOD(11,4);` — Returns the remainder (modulo) of a division operation
- **% operator**: `SELECT 11 % 4;` — Alternate operator syntax for the modulo operation
- **POWER()**: `SELECT POWER(2,8);` — Raises a base number to the power of an exponent
- **EXP()**: `SELECT EXP(1);` — Returns Euler's number e raised to the power of the argument
- **SQRT()**: `SELECT SQRT(25);` — Computes the square root of a non-negative number
- **LOG()**: `SELECT LOG(10,100);` — Returns the logarithm of a number with a custom base
- **LN()**: `SELECT LN(7);` — Computes the natural logarithm (base e) of a number
- **LOG10()**: `SELECT LOG10(100);` — Computes the base-10 logarithm of a number
- **RAND()**: `SELECT RAND();` — Generates a pseudo-random floating-point value between 0 and 1
- **PI()**: `SELECT PI();` — Returns the mathematical constant pi (π)
- **SIN()**: `SELECT SIN(PI()/2);` — Computes the trigonometric sine of an angle in radians
- **COS()**: `SELECT COS(0);` — Computes the trigonometric cosine of an angle in radians
- **TAN()**: `SELECT TAN(PI()/4);` — Computes the trigonometric tangent of an angle in radians
- **ACOS()**: `SELECT ACOS(1);` — Computes the inverse cosine (arccosine) of a value
- **DEGREES()**: `SELECT DEGREES(PI());` — Converts an angle from radians to degrees
- **RADIANS()**: `SELECT RADIANS(180);` — Converts an angle from degrees to radians
- **LEAST()**: `SELECT LEAST(5,9,3);` — Returns the smallest value from a list of arguments
- **GREATEST()**: `SELECT GREATEST(5,9,3);` — Returns the largest value from a list of arguments
- **CONV()**: `SELECT CONV(15,10,2);` — Converts a number from one numeric base to another (e.g., decimal to binary)
- **BIT_COUNT()**: `SELECT BIT_COUNT(7);` — Counts how many bits are set to 1 in a binary representation
- **CRC32()**: `SELECT CRC32('abc');` — Computes a 32-bit cyclic redundancy check checksum
- **WIDTH_BUCKET()**: `SELECT WIDTH_BUCKET(score,0,100,4) FROM exams;` — Assigns a value to one of N equally sized buckets between specified bounds

### Date & Time Functions Formulas
- **NOW()**: `SELECT NOW();` — Returns the current date and time in the session's time zone
- **CURRENT_TIMESTAMP**: `SELECT CURRENT_TIMESTAMP;` — ANSI-standard synonym for NOW()
- **CURDATE()**: `SELECT CURDATE();` — Returns the current date without the time component
- **CURTIME()**: `SELECT CURTIME();` — Returns the current time without the date component
- **SYSDATE()**: `SELECT SYSDATE();` — Like NOW() but reflects the exact moment the function executes, not when the query started
- **UTC_TIMESTAMP()**: `SELECT UTC_TIMESTAMP();` — Returns the current date and time in Coordinated Universal Time
- **DATE()**: `SELECT DATE('2025-04-23 10:20:00');` — Extracts just the date portion from a datetime value
- **TIME()**: `SELECT TIME('2025-04-23 10:20:00');` — Extracts just the time portion from a datetime value
- **YEAR()**: `SELECT YEAR(order_date) FROM orders;` — Pulls the four-digit year from a date or datetime
- **MONTH()**: `SELECT MONTH(order_date) FROM orders;` — Pulls the numeric month (1-12) from a date
- **DAY()**: `SELECT DAY(order_date) FROM orders;` — Pulls the day of the month (1-31) from a date
- **DAYNAME()**: `SELECT DAYNAME(order_date) FROM orders;` — Returns the full weekday name (Monday, Tuesday, etc.)
- **MONTHNAME()**: `SELECT MONTHNAME(order_date) FROM orders;` — Returns the full month name (January, February, etc.)
- **DAYOFWEEK()**: `SELECT DAYOFWEEK(NOW());` — Returns a numeric index for the day of the week (1=Sunday, 7=Saturday)
- **DAYOFYEAR()**: `SELECT DAYOFYEAR(NOW());` — Returns the day number within the year (1-366)
- **WEEK()**: `SELECT WEEK(NOW());` — Returns the ISO week number for a given date
- **QUARTER()**: `SELECT QUARTER(NOW());` — Returns the quarter of the year (1-4) for a date
- **HOUR()**: `SELECT HOUR(NOW());` — Extracts the hour portion (0-23) from a time or datetime
- **MINUTE()**: `SELECT MINUTE(NOW());` — Extracts the minute portion (0-59) from a time or datetime
- **SECOND()**: `SELECT SECOND(NOW());` — Extracts the second portion (0-59) from a time or datetime
- **TIMESTAMP()**: `SELECT TIMESTAMP('2025-01-01','12:34:56');` — Constructs a datetime value from separate date and time arguments
- **TIMESTAMPDIFF()**: `SELECT TIMESTAMPDIFF(DAY,'2025-01-01','2025-01-10');` — Returns the difference between two timestamps in a specified unit
- **TIMESTAMPADD()**: `SELECT TIMESTAMPADD(MONTH,3,NOW());` — Adds a specified interval to a timestamp
- **DATEDIFF()**: `SELECT DATEDIFF('2025-02-01','2025-01-01');` — Computes the number of days between two dates
- **STR_TO_DATE()**: `SELECT STR_TO_DATE('23-04-2025','%d-%m-%Y');` — Parses a string into a date using a format pattern
- **DATE_FORMAT()**: `SELECT DATE_FORMAT(NOW(),'%d-%b-%Y');` — Formats a date/time value into a custom string format
- **ADDDATE()**: `SELECT ADDDATE('2025-01-01', INTERVAL 7 DAY);` — Adds a time interval to a date value
- **SUBDATE()**: `SELECT SUBDATE('2025-01-08',INTERVAL 7 DAY);` — Subtracts a time interval from a date value
- **DATE_ADD()**: `SELECT DATE_ADD(NOW(), INTERVAL 1 HOUR);` — Alias for ADDDATE, adds an interval to a datetime
- **DATE_SUB()**: `SELECT DATE_SUB(NOW(), INTERVAL 1 HOUR);` — Alias for SUBDATE, subtracts an interval from a datetime
- **MAKEDATE()**: `SELECT MAKEDATE(2025,60);` — Creates a date from a year and the day-of-year number
- **MAKETIME()**: `SELECT MAKETIME(12,30,0);` — Constructs a time value from hour, minute, and second components
- **EXTRACT()**: `SELECT EXTRACT(YEAR FROM NOW());` — Pulls a specific part (year, month, day, etc.) from a date/time according to ANSI SQL
- **LAST_DAY()**: `SELECT LAST_DAY('2025-02-10');` — Returns the last day of the month that the given date falls in
- **CONVERT_TZ()**: `SELECT CONVERT_TZ(NOW(),'UTC','Asia/Kolkata');` — Converts a datetime from one time zone to another
- **FROM_DAYS()**: `SELECT FROM_DAYS(737791);` — Converts a day number (counted from year 0) into an actual date
- **TO_DAYS()**: `SELECT TO_DAYS(NOW());` — Converts a date into the number of days since year 0
- **UNIX_TIMESTAMP()**: `SELECT UNIX_TIMESTAMP(NOW());` — Returns the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
- **FROM_UNIXTIME()**: `SELECT FROM_UNIXTIME(1700000000);` — Converts a Unix epoch timestamp (seconds) into a readable datetime
- **GET_FORMAT()**: `SELECT DATE_FORMAT(NOW(), GET_FORMAT(DATE,'EUR'));` — Returns a locale-specific format string for date/time formatting

### Control Flow Statements Formulas
- **CASE (searched)**: `SELECT CASE WHEN score>=80 THEN 'A' WHEN score>=60 THEN 'B' END AS grade FROM exams;` — Returns a value based on conditions evaluated in order within a SELECT
- **IF()**: `SELECT IF(active,'Y','N') FROM users;` — MySQL's inline ternary: returns the second argument when the condition is true, the third otherwise
- **IFNULL()**: `SELECT IFNULL(phone,'N/A') FROM contacts;` — Substitutes a NULL value with a fallback, but only handles one argument at a time
- **COALESCE()**: `SELECT COALESCE(mobile,landline,'N/A') FROM contacts;` — Returns the first non-NULL value from a list of arguments
- **RETURN**: `RETURN total;` — Exits a stored function and sends back a value to the caller
- **SIGNAL**: `SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Oops';` — Raises a custom error condition from within a stored routine
- **RESIGNAL**: `RESIGNAL;` — Re-raises the caught error, optionally modifying its message or SQLSTATE
- **HANDLER**: `DECLARE CONTINUE HANDLER FOR NOT FOUND SET done=1;` — Defines what to do when a specific condition (e.g., NOT FOUND) occurs inside a routine
- **DECLARE ...**: `DECLARE v INT DEFAULT 0;` — Declares a local variable, cursor, or condition handler inside a stored program
- **LEAVE / ITERATE**: `LEAVE my_loop;` — Exits (LEAVE) or jumps to the next iteration (ITERATE) of a loop inside a stored routine

### Data Manipulation (DML) Formulas
- **INSERT**: `INSERT INTO emp(name,salary) VALUES('Ram',50000);` — Adds one or more new rows of data into a table
- **INSERT SET**: `INSERT INTO emp SET name='Asha',salary=40000;` — MySQL-specific syntax using column=value pairs instead of positional lists
- **ON DUPLICATE KEY UPDATE**: `INSERT INTO stats(id,val) VALUES(1,10) ON DUPLICATE KEY UPDATE val=VALUES(val);` — Inserts a row, or updates it if a unique key conflict is found (upsert)
- **INSERT IGNORE**: `INSERT IGNORE INTO users(id,email) VALUES(1,'x@y.com');` — Silently skips rows that would cause duplicate-key or other insert errors
- **REPLACE INTO**: `REPLACE INTO cache(key,val) VALUES('a','b');` — Deletes any existing row that conflicts on a unique key, then inserts the new row
- **UPDATE**: `UPDATE emp SET salary=salary*1.05 WHERE dept='IT';` — Modifies existing rows that match the WHERE condition
- **UPDATE JOIN**: `UPDATE emp e JOIN dept d ON e.dept_id=d.id SET e.dept_name=d.name;` — Updates a table using values from another table via a JOIN
- **DELETE**: `DELETE FROM logs WHERE created<DATE_SUB(NOW(),INTERVAL 30 DAY);` — Removes rows that match the specified condition
- **DELETE JOIN**: `DELETE a FROM a JOIN b ON a.id=b.id WHERE b.flag=0;` — Deletes rows from one table based on join criteria with another table
- **TRUNCATE**: `TRUNCATE TABLE temp_data;` — Removes all rows from a table instantly and resets the auto-increment counter
- **LOAD DATA INFILE**: `LOAD DATA INFILE '/tmp/file.csv' INTO TABLE t FIELDS TERMINATED BY ',';` — Bulk-imports data from a text file into a table very efficiently
- **CALL (proc)**: `CALL raise_salary(1001,5000);` — Executes a previously defined stored procedure

### Data Definition (DDL) Formulas
- **CREATE DATABASE**: `CREATE DATABASE salesdb CHARACTER SET utf8mb4;` — Creates a new database with an optional character set and collation
- **ALTER DATABASE**: `ALTER DATABASE salesdb COLLATE utf8mb4_0900_ai_ci;` — Modifies database-level properties like character set or collation
- **DROP DATABASE**: `DROP DATABASE olddb;` — Permanently deletes a database and everything inside it
- **CREATE TABLE**: `CREATE TABLE emp(id INT PRIMARY KEY,name VARCHAR(50));` — Defines a new table's structure including columns, types, and constraints
- **CREATE TEMPORARY TABLE**: `CREATE TEMPORARY TABLE tmp SELECT * FROM emp LIMIT 0;` — Creates a session-only table that disappears when the connection ends
- **ALTER TABLE ADD**: `ALTER TABLE emp ADD COLUMN joined DATE;` — Adds a new column to an existing table
- **ALTER TABLE MODIFY**: `ALTER TABLE emp MODIFY COLUMN name VARCHAR(100);` — Changes the data type or attributes of an existing column
- **ALTER TABLE DROP**: `ALTER TABLE emp DROP COLUMN obsolete;` — Removes a column from an existing table
- **RENAME TABLE**: `RENAME TABLE temp TO archive_emp;` — Renames a table to a new name
- **DROP TABLE**: `DROP TABLE IF EXISTS junk;` — Permanently removes a table and all its data from the database
- **CREATE VIEW**: `CREATE VIEW v_active AS SELECT * FROM users WHERE active=1;` — Saves a query as a virtual table (view) that can be queried like a regular table
- **ALTER VIEW**: `ALTER VIEW v_active AS SELECT id,name FROM users WHERE active=1;` — Changes the definition of an existing view
- **DROP VIEW**: `DROP VIEW v_active;` — Removes a view from the database
- **CREATE INDEX**: `CREATE INDEX idx_dept ON emp(dept);` — Builds an index on a column to speed up queries that filter or sort by that column
- **CREATE UNIQUE INDEX**: `CREATE UNIQUE INDEX uidx_email ON users(email);` — Creates an index that also enforces uniqueness on the column values
- **DROP INDEX**: `DROP INDEX idx_dept ON emp;` — Removes an index from a table
- **FULLTEXT INDEX**: `CREATE FULLTEXT INDEX f_idx ON docs(content);` — Creates a special index that enables full-text search on text columns
- **SPATIAL INDEX**: `CREATE SPATIAL INDEX s_idx ON geom(geo);` — Creates an index optimized for spatial (GIS) queries on geometry columns
- **CREATE SEQUENCE**: `CREATE SEQUENCE seq START WITH 1 INCREMENT BY 1;` — Defines a sequence object that generates incremental numeric values (MariaDB/PostgreSQL)
- **AUTO_INCREMENT**: `id INT AUTO_INCREMENT PRIMARY KEY;` — MySQL column attribute that automatically assigns incrementing integers to new rows

### Constraints & Relationships Formulas
- **PRIMARY KEY**: `PRIMARY KEY(id)` — Uniquely identifies every row in a table; no duplicates or NULLs allowed
- **UNIQUE**: `UNIQUE(email)` — Ensures every value in a column (or column set) is distinct across rows
- **NOT NULL**: `name VARCHAR(100) NOT NULL` — Forces a column to always hold a value (no NULLs)
- **DEFAULT**: `status CHAR(1) DEFAULT 'A'` — Supplies a default value when none is explicitly provided during insert
- **CHECK**: `CHECK(qty>=0)` — Validates that column values satisfy a specified Boolean expression
- **FOREIGN KEY**: `FOREIGN KEY(dept_id) REFERENCES dept(id)` — Links a column to a primary key in another table to enforce referential integrity
- **ON DELETE CASCADE**: `ON DELETE CASCADE` — Automatically removes child rows when the referenced parent row is deleted
- **ON UPDATE SET NULL**: `ON UPDATE SET NULL` — Sets the foreign key column to NULL when the referenced parent key value is updated

### Transactions & Locks Formulas
- **SET autocommit**: `SET autocommit=0;` — Disables automatic committing so you can control when changes become permanent
- **START TRANSACTION**: `START TRANSACTION;` — Begins an explicit transaction block where all statements are atomic
- **SAVEPOINT**: `SAVEPOINT sp1;` — Marks a point within a transaction that you can roll back to without ending the whole transaction
- **ROLLBACK TO**: `ROLLBACK TO sp1;` — Undoes changes back to a specific savepoint without aborting the entire transaction
- **COMMIT**: `COMMIT;` — Writes all changes made in the current transaction permanently to the database
- **ROLLBACK**: `ROLLBACK;` — Reverses every change made since the transaction began, restoring the previous state
- **LOCK TABLES**: `LOCK TABLES emp WRITE;` — Prevents other sessions from modifying (or sometimes reading) a table until the lock is released
- **UNLOCK TABLES**: `UNLOCK TABLES;` — Releases all table locks held by the current session
- **SET TRANSACTION ISOLATION LEVEL**: `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;` — Controls which concurrency phenomena (dirty reads, non-repeatable reads, phantoms) are permitted
- **SHOW ENGINE INNODB STATUS**: `SHOW ENGINE INNODB STATUS;` — Displays InnoDB diagnostics including lock waits, deadlocks, and buffer pool stats

### Stored Routines & Scheduler Formulas
- **DELIMITER**: `DELIMITER $$ ... $$ DELIMITER ;` — Temporarily changes the statement terminator so you can define routines containing semicolons
- **CREATE PROCEDURE**: `CREATE PROCEDURE p() BEGIN SELECT NOW(); END;` — Encapsulates reusable SQL logic as a callable routine
- **ALTER PROCEDURE**: `ALTER PROCEDURE p COMMENT 'Returns DT';` — Modifies metadata (comment, SQL security, etc.) of a stored procedure
- **DROP PROCEDURE**: `DROP PROCEDURE p;` — Removes a stored procedure from the database
- **CREATE FUNCTION**: `CREATE FUNCTION f(x INT) RETURNS INT RETURN x*2;` — Creates a user-defined function that returns a scalar value
- **DROP FUNCTION**: `DROP FUNCTION f;` — Removes a user-defined function from the database
- **CREATE TRIGGER**: `CREATE TRIGGER trg BEFORE INSERT ON emp FOR EACH ROW SET NEW.created=NOW();` — Automatically executes logic before or after an insert, update, or delete event
- **DROP TRIGGER**: `DROP TRIGGER trg;` — Removes a trigger from the database
- **CREATE EVENT**: `CREATE EVENT e_cleanup ON SCHEDULE EVERY 1 DAY DO DELETE FROM logs WHERE created<DATE_SUB(NOW(),INTERVAL 30 DAY);` — Schedules a recurring task that runs automatically
- **ALTER EVENT DISABLE**: `ALTER EVENT e_cleanup DISABLE;` — Enables or disables a scheduled event
- **DROP EVENT**: `DROP EVENT e_cleanup;` — Deletes a scheduled event entirely
- **PREPARE / EXECUTE / DEALLOCATE**: `PREPARE stmt FROM 'SELECT ?+?'; EXECUTE stmt USING @a,@b; DEALLOCATE PREPARE stmt;` — Compiles and runs dynamically constructed SQL statements safely

### JSON Functions Formulas
- **JSON_OBJECT()**: `SELECT JSON_OBJECT('id',id,'name',name) FROM users;` — Builds a JSON object from alternating key-value pairs
- **JSON_ARRAY()**: `SELECT JSON_ARRAY(col1,col2) FROM t;` — Creates a JSON array from a list of values
- **JSON_EXTRACT()**: `SELECT JSON_EXTRACT(json,'$.path') FROM t;` — Retrieves a value from a JSON document by its path expression
- **-> operator**: `SELECT json->'$.path' FROM t;` — MySQL shorthand operator for JSON_EXTRACT
- **JSON_UNQUOTE()**: `SELECT JSON_UNQUOTE('"text"');` — Removes the surrounding double quotes from a JSON string value
- **JSON_SET()**: `SELECT JSON_SET(json,'$.a',1) FROM t;` — Inserts or replaces a value at a specified JSON path
- **JSON_INSERT()**: `SELECT JSON_INSERT(json,'$.a',1) FROM t;` — Adds a value at a path only if that path does not already exist
- **JSON_REPLACE()**: `SELECT JSON_REPLACE(json,'$.a',1) FROM t;` — Replaces a value at a path only if that path already exists
- **JSON_REMOVE()**: `SELECT JSON_REMOVE(json,'$.a') FROM t;` — Deletes the value at a specified JSON path
- **JSON_MERGE_PATCH()**: `SELECT JSON_MERGE_PATCH(j1,j2);` — Merges two JSON documents following RFC 7396 (patch semantics)
- **JSON_CONTAINS()**: `SELECT JSON_CONTAINS(json, '1', '$.a');` — Checks whether a specific value exists at a given path in a JSON document
- **JSON_CONTAINS_PATH()**: `SELECT JSON_CONTAINS_PATH(json,'one','$.a');` — Tests whether one or all of the specified paths exist in a JSON document
- **JSON_KEYS()**: `SELECT JSON_KEYS(json,'$.a') FROM t;` — Returns an array of the keys present in a JSON object at the specified path
- **JSON_LENGTH()**: `SELECT JSON_LENGTH(json,'$.array') FROM t;` — Counts the number of elements in a JSON array or keys in a JSON object
- **JSON_TYPE()**: `SELECT JSON_TYPE(json,'$.a') FROM t;` — Returns the data type of the value at a specified JSON path
- **JSON_VALID()**: `SELECT JSON_VALID(json) FROM t;` — Checks whether a string is well-formed JSON
- **JSON_TABLE()**: `SELECT * FROM JSON_TABLE(json,'$[*]' COLUMNS(id INT PATH '$.id')) AS jt;` — Converts JSON array elements into relational rows and columns
- **JSON_PRETTY()**: `SELECT JSON_PRETTY(json);` — Formats a JSON string with indentation and line breaks for human readability

### Admin & Security Formulas
- **CREATE USER**: `CREATE USER 'u'@'%' IDENTIFIED BY 'p';` — Creates a new MySQL login account with a host specification
- **ALTER USER**: `ALTER USER 'u'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'np';` — Changes a user's authentication method or password
- **DROP USER**: `DROP USER 'u'@'%';` — Permanently removes a user account from the server
- **GRANT**: `GRANT SELECT,INSERT ON db.* TO 'u'@'%';` — Assigns specific privileges on database objects to a user
- **REVOKE**: `REVOKE INSERT ON db.* FROM 'u'@'%';` — Withdraws previously granted privileges from a user
- **SHOW GRANTS**: `SHOW GRANTS FOR 'u'@'%';` — Displays the exact privilege statements for a given user
- **FLUSH PRIVILEGES**: `FLUSH PRIVILEGES;` — Reloads the grant tables from memory after direct modification of privilege tables
- **SET PASSWORD**: `SET PASSWORD = PASSWORD('new');` — Changes the password for the current user account
- **RESET MASTER**: `RESET MASTER;` — Clears all binary log files and resets the replication master's position
- **KILL**: `KILL 1234;` — Terminates a specific database connection or running query thread
- **SHOW PROCESSLIST**: `SHOW PROCESSLIST;` — Lists all active connections and what each thread is currently executing
- **SHOW STATUS**: `SHOW STATUS LIKE 'Threads%';` — Returns server status counters for monitoring performance and activity
- **SHOW VARIABLES**: `SHOW VARIABLES LIKE 'max_connections';` — Displays MySQL system configuration parameters and their current values
- **SHOW ENGINE INNODB STATUS**: `SHOW ENGINE INNODB STATUS;` — Provides detailed InnoDB diagnostics including transactions, locks, and I/O
- **PING**: `SELECT 1;` — Simple query to verify the database connection is alive and responding
