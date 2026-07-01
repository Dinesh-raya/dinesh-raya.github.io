---
layout: default
title: Tableau 250+ Formulas
permalink: /tableau-250-formulas/
---

## Tableau 250+ Formulas

### Basic Aggregations Formulas
- `SUM()` : `SUM([Sales])` : Adds up all values in the selected field
- `AVG()` : `AVG([Discount])` : Computes the arithmetic mean
- `MIN()` : `MIN([Order Date])` : Returns the earliest or smallest value
- `MAX()` : `MAX([Profit])` : Returns the latest or greatest value
- `COUNT()` : `COUNT([Order ID])` : Counts records that are not null
- `COUNTD()` : `COUNTD([Customer ID])` : Counts unique values in a field
- `ATTR()` : `ATTR([Region])` : Returns the value if all rows match, otherwise asterisk
- `TOTAL()` : `TOTAL(SUM([Sales]))` : Computes grand total within the table calc partition
- `ZN()` : `ZN([Profit])` : Replaces null values with zero
- `SIZE()` : `SIZE()` : Returns the row count in the current partition

### Date Functions
- `TODAY()` : `TODAY()` : Returns the current date
- `NOW()` : `NOW()` : Returns the current date and time
- `YEAR()` : `YEAR([Order Date])` : Extracts the year from a date
- `MONTH()` : `MONTH([Order Date])` : Returns the month as a number
- `DAY()` : `DAY([Order Date])` : Returns the day of the month
- `DATENAME()` : `DATENAME('weekday',[Order Date])` : Returns the full textual name of a date part
- `DATEPART()` : `DATEPART('quarter',[Order Date])` : Returns a numeric date part
- `DATEDIFF()` : `DATEDIFF('day',[Order Date],[Ship Date])` : Calculates the difference between two dates
- `DATEADD()` : `DATEADD('year',1,[Order Date])` : Adds an interval to a date
- `DATETRUNC()` : `DATETRUNC('month',[Order Date])` : Truncates a date to the specified precision
- `MAKEDATE()` : `MAKEDATE(2025,4,23)` : Constructs a date from year, month, and day
- `MAKETIME()` : `MAKETIME(14,30,0)` : Constructs a time value
- `DATEPARSE()` : `DATEPARSE('dd-MMM-yyyy','23-Apr-2025')` : Converts a custom-formatted string to a date
- `MIN()` : `MIN([Order Date])` : Returns the earliest date in the partition
- `MAX()` : `MAX([Order Date])` : Returns the latest date in the partition

### Logical & Type Formulas
- `IF / THEN / ELSE` : `IF [Profit]>0 THEN 'Positive' ELSE 'Negative' END` : Applies row-level conditional logic
- `IIF()` : `IIF([Ship Mode]='Same Day',1,0)` : Inline conditional with three arguments
- `CASE` : `CASE [Segment] WHEN 'Consumer' THEN 1 WHEN 'Corporate' THEN 2 END` : Evaluates multiple equality conditions cleanly
- `AND / OR / NOT` : `IF [Profit]>0 AND [Sales]>1000 THEN 'Top' END` : Combines boolean expressions
- `ISNULL()` : `ISNULL([Postal Code])` : Tests whether a value is null
- `ZN()` : `ZN([Profit])` : Converts null values to zero
- `NULLIF()` : `NULLIF([Sales],0)` : Returns null when the two expressions are equal
- `IFNULL()` : `IFNULL([State],'Unknown')` : Replaces null values with a fallback
- `INT()` : `INT([Order ID])` : Casts a value to an integer
- `FLOAT()` : `FLOAT([Quantity])` : Casts a value to a floating-point number

### Mapping & Geo Formulas
- `MAKEPOINT()` : `MAKEPOINT([Lat],[Lon])` : Creates a spatial point from latitude and longitude
- `MAKELINE()` : `MAKELINE([Start], [End])` : Creates a line between two spatial points for routes
- `DISTANCE()` : `DISTANCE([Start],[End],'mile')` : Computes the distance between two points in given units
- `BUFFER()` : `BUFFER([Point],10,'km')` : Generates a radius around a location (available from 2020.4)
- `AREA()` : `AREA([Polygon])` : Calculates the surface area of a polygon
- `HEXBIN()` : `HEXBIN([Lon],[Lat])` : Creates a hexagonal density grid for spatial clustering
- `REGION()` : `[Postal Code] recognized` : Automatically assigns geographic roles
- `Spatial Join` : `Join two spatial layers on intersection` : Combines polygon or point layers based on spatial overlap

