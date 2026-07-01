---
layout: default
title: Excel 250+ Formulas
permalink: /excel-250-formulas/
---

## Excel 250+ Formulas

### Basic Aggregations Formulas
- `SUM()` = `=SUM(B2:B10)` : Calculates the total of selected numbers
- `AVERAGE()` = `=AVERAGE(C2:C10)` : Returns the arithmetic mean of values
- `COUNT()` = `=COUNT(A2:A10)` : Counts cells that contain numeric values
- `COUNTA()` = `=COUNTA(A2:A10)` : Counts all non-empty cells in a range
- `COUNTBLANK()` = `=COUNTBLANK(A2:A10)` : Counts empty cells within a range
- `MAX()` = `=MAX(D2:D10)` : Finds the highest value in a dataset
- `MIN()` = `=MIN(D2:D10)` : Finds the lowest value in a dataset
- `LARGE()` = `=LARGE(D2:D10,3)` : Returns the nth largest value from a set
- `SMALL()` = `=SMALL(D2:D10,2)` : Returns the nth smallest value from a set
- `SUBTOTAL()` = `=SUBTOTAL(109,E2:E10)` : Performs aggregations on filtered or visible rows only
- `AGGREGATE()` = `=AGGREGATE(14,6,F2:F10)` : Applies aggregate functions with options to ignore errors or hidden rows
- `SUMPRODUCT()` = `=SUMPRODUCT(B2:B10,C2:C10)` : Multiplies arrays element-wise and returns the sum of products
- `SUMIF()` = `=SUMIF(A2:A10,"East",B2:B10)` : Adds values that meet a single specified condition
- `SUMIFS()` = `=SUMIFS(B2:B10,A2:A10,"East",C2:C10,">100")` : Adds values that meet multiple criteria
- `COUNTIF()` = `=COUNTIF(A2:A10,"<>"&"")` : Counts cells matching a single condition
- `COUNTIFS()` = `=COUNTIFS(A2:A10,"East",C2:C10,">100")` : Counts cells matching multiple conditions
- `AVERAGEIF()` = `=AVERAGEIF(A2:A10,"East",B2:B10)` : Calculates average based on one condition
- `AVERAGEIFS()` = `=AVERAGEIFS(B2:B10,A2:A10,"East",C2:C10,">100")` : Calculates average based on multiple conditions

### Date & Time Formulas
- `TODAY()` = `=TODAY()` : Returns the current date, updates daily
- `NOW()` = `=NOW()` : Returns the current date and time together
- `DATE()` = `=DATE(2025,4,23)` : Creates a date from individual year, month, and day values
- `DATEVALUE()` = `=DATEVALUE("23-Apr-2025")` : Converts a date stored as text into a serial date number
- `TIME()` = `=TIME(14,30,0)` : Constructs a time value from hours, minutes, and seconds
- `TIMEVALUE()` = `=TIMEVALUE("14:30")` : Converts a text representation of time into a serial time number
- `YEAR()` = `=YEAR(A2)` : Extracts the year from a given date
- `MONTH()` = `=MONTH(A2)` : Extracts the month number (1–12) from a date
- `DAY()` = `=DAY(A2)` : Extracts the day of the month from a date
- `WEEKDAY()` = `=WEEKDAY(A2,2)` : Returns the day of the week as a number based on your chosen return type
- `WEEKNUM()` = `=WEEKNUM(A2,21)` : Returns the ISO week number for a given date
- `EOMONTH()` = `=EOMONTH(A2,0)` : Returns the last day of the month relative to the given date
- `EDATE()` = `=EDATE(A2,3)` : Shifts a date forward or backward by a specified number of months
- `DAYS()` = `=DAYS(B2,A2)` : Computes the number of days between two dates
- `NETWORKDAYS()` = `=NETWORKDAYS(A2,B2)` : Counts working days between two dates excluding weekends
- `NETWORKDAYS.INTL()` = `=NETWORKDAYS.INTL(A2,B2,"0000011")` : Counts working days using a custom definition of weekends
- `WORKDAY()` = `=WORKDAY(A2,5)` : Returns a date after adding a number of workdays, skipping weekends
- `WORKDAY.INTL()` = `=WORKDAY.INTL(A2,10,"0000011")` : Adds workdays with a customizable weekend pattern
- `YEARFRAC()` = `=YEARFRAC(A2,B2)` : Calculates the fraction of a year between two dates
- `HOUR()` = `=HOUR(B2)` : Extracts the hour portion from a time value
- `MINUTE()` = `=MINUTE(B2)` : Extracts the minute portion from a time value
- `SECOND()` = `=SECOND(B2)` : Extracts the second portion from a time value

