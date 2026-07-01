---
layout: default
title: Power BI 250+ Formulas
permalink: /power-bi-250-formulas/
---

# Power BI 250+ Formulas

## Basic Aggregations Formulas

MAX(): MAX( Profit ) : Returns the highest value from the specified column

COUNT(): COUNT( Order ID ) : Counts non-blank rows in a column

COUNTA(): COUNTA( Comments ) : Counts all values including text and blanks

DISTINCTCOUNT(): DISTINCTCOUNT( Customer ID ) : Counts unique values in a column

COUNTROWS(): COUNTROWS( Orders ) : Returns the number of rows in a table or table expression

COUNTX(): COUNTX( Products, Products[OnHand] ) : Iterates over a table counting rows that match a per-row expression

DIVIDE(): DIVIDE( Sales, Orders ) : Performs safe division with handling for zero denominators

PRODUCT(): PRODUCT( Quantity ) : Multiplies all values in a column together

PERCENTILE.EXC(): PERCENTILE.EXC( Sales,0.9 ) : Returns the 90th percentile using the exclusive method

MEDIAN(): MEDIAN( Profit ) : Returns the median value within the current filter context

STDEV.P(): STDEV.P( Sales ) : Calculates the population standard deviation

VAR.S(): VAR.S( Profit ) : Computes the sample variance

## Date & Time Formulas

TODAY(): TODAY() : Returns the current date based on the model timezone

NOW(): NOW() : Returns the current date and time

YEAR(): YEAR( Orders[Order Date] ) : Extracts the year component from a date

MONTH(): MONTH( Orders[Order Date] ) : Returns the month number from a date

DAY(): DAY( Orders[Order Date] ) : Returns the day of the month

HOUR(): HOUR( Orders[Order DateTime] ) : Extracts the hour component from a datetime

EOMONTH(): EOMONTH( Orders[Order Date],0 ) : Returns the last day of the month with an optional offset

DATE(): DATE( 2025,4,23 ) : Constructs a date from year, month, and day values

DATEVALUE(): DATEVALUE( Orders[DateText] ) : Converts a text string to a date

DATEDIFF(): DATEDIFF( Orders[Order Date], Orders[Ship Date], DAY ) : Returns the interval between two dates in the specified unit

DATEADD(): DATEADD( Dates[Date], -1, YEAR ) : Shifts a date column forward or backward by a given interval

SAMEPERIODLASTYEAR(): SAMEPERIODLASTYEAR( Dates[Date] ) : Returns dates shifted one year back for period-over-period comparison

PARALLELPERIOD(): PARALLELPERIOD( Dates[Date], -3, MONTH ) : Returns a parallel period offset by a specified interval

TOTALYTD(): TOTALYTD( SUM( Sales ), Dates[Date] ) : Computes a year-to-date running total

WEEKNUM(): WEEKNUM( Orders[Order Date] ) : Returns the ISO week number for a date

## Filter & Context Formulas

CALCULATE(): CALCULATE( SUM( Sales ), Year = 2025 ) : Modifies the filter context to evaluate an expression under different conditions

CALCULATETABLE(): CALCULATETABLE( Orders, Orders[Status]="Pending" ) : Returns a table with modified filter context

FILTER(): FILTER( Orders, Orders[Sales]>1000 ) : Filters a table row by row and returns only matching rows

ALL(): ALL( Orders ) : Removes all filters from the specified table or column

ALLEXCEPT(): ALLEXCEPT( Orders, Orders[Region] ) : Clears all filters except those on the specified columns

ALLSELECTED(): ALLSELECTED( Orders ) : Respects the current selection state from the report or visual

REMOVEFILTERS(): REMOVEFILTERS( Orders[Segment] ) : Explicitly clears filters from a column or table

KEEPFILTERS(): KEEPFILTERS( Orders, Orders[Region]="East" ) : Adds an additional filter without overriding existing filters

USERELATIONSHIP(): CALCULATE( SUM( Sales ), USERELATIONSHIP(Date[Date],ShipDates[Date]) ) : Activates an inactive relationship for the calculation

CROSSFILTER(): CALCULATE( SUM( Sales ), CROSSFILTER( Product[ID],Sales[PID],Both ) ) : Overrides the cross-filter direction between two columns

VALUES(): VALUES( Orders[State] ) : Returns a unique list of values from a column in the current context