### Number Functions
- `ABS()` : `ABS([Profit])` : Returns the absolute value of a number
- `CEILING()` : `CEILING([Discount])` : Rounds a number up to the nearest integer
- `FLOOR()` : `FLOOR([Discount])` : Rounds a number down to the nearest integer
- `ROUND()` : `ROUND([Sales],0)` : Rounds a number to a specified number of decimals
- `POWER()` : `POWER([Sales],2)` : Raises a number to a given exponent
- `SQRT()` : `SQRT([Sales])` : Returns the square root of a number
- `LOG()` : `LOG([Sales])` : Returns the natural logarithm of a number
- `LOG10()` : `LOG([Sales],10)` : Returns the base-10 logarithm of a number
- `PI()` : `PI()` : Returns the mathematical constant pi
- `RANDOM()` : `RANDOM()` : Generates a random number between 0 and 1 (available from 2024.1)
- `MOD()` : `MOD([Row ID],2)` : Returns the remainder of a division operation
- `SIGN()` : `SIGN([Profit])` : Returns 1 for positive, -1 for negative, and 0 for zero

### String Functions Formulas
- `LEFT()` : `LEFT([Product Name],3)` : Returns the leftmost N characters
- `RIGHT()` : `RIGHT([Category],2)` : Returns the rightmost N characters
- `MID()` : `MID([SKU],2,4)` : Extracts a substring starting at a given position
- `LEN()` : `LEN([State])` : Returns the length of a string
- `LOWER()` : `LOWER([City])` : Converts text to lowercase
- `UPPER()` : `UPPER([City])` : Converts text to uppercase
- `TRIM()` : `TRIM([Ship Mode])` : Removes leading and trailing spaces
- `REPLACE()` : `REPLACE([Phone],'-','')` : Substitutes all occurrences of a substring
- `SPLIT()` : `SPLIT([Email],'@',1)` : Splits a string on a delimiter and returns a token
- `FIND()` : `FIND([Email],'@')` : Returns the position of a substring within a string
- `CONTAINS()` : `CONTAINS([Comment],'urgent')` : Checks whether a string contains a substring
- `STARTSWITH()` : `STARTSWITH([City],'New')` : Checks whether a string starts with a given prefix
- `ENDSWITH()` : `ENDSWITH([City],'ville')` : Checks whether a string ends with a given suffix
- `ASCII()` : `ASCII('A')` : Returns the ASCII code of a character
- `CHAR()` : `CHAR(65)` : Returns the character corresponding to an ASCII code
- `STR()` : `STR([Order ID])` : Converts a number to its string representation
- `SPACE()` : `SPACE(5)` : Returns a string of N spaces
- `URLENCODE()` : `URLENCODE([URL])` : Encodes special characters in a URL string

### Table Calculations Formuulas
- `WINDOW_SUM()` : `WINDOW_SUM(SUM([Sales]))` : Sums values across the window defined by compute-using
- `WINDOW_AVG()` : `WINDOW_AVG(AVG([Profit]))` : Averages values across the window
- `WINDOW_MIN()` : `WINDOW_MIN(MIN([Sales]))` : Returns the minimum across the window
- `WINDOW_MAX()` : `WINDOW_MAX(MAX([Sales]))` : Returns the maximum across the window
- `RUNNING_SUM()` : `RUNNING_SUM(SUM([Sales]))` : Computes a cumulative running total
- `RUNNING_AVG()` : `RUNNING_AVG(AVG([Profit]))` : Computes a cumulative running average
- `RUNNING_MIN()` : `RUNNING_MIN(MIN([Profit]))` : Computes a cumulative minimum
- `RUNNING_MAX()` : `RUNNING_MAX(MAX([Profit]))` : Computes a cumulative maximum
- `LOOKUP()` : `LOOKUP(SUM([Sales]),-1)` : References a value from a relative row offset
- `FIRST()` : `FIRST()` : Returns the index offset from the first row in the partition
- `LAST()` : `LAST()` : Returns the index offset from the last row in the partition
- `INDEX()` : `INDEX()` : Returns the sequential row number
- `RANK()` : `RANK(SUM([Sales]))` : Ranks values allowing gaps
- `RANK_DENSE()` : `RANK_DENSE(SUM([Sales]))` : Ranks values without gaps
- `RANK_PERCENTILE()` : `RANK_PERCENTILE(SUM([Sales]))` : Ranks values as a percentile between 0 and 1
- `PERCENTILE()` : `PERCENTILE([Sales],0.9)` : Returns the 90th percentile within the window
- `WINDOW_PERCENTILE()` : `WINDOW_PERCENTILE(SUM([Sales]),0.75)` : Computes the percentile across the window
- `NTILE()` : `NTILE(4)` : Buckets rows into N roughly equal groups
- `WINDOW_STDEV()` : `WINDOW_STDEV(SUM([Sales]))` : Computes the standard deviation across the window
- `WINDOW_VAR()` : `WINDOW_VAR(SUM([Sales]))` : Computes the variance across the window

