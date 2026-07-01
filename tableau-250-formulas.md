---
layout: default
title: Tableau 250+ Formulas
permalink: /tableau-250-formulas/
---

## Tableau 250+ Formulas

### Basic Aggregations Formulas

- `SUM()` : `SUM([Sales])` : Computes the sum of all values in a numeric field
- `AVG()` : `AVG([Discount])` : Returns the mean of a numeric field
- `MIN()` : `MIN([Order Date])` : Returns the smallest or earliest value in a field
- `MAX()` : `MAX([Profit])` : Returns the largest or most recent value in a field
- `COUNT()` : `COUNT([Order ID])` : Counts the total number of non-null entries in a field
- `COUNTD()` : `COUNTD([Customer ID])` : Counts the number of unique values in a field
- `ATTR()` : `ATTR([Region])` : Returns the value if every row has the same value, otherwise shows an asterisk
- `TOTAL()` : `TOTAL(SUM([Sales]))` : Computes the overall total across all rows in the partition
- `ZN()` : `ZN([Profit])` : Replaces null values with zero in the given field
- `SIZE()` : `SIZE()` : Returns the total number of rows in the current partition