DISTINCT(): DISTINCT( Orders[Category] ) : Returns a table of unique values from a column

EARLIER(): VAR _t = EARLIER( Orders[Sales] ) : References the row context from an outer row iteration

RELATED(): RELATED( Product[Category] ) : Fetches a related value from the one-side table in a relationship

RELATEDTABLE(): RELATEDTABLE( Sales ) : Returns rows from the many-side table in a relationship

## Iterator & Table Functions Formulas

SUMX(): SUMX( Orders, Orders[Quantity] * Orders[UnitPrice] ) : Evaluates an expression for each row then sums the results

AVERAGEX(): AVERAGEX( Customers, Customers[Sales] ) : Iterates over a table and returns the average of the expression

MINX(): MINX( Products, Products[Margin] ) : Iterates over a table and returns the minimum value of the expression

MAXX(): MAXX( Products, Products[Margin] ) : Iterates over a table and returns the maximum value of the expression

COUNTAX(): COUNTAX( Products, Products[Name] ) : Iterates and counts non-blank string values per row

RANKX(): RANKX( ALL(Customer), CALCULATE( SUM(Sales) ) ) : Ranks a measure within a specified set

TOPN(): TOPN( 5, Customers, [Total Sales] ) : Returns the top N rows sorted by a given expression

BOTTOMN(): BOTTOMN( 3, Products, [Profit] ) : Returns the bottom N rows sorted by a given expression

ADDCOLUMNS(): ADDCOLUMNS( Products, "Profit", Products[Sales]-Products[Cost] ) : Adds a calculated column to a table expression

SELECTCOLUMNS(): SELECTCOLUMNS( Sales, "PID", Sales[ProductID], "Amount", Sales[Sales] ) : Returns a table with only the specified columns

UNION(): UNION( TableA, TableB ) : Combines two tables vertically, appending all rows

INTERSECT(): INTERSECT( CustomersUSA, CustomersEU ) : Returns rows that appear in both tables

EXCEPT(): EXCEPT( MasterList, Completed ) : Returns rows that exist in the first table but not in the second

CROSSJOIN(): CROSSJOIN( Products, Colors ) : Generates the Cartesian product of two tables

GENERATE(): GENERATE( Customers, Orders ) : Combines each row of one table with a related table expression

## Logical & Testing Formulas

IF(): IF( Profit>0, "Positive","Negative" ) : Performs conditional branching based on a logical test

SWITCH(): SWITCH( TRUE(), Score>=90,"A", Score>=80,"B","Other" ) : Evaluates multiple conditions and returns the first matching result

AND(): AND( FlagA, FlagB ) : Returns TRUE when all arguments are true

OR(): OR( FlagA, FlagB ) : Returns TRUE when at least one argument is true

NOT(): NOT( IsComplete ) : Reverses the logical value of its argument

TRUE(): TRUE() : Returns the boolean value TRUE

FALSE(): FALSE() : Returns the boolean value FALSE

COALESCE(): COALESCE( Value, 0 ) : Returns the first non-blank argument from a list

ISBLANK(): ISBLANK( Notes ) : Checks whether a value is blank

ISNUMBER(): ISNUMBER( Value ) : Checks whether a value is numeric

ISTEXT(): ISTEXT( Value ) : Checks whether a value is text

ERROR(): IFERROR( Expression, 0 ) : Catches errors and returns an alternative value instead

HASONEVALUE(): HASONEVALUE( Customer[State] ) : Tests whether a column has only one distinct value in the current context

ISFILTERED(): ISFILTERED( Orders[Region] ) : Tests whether a column has an active filter applied

ISINSCOPE(): ISINSCOPE( Date[Month] ) : Tests whether a column is part of the current hierarchy level

## Math & Trigonometry Formulas

ABS(): ABS( Profit ) : Returns the absolute value of a number

CEILING(): CEILING( Discount, 1 ) : Rounds a number up to the nearest multiple of significance

FLOOR(): FLOOR( Discount ) : Rounds a number down toward zero

ROUND(): ROUND( Sales, 2 ) : Rounds a number to the specified number of decimal places

TRUNC(): TRUNC( Price, 0 ) : Truncates a number to an integer without rounding

INT(): INT( Revenue ) : Returns the integer portion of a number

POWER(): POWER( Sales, 2 ) : Raises a number to the specified power

SQRT(): SQRT( Variance ) : Returns the square root of a number