### Dynamic Array Functions Formulas
- `UNIQUE()` = `=UNIQUE(A2:A100)` : Returns a list of distinct values from a range
- `FILTER()` = `=FILTER(A2:D100,B2:B100="East")` : Filters a range based on a logical condition
- `SORT()` = `=SORT(A2:B100,2,-1)` : Sorts a range by a specified column in ascending or descending order
- `SORTBY()` = `=SORTBY(A2:B100,B2:B100,-1)` : Sorts a range using values from a separate column as the sort key
- `SEQUENCE()` = `=SEQUENCE(10,1,1,1)` : Generates a sequential list of numbers in rows and columns
- `RANDARRAY()` = `=RANDARRAY(5,3,1,100,TRUE)` : Creates an array of random numbers within a specified range
- `XLOOKUP()` = `=XLOOKUP(E2,A2:A10,B2:B10,"NF")` : Searches a range and returns a matching value from another range
- `XMATCH()` = `=XMATCH(E2,A2:A10)` : Returns the position of a value within an array with enhanced options
- `CHOOSECOLS()` = `=CHOOSECOLS(A2:F10,1,4)` : Returns specific columns from a range as a new array
- `CHOOSEROWS()` = `=CHOOSEROWS(A2:F10,1,-1)` : Returns specific rows from a range as a new array
- `TAKE()` = `=TAKE(A2:F100,5)` : Returns the first N rows or columns from an array
- `DROP()` = `=DROP(A2:F100,-3)` : Removes the last N rows or columns from an array
- `WRAPROWS()` = `=WRAPROWS(B2:B13,3)` : Converts a one-dimensional list into rows of a fixed width
- `WRAPCOLS()` = `=WRAPCOLS(B2:B13,3)` : Converts a one-dimensional list into columns of a fixed width
- `LET()` = `=LET(rng,A2:A10,AVG,AVERAGE(rng),AVG)` : Assigns names to values and intermediate calculations for cleaner formulas
- `LAMBDA()` = `=LAMBDA(x,y,x+y)(2,3)` : Defines a custom reusable function using parameters and a calculation

### Excel Features & Shortcuts Formulas
- `Absolute Reference` = `$A$1` : Locks a cell reference so it does not change when copying the formula
- `Named Range` = `Formulas > Define Name` : Assigns a descriptive name to a cell or range for simpler formulas
- `Data Validation` = `Data > Data Validation` : Restricts what type of data can be entered into a cell
- `Conditional Formatting` = `Home > Conditional Formatting` : Applies formatting automatically based on cell values or rules
- `Freeze Panes` = `View > Freeze Panes` : Keeps specific rows or columns visible while scrolling through the sheet
- `PivotTable` = `Insert > PivotTable` : Summarizes and analyzes large datasets interactively
- `Flash Fill` = `Data > Flash Fill` : Automatically detects and fills patterns from your data entry
- `Quick Analysis` = `Ctrl+Q` : Opens a menu of recommended charts, totals, and formatting options
- `AutoFilter` = `Data > Filter` : Adds dropdown arrows to column headers for quick data filtering
- `CTRL+Shift+L` = `Toggle filters` : Keyboard shortcut to turn column filters on or off
- `Ctrl+;` = `Insert today's date` : Quickly enters the current date into the active cell
- `Ctrl+Shift+!` = `Apply number formatting` : Applies the default number format with two decimal places