### Dashboards & Actions Formulas
- `Show Filter` : `Right-click dimension > Show Filter` : Displays an interactive filter for end users
- `Dashboard Action Filter` : `Dashboard > Actions > Add Filter` : Passes selections between dashboard sheets
- `Highlight Action` : `Add Highlight` : Emphasizes related marks across views
- `URL Action` : `Add URL Action` : Opens an external link when a mark is clicked
- `Parameter Action` : `Add Parameter Action` : Updates a parameter value through click or hover interaction
- `Set Action` : `Add Set Action` : Modifies set membership through dashboard interaction
- `Story Point` : `New Story` : Creates a sequence of dashboard pages for narrative flow
- `Device Layout` : `Dashboard > Device Preview` : Optimizes the dashboard layout for mobile screens

### Level of Detail (LOD) Formulas
- `{ FIXED : ... }` : `{ FIXED : SUM([Sales]) }` : Computes an aggregate at the total level regardless of view dimensions
- `{ FIXED [State] : ... }` : `{ FIXED [State] : AVG([Profit]) }` : Computes a state-level aggregate independent of the view
- `{ INCLUDE [Product] : ... }` : `{ INCLUDE [Product] : SUM([Sales]) }` : Adds finer granularity beyond the view level
- `{ EXCLUDE [Region] : ... }` : `{ EXCLUDE [Region] : AVG([Sales]) }` : Removes a dimension from the aggregation level
- `LOD + DATE` : `{ FIXED DATETRUNC('month',[Order Date]) : SUM([Sales]) }` : Computes monthly totals independent of view filters
- `ATTR() with LOD` : `IF { FIXED : COUNTD([Customer ID]) } >100 THEN 'Large' END` : Uses LOD inside a logical calculation
- `FIXED & PARAM` : `{ FIXED : SUM( IF [Segment]=[p.Segment] THEN [Sales] END ) }` : Creates dynamic totals driven by a parameter
- `LOD Nested` : `{ FIXED [Category] : AVG( { FIXED [Sub-Category] : SUM([Sales]) } ) }` : Nests LOD expressions for meta-aggregation
- `LOD Filtering` : `IF { EXCLUDE [Customer ID] : SUM([Sales]) } > 1000 THEN 'VIP' END` : Filters rows based on group-level metrics
- `REFERENCE` : `SUM([Sales]) / { FIXED : SUM([Sales]) }` : Computes a percentage of the overall total

### Statistical & Analytics Formulas
- `MEDIAN()` : `MEDIAN([Sales])` : Returns the median value of a field
- `STDEV()` : `STDEV([Sales])` : Computes the sample standard deviation
- `VAR()` : `VAR([Sales])` : Computes the sample variance
- `CORR()` : `CORR([Sales],[Profit])` : Computes the correlation coefficient between two fields
- `COVAR()` : `COVAR([Sales],[Profit])` : Computes the covariance between two fields
- `TRENDLINE` : `Add Trend Line (Linear)` : Visualizes a linear regression trend on a chart
- `FORECAST` : `Enable Forecast` : Projects future values using exponential smoothing
- `REFERENCE LINE` : `Add average reference line` : Displays a benchmark line across the axis
- `CLUSTER` : `Analytics > Cluster` : Applies automated k-means segmentation to the data
- `BOX PLOT` : `Show Box Plot` : Visualizes the five-number summary distribution
- `PERCENTILE()` : `PERCENTILE([Sales],0.95)` : Returns the 95th percentile value at the row level
- `QUANTILE()` : `QUANTILE([Sales],0.25)` : Returns the quartile value at a given threshold
- `Z-SCORE` : `(SUM([Sales])-WINDOW_AVG(SUM([Sales])))/WINDOW_STDEV(SUM([Sales]))` : Standardizes a metric by mean and standard deviation
- `BIN()` : `BIN([Age],5)` : Groups continuous values into fixed-size bins
- `Histogram` : `Show Me > Histogram` : Creates a distribution view of a single measure

### User Functions & Security Formulas
- `USERNAME()` : `USERNAME()` : Returns the current Tableau Server or Tableau Cloud username
- `ISMEMBEROF()` : `ISMEMBEROF('Sales')` : Checks whether the current user belongs to a specified group
- `FULLNAME()` : `FULLNAME()` : Displays the full display name of the current user
- `TODAY() filter` : `TODAY()=DATE([Login Date])` : Implements row-level security based on the current date
- `PASSWORD()` : `PASSWORD('secret')` : Encrypts a string for use in Tableau Prep
- `ROW LEVEL SECURITY` : `User filter with security table` : Restricts data access per user based on a security mapping