LN(): LN( Sales ) : Returns the natural logarithm of a number

EXP(): EXP( 1 ) : Returns e raised to the power of a number

MOD(): MOD( Index, 2 ) : Returns the remainder after division

QUOTIENT(): QUOTIENT( Quantity, 12 ) : Returns the integer result of division

RAND(): RAND() : Generates a random number between 0 and 1

RANDBETWEEN(): RANDBETWEEN(1,100) : Returns a random integer within a specified range

SIGN(): SIGN( Profit ) : Returns the sign of a number (1, -1, or 0)

## Misc Extras Formulas

DATEDIFF (MONTH): DATEDIFF( Earliest[Date], Latest[Date], MONTH ) : Returns the number of months between two dates

QUARTER(): QUARTER( Orders[Order Date] ) : Returns the quarter number (1-4) for a given date

HASONEFILTER(): HASONEFILTER( Date[Year] ) : Checks whether a column has a direct filter applied

USERCULTURE(): USERCULTURE() : Returns the locale or culture of the current user

ISOWeekNum(): WEEKNUM( Date[Date], 21 ) : Returns the ISO 8601 week number for a date

ISERROR(): ISERROR( [Measure] ) : Checks whether a measure or expression returns an error

ISEVEN(): ISEVEN( Data[Index] ) : Tests whether a number is even

ISODD(): ISODD( Data[Index] ) : Tests whether a number is odd

NETWORKDAYS(): NETWORKDAYS( Start, End ) : Calculates working days between two dates (custom function)

EARLIER(): EARLIER( Table[Column] ) : Accesses the row context from an outer iteration

## Power Query - Text & Number Formulas

Text.Upper: Text.Upper([Name]) : Converts text to uppercase in Power Query

Text.Lower: Text.Lower([Name]) : Converts text to lowercase

Text.Trim: Text.Trim([Column]) : Removes leading and trailing whitespace

Text.Length: Text.Length([Name]) : Returns the character count of a string

Text.Replace: Text.Replace([Desc],"old","new") : Replaces occurrences of a substring within text

Number.Round: Number.Round([Price],2) : Rounds a numeric value to a specified number of decimals

Number.Abs: Number.Abs([Delta]) : Returns the absolute value of a number

Date.From: Date.From(DateTime.LocalNow()) : Converts a datetime value to a date

DateTime.LocalNow: DateTime.LocalNow() : Returns the current local date and time in Power Query

Csv.Document: Csv.Document(File.Contents(path)) : Parses a CSV file into a table

## Power Query - Table Ops Formulas

Table.SelectRows: Table.SelectRows(Source, each [Sales] > 1000) : Filters rows in a Power Query table based on a condition

Table.AddColumn: Table.AddColumn(Source, "Profit", each [Sales]-[Cost]) : Adds a calculated column to a table

Table.RemoveColumns: Table.RemoveColumns(Source,{"Index"}) : Removes one or more columns from a table

Table.RenameColumns: Table.RenameColumns(Source,{{"old","new"}}) : Renames columns in a table

Table.Sort: Table.Sort(Source,{{"Date",Order.Descending}}) : Sorts table rows by one or more columns

Table.Group: Table.Group(Source,{"Region"},{"Total", each List.Sum([Sales]), type number}) : Groups rows and aggregates values

Table.ExpandTableColumn: Table.ExpandTableColumn(Nested,"Orders",{"Sales"}) : Expands nested table columns into the parent table

Table.Pivot: Table.Pivot(Source, List.Distinct(Source[Year]), "Year","Sales", List.Sum) : Pivots unique row values into columns

Table.Unpivot: Table.UnpivotOtherColumns(Source,{"ID"},"Attribute","Value") : Unpivots columns into attribute-value pairs

Table.Combine: Table.Combine({Table1,Table2}) : Appends tables vertically

Table.Distinct: Table.Distinct(Source) : Removes duplicate rows from a table

Table.FillDown: Table.FillDown(Source,{"Column1"}) : Fills null values with the value from the row above

Table.ReplaceValue: Table.ReplaceValue(Source,null,0,Replacer.ReplaceValue,{"Qty"}) : Replaces specific values in a table

List.Generate: List.Generate(()=>0, each _<10, each _+1) : Generates a list programmatically using a function

Excel.Workbook: Excel.Workbook(File.Contents(path)) : Imports Excel workbook sheets as tables

## Power Query - Extras Formulas