### Information Formulas
- `ISBLANK()` = `=ISBLANK(A2)` : Checks whether a cell is empty and returns TRUE or FALSE
- `ISNUMBER()` = `=ISNUMBER(A2)` : Checks whether a value is numeric
- `ISTEXT()` = `=ISTEXT(A2)` : Checks whether a value is text
- `ISERROR()` = `=ISERROR(A2/B2)` : Checks whether a value results in any error type
- `ISERR()` = `=ISERR(A2/B2)` : Checks for any error except the #N/A error
- `ISNA()` = `=ISNA(VLOOKUP(...))` : Checks specifically for the #N/A error
- `TYPE()` = `=TYPE(A2)` : Returns a numeric code indicating the data type of a value
- `CELL()` = `=CELL("address",A2)` : Returns information about a cell such as its address or formatting
- `FORMULATEXT()` = `=FORMULATEXT(A2)` : Displays the formula from a referenced cell as a text string
- `N()` = `=N(A2)` : Converts a value to a number; returns 0 for text values
- `T()` = `=T(A2)` : Returns the text from a value or blank if the value is not text
- `INFO()` = `=INFO("obversion")` : Returns details about the current operating environment
- `ERROR.TYPE()` = `=ERROR.TYPE(A2)` : Returns a number that corresponds to a specific error type

### Logical & Error Handling Formulas
- `IF()` = `=IF(D2>0,"Profit","Loss")` : Returns one value if a condition is true and another if false
- `IFS()` = `=IFS(B2>90,"A",B2>80,"B",TRUE,"C")` : Evaluates multiple conditions and returns the first matching result without nesting
- `AND()` = `=AND(A2>0,B2>0)` : Returns TRUE only when all conditions evaluate to true
- `OR()` = `=OR(A2>100,B2>100)` : Returns TRUE if at least one of the conditions is true
- `NOT()` = `=NOT(A2="Yes")` : Reverses the logical value of its argument
- `XOR()` = `=XOR(A2>0,B2>0)` : Returns TRUE when an odd number of arguments are true
- `SWITCH()` = `=SWITCH(A2,"M",1,"F",2,0)` : Matches an expression against a list of values and returns the corresponding result
- `IFERROR()` = `=IFERROR(A2/B2,0)` : Catches any error and returns a fallback value instead
- `IFNA()` = `=IFNA(VLOOKUP(E2,$A$2:$B$10,2,0),"Not Found")` : Catches #N/A errors specifically and returns a custom alternative
- `CHOOSE()` = `=CHOOSE(3,"Red","Blue","Green","Yellow")` : Selects a value from a list based on a positional index number
- `LET()` = `=LET(taxRate,0.18,Price*taxRate)` : Assigns intermediate variables within a formula for readability and performance

### Lookup & Reference Formulas
- `VLOOKUP()` = `=VLOOKUP(E2,$A$2:$C$10,3,0)` : Looks up a value in the leftmost column and returns a corresponding value from a specified column to the right
- `HLOOKUP()` = `=HLOOKUP(B5,$A$1:$G$3,3,FALSE)` : Searches for a value in the top row and returns a value from a specified row below
- `XLOOKUP()` = `=XLOOKUP(E2,$A$2:$A$10,$B$2:$B$10,"NF")` : Searches a range and returns a matching result with support for vertical, horizontal, and reverse lookups
- `LOOKUP()` = `=LOOKUP(2,1/(A2:A10<>""),A2:A10)` : Returns the last non-empty value in a column using vector form
- `INDEX()` = `=INDEX(B2:B10,5)` : Returns a value from a specific position within a range
- `MATCH()` = `=MATCH(E2,A2:A10,0)` : Returns the relative position of a value within a range
- `INDEX+MATCH` = `=INDEX(B2:B10,MATCH(E2,A2:A10,0))` : Combines INDEX and MATCH for flexible lookups without column order restrictions
- `OFFSET()` = `=OFFSET(A1,5,2)` : Returns a range that is offset from a starting cell by a given number of rows and columns
- `INDIRECT()` = `=INDIRECT("B"&ROW())` : Converts a text string into a valid cell reference
- `ADDRESS()` = `=ADDRESS(ROW(),COLUMN())` : Creates a cell address as text from given row and column numbers
- `ROW()` = `=ROW(A5)` : Returns the row number of a referenced cell
- `COLUMN()` = `=COLUMN(D2)` : Returns the column number of a referenced cell
- `ROWS()` = `=ROWS(A2:C10)` : Counts the total number of rows in a reference
- `COLUMNS()` = `=COLUMNS(A2:C10)` : Counts the total number of columns in a reference
- `XMATCH()` = `=XMATCH(E2,A2:A10,0)` : Modern version of MATCH with support for reverse search and wildcards
- `FILTER()` = `=FILTER(A2:C10,B2:B10>100)` : Extracts rows that satisfy a logical condition into a spill range
- `UNIQUE()` = `=UNIQUE(A2:A100)` : Extracts distinct values from a range and spills them into adjacent cells
- `SORT()` = `=SORT(A2:B10,2,-1)` : Orders a range by a specified column index and direction
- `SORTBY()` = `=SORTBY(A2:B10,B2:B10,-1)` : Sorts a range using a separate helper column as the sorting key
- `SEQUENCE()` = `=SEQUENCE(10,1,1,1)` : Creates a sequential list of numbers in an array that spills automatically

### Math & Trig Formulas
- `ROUND()` = `=ROUND(A2,2)` : Rounds a number to a specified number of decimal places
- `ROUNDUP()` = `=ROUNDUP(A2,0)` : Rounds a number up toward zero regardless of the digit value
- `ROUNDDOWN()` = `=ROUNDDOWN(A2,0)` : Rounds a number down toward zero regardless of the digit value
- `MROUND()` = `=MROUND(A2,5)` : Rounds a number to the nearest multiple of a given value
- `INT()` = `=INT(A2)` : Truncates a number to its integer portion by removing the decimal part
- `MOD()` = `=MOD(A2,3)` : Returns the remainder after dividing one number by another
- `CEILING()` = `=CEILING(A2,10)` : Rounds a number up to the nearest multiple of a specified significance
- `FLOOR()` = `=FLOOR(A2,10)` : Rounds a number down to the nearest multiple of a specified significance
- `ABS()` = `=ABS(A2)` : Returns the absolute value of a number, removing its sign
- `POWER()` = `=POWER(A2,3)` : Raises a number to a specified exponent
- `SQRT()` = `=SQRT(A2)` : Calculates the square root of a positive number
- `RAND()` = `=RAND()` : Generates a random decimal between 0 and 1, recalculating on every worksheet change
- `RANDBETWEEN()` = `=RANDBETWEEN(1,100)` : Generates a random integer within a specified lower and upper bound
- `PI()` = `=PI()` : Returns the mathematical constant pi to 15 decimal places
- `EXP()` = `=EXP(1)` : Returns e raised to the power of a given number
- `LN()` = `=LN(A2)` : Computes the natural logarithm (base e) of a number
- `LOG()` = `=LOG(A2,10)` : Computes the logarithm of a number with a specified base
- `LOG10()` = `=LOG10(A2)` : Computes the base-10 logarithm of a number
- `PRODUCT()` = `=PRODUCT(B2:B10)` : Multiplies all numbers in a range and returns the product