Table.RemoveRows : Table.RemoveRows(Source,0,1) : Removes a specified number of rows from the start of a table

Table.FillUp : Table.FillUp(Source,{"Col"}) : Fills null values with the value from the row below

Table.Transposbe : Table.Transpose(Source) : Swaps rows and columns in a table

Text.EndsWith : Text.EndsWith([Col],"Ltd") : Checks whether a text value ends with a specified substring

Text.StartsWith : Text.StartsWith([Col],"Inc") : Checks whether a text value starts with a specified substring

Number.IntegerDivide : Number.IntegerDivide(15,4) : Returns the integer quotient of a division

Number.Mod : Number.Mod(15,4) : Returns the remainder of a division

List.Sum : List.Sum([Values]) : Sums all items in a list

List.Sort : List.Sort([Values]) : Sorts list items in ascending order

List.Contains : List.Contains([Values], "A") : Checks whether a list contains a specified value

## Text & Info Formulas

CONCATENATE() : CONCATENATE( FirstName, " ", LastName ) : Joins multiple text strings into one

CONCATENATEX() : CONCATENATEX( VALUES(Product[Category]), Product[Category],", ") : Concatenates values across rows with a delimiter

LEFT() : LEFT( Product[SKU],3 ) : Extracts the leftmost characters from a string

RIGHT() : RIGHT( Product[SKU],2 ) : Extracts the rightmost characters from a string

MID() : MID( Product[SKU],4,2 ) : Returns a substring starting at a specific position with a given length

LEN() : LEN( Product[Name] ) : Returns the length of a text string

LOWER() : LOWER( Customer[Email] ) : Converts text to lowercase

UPPER() : UPPER( Customer[City] ) : Converts text to uppercase

TRIM() : TRIM( Product[Name] ) : Removes leading and trailing spaces from text

REPLACE() : REPLACE( Product[Name],1,5,"New" ) : Replaces part of a string by position

SUBSTITUTE() : SUBSTITUTE( Comment,"bad","good" ) : Replaces occurrences of a substring by matching the text

FIND() : FIND( "@", Email, 1, 0 ) : Returns the starting position of a substring (case-sensitive)

SEARCH() : SEARCH( "Pro", Product[Name], 1, -1 ) : Returns the starting position of a substring (case-insensitive)

FORMAT() : FORMAT( Sales, "#,##0.00" ) : Formats a number or date as a string

BLANK() : BLANK() : Returns a blank value

## Stat & Ranking Formulas

PERCENTILEX.INC() : PERCENTILEX.INC( Orders, Orders[Sales], 0.9 ) : Returns the inclusive percentile of an expression evaluated row by row

STDEVX.P() : STDEVX.P( Sales, Sales[Amount] ) : Iterates a table to compute population standard deviation

VARX.P() : VARX.P( Sales, Sales[Amount] ) : Iterates a table to compute population variance

GEOMEAN() : GEOMEAN( Product[Growth] ) : Returns the geometric mean of a column

RANKX() : RANKX( ALL(Customer), [Total Sales] ) : Ranks items in a set by a measure

TOPN() : TOPN( 10, Products, [Total Profit] ) : Returns a table of the top N rows by an expression

PERCENTILE.INC() : PERCENTILE.INC( Sales, 0.5 ) : Returns the inclusive percentile value from a column

QUARTILE.INC() : QUARTILE.INC( Sales, 1 ) : Returns the quartile value from a column

MODE.SNGL() : MODE.SNGL( Orders[Ship Mode] ) : Returns the most frequently occurring value

CORR() : CORR( Sales[Amount], Profit[Amount] ) : Returns the correlation coefficient between two columns

## Additional DAX Formulas

CURRENCY() : CURRENCY( Sales ) : Converts a numeric value to the currency data type

FORMAT() : FORMAT( Date, "MMM yyyy" ) : Applies a custom format string to a value

UNICHAR() : UNICHAR( 128512 ) : Returns the Unicode character corresponding to a numeric code

UNICHAR() : UNICHAR( 128525 ) : Returns a different Unicode character for icons or symbols

PATHLENGTH() : PATHLENGTH( HierarchyPath ) : Returns the number of items in a path string

DATATABLE() : DATATABLE("Col",STRING,{ {"A"},{"B"} }) : Creates an inline static table with specified columns and data

GENERATESERIES() : GENERATESERIES(1,10,1) : Generates a single-column table of sequential numbers