### Statistical Formulas
- `MEDIAN()` = `=MEDIAN(A2:A10)` : Returns the middle value from a sorted set of numbers
- `MODE.SNGL()` = `=MODE.SNGL(A2:A10)` : Returns the most frequently occurring value in a dataset
- `PERCENTILE.EXC()` = `=PERCENTILE.EXC(A2:A10,0.9)` : Returns the k-th percentile excluding 0 and 1 boundaries
- `PERCENTILE.INC()` = `=PERCENTILE.INC(A2:A10,0.9)` : Returns the k-th percentile including 0 and 1 as boundaries
- `QUARTILE.EXC()` = `=QUARTILE.EXC(A2:A10,1)` : Returns a quartile value excluding the minimum and maximum from the calculation
- `QUARTILE.INC()` = `=QUARTILE.INC(A2:A10,1)` : Returns a quartile value including the minimum and maximum in the calculation
- `STDEV.P()` = `=STDEV.P(A2:A10)` : Calculates standard deviation based on the entire population
- `STDEV.S()` = `=STDEV.S(A2:A10)` : Estimates standard deviation based on a sample of the population
- `VAR.P()` = `=VAR.P(A2:A10)` : Computes variance based on the entire population
- `VAR.S()` = `=VAR.S(A2:A10)` : Estimates variance based on a sample of the population
- `COVARIANCE.P()` = `=COVARIANCE.P(A2:A10,B2:B10)` : Measures the covariance between two datasets for the full population
- `CORREL()` = `=CORREL(A2:A10,B2:B10)` : Returns the correlation coefficient indicating the strength of a linear relationship between two variables
- `TREND()` = `=TREND(known_y,known_x,new_x)` : Fits a line to known data points and predicts values along that line
- `FORECAST.LINEAR()` = `=FORECAST.LINEAR(new_x,known_y,known_x)` : Predicts a future value using linear regression based on historical data

### Text Functions Formulas
- `LEFT()` = `=LEFT(A2,3)` : Returns the specified number of characters from the start of a text string
- `RIGHT()` = `=RIGHT(A2,2)` : Returns the specified number of characters from the end of a text string
- `MID()` = `=MID(A2,2,4)` : Returns a substring starting at a given position with a specified length
- `LEN()` = `=LEN(A2)` : Counts the number of characters in a text string including spaces
- `FIND()` = `=FIND("@",A2)` : Locates the position of a substring within text using case-sensitive matching
- `SEARCH()` = `=SEARCH("cat",A2)` : Locates the position of a substring within text ignoring case
- `SUBSTITUTE()` = `=SUBSTITUTE(A2,"-","")` : Replaces occurrences of a specific text pattern with new text
- `REPLACE()` = `=REPLACE(A2,1,3,"New")` : Replaces characters at a specific position and length within text
- `TEXT()` = `=TEXT(A2,"dd-mmm-yyyy")` : Formats a number or date as text using a specified format pattern
- `TEXTJOIN()` = `=TEXTJOIN(", ",TRUE,A2:A5)` : Joins multiple text values from a range using a delimiter and ignores empty cells
- `CONCAT()` = `=CONCAT(A2:A5)` : Combines text from multiple cells into one string without delimiters
- `CONCATENATE()` = `=CONCATENATE(A2," ",B2)` : Joins up to 255 text items into one string (legacy function)
- `TRIM()` = `=TRIM(A2)` : Removes all extra spaces from text except single spaces between words
- `UPPER()` = `=UPPER(A2)` : Converts all letters in a text string to uppercase
- `LOWER()` = `=LOWER(A2)` : Converts all letters in a text string to lowercase
- `PROPER()` = `=PROPER(A2)` : Capitalizes the first letter of each word in a text string
- `VALUE()` = `=VALUE(A2)` : Converts a text string that represents a number into an actual numeric value
- `EXACT()` = `=EXACT(A2,B2)` : Compares two text strings and returns TRUE if they are exactly the same including case
- `CHAR()` = `=CHAR(10)` : Returns the character that corresponds to a given ASCII or Unicode code
- `CODE()` = `=CODE("A")` : Returns the numeric ASCII code for the first character of a text string