ADDMISSINGITEMS() : ADDMISSINGITEMS( SUMMARIZE(...) ) : Adds missing combinations to ensure all rows appear

CONTAINSROW() : CONTAINSROW( {"East","West"}, Region[Name] ) : Checks whether a set of values contains a specific row

MATCHBY() : MATCHBY( Customers[Year], Customers[Segment] ) : Defines columns used to match transitions for window calculations

TOCSV() : TOCSV( VALUES(Product[Category]) ) : Concatenates values into a comma-separated text string

ISO.CEILING() : ISO.CEILING( Sales, 5 ) : Rounds up to the nearest multiple following ISO rules

COMBINEVALUES() : COMBINEVALUES("-", ColumnA, ColumnB) : Creates a composite key string from multiple columns

SELECTEDVALUE() : SELECTEDVALUE( Date[Year] ) : Returns the single selected value from a column or blank if multiple

GROUPBY + CURRENTGROUP(): GROUPBY( Sales, Sales[Region], "Avg", AVERAGEX(CURRENTGROUP(),Sales[Sales]) ) : Performs nested calculations within grouped rows

ROWS() : ROWS( Products ) : Alias for COUNTROWS returning row count

DATETIME() : DATETIME(2025,4,23,10,30,0) : Creates a datetime value from year, month, day, hour, minute, second

STDEV.P() : STDEV.P( Sales ) : Returns the population standard deviation for a column

RANK.EQ() : RANK.EQ( [Sales] ) : Returns the Excel-style rank (tie gives same rank)

RANK.AVG() : RANK.AVG( [Sales] ) : Returns the average rank for tied values

## Advanced Context & Hierarchy Formulas

VAR : VAR _sales = SUM( Sales ) : Defines a reusable variable within a measure or calculated column

RETURN : VAR a=1 RETURN a+1 : Returns the result of an expression after variable definitions

SUMMARIZE() : SUMMARIZE( Orders, Orders[Region], "Sales", SUM(Orders[Sales]) ) : Groups a table by columns and creates aggregated columns

GROUPBY() : GROUPBY( Orders, Orders[Region], "Avg", AVERAGEX(CURRENTGROUP(),Orders[Sales]) ) : Groups a table and allows nested aggregations using CURRENTGROUP

ALLNOBLANKROW() : ALLNOBLANKROW( Customer ) : Removes filters and excludes the blank row added for referential integrity

TREATAS() : TREATAS( VALUES(Region[Name]), Sales[Region] ) : Applies the values from one table as filters on another column

LOOKUPVALUE() : LOOKUPVALUE( Rates[Rate], Rates[Key], Sales[Key] ) : Searches a table for a value matching specified criteria

PATH() : PATH( Parent[ID], Parent[ParentID] ) : Returns a delimited text string representing the hierarchy path

PATHCONTAINS() : PATHCONTAINS( PathCol, SelectedID ) : Checks whether a specified ID exists within a path string

PATHITEM() : PATHITEM( PathCol, 2, INTEGER ) : Returns a specific element from a path string at a given position

## User & Security Formulas

USERPRINCIPALNAME() : USERPRINCIPALNAME() : Returns the current user's UPN for use in row-level security

USERNAME() : USERNAME() : Returns the legacy username of the current user

ISFILTERED() : ISFILTERED(Security[Dept]) : Checks whether a column has a filter applied, useful in security logic

ROLE SECURITY : FILTER(Sales, Sales[Region]=USERPRINCIPALNAME()) : Filters a table by the current user for row-level security

HASONEFILTER() : HASONEFILTER(Dept[Name]) : Detects whether a single filter is applied to a column for security rules

SELECTEDVALUE() : SELECTEDVALUE(Dept[Name]) : Returns the selected value from a slicer safely for security context

GROUPBY RLS : KEEPFILTERS( Sales, Sales[Dept]=Employee[Dept] ) : Maintains filter context within row-level security evaluation

ISINSCOPE() : ISINSCOPE(Region[Country]) : Checks whether a column is in the current hierarchy scope

CONTAINS() : CONTAINS(Sales, Sales[User], USERPRINCIPALNAME()) : Returns TRUE if a table contains a matching row for the current user

LOOKUPVALUE() RLS : LOOKUPVALUE(Auth[Allowed],Auth[User],USERPRINCIPALNAME()) : Looks up a permission value in a security table for the current user
