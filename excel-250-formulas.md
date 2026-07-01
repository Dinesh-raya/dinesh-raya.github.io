---
layout: default
title: Excel 250+ Formulas
permalink: /excel-250-formulas/
---

## Excel 250+ Formulas

### Basic Aggregations Formulas
- `SUM()` = `=SUM(B2:B10)` : Totals up a range of numeric values
- `AVERAGE()` = `=AVERAGE(C2:C10)` : Returns the arithmetic average of selected numbers
- `COUNT()` = `=COUNT(A2:A10)` : Tallies how many cells contain numeric data
- `COUNTA()` = `=COUNTA(A2:A10)` : Counts all non-empty cells in a range
- `COUNTBLANK()` = `=COUNTBLANK(A2:A10)` : Returns the count of blank cells
- `MAX()` = `=MAX(D2:D10)` : Identifies the largest value in a range
- `MIN()` = `=MIN(D2:D10)` : Finds the smallest value in a range
- `LARGE()` = `=LARGE(D2:D10,3)` : Gets the k-th largest value from a data set
- `SMALL()` = `=SMALL(D2:D10,2)` : Gets the k-th smallest value from a data set
- `SUBTOTAL()` = `=SUBTOTAL(109,E2:E10)` : Performs aggregate calculations on visible rows only (109 = SUM)
- `AGGREGATE()` = `=AGGREGATE(14,6,F2:F10)` : Applies functions while ignoring errors or hidden rows
- `SUMPRODUCT()` = `=SUMPRODUCT(B2:B10,C2:C10)` : Multiplies corresponding arrays and sums the products
- `SUMIF()` = `=SUMIF(A2:A10,"East",B2:B10)` : Adds values that meet a single specified condition
- `SUMIFS()` = `=SUMIFS(B2:B10,A2:A10,"East",C2:C10,">100")` : Adds values that meet multiple criteria
- `COUNTIF()` = `=COUNTIF(A2:A10,"<>"&"")` : Counts cells satisfying one condition
- `COUNTIFS()` = `=COUNTIFS(A2:A10,"East",C2:C10,">100")` : Counts cells satisfying multiple conditions
- `AVERAGEIF()` = `=AVERAGEIF(A2:A10,"East",B2:B10)` : Averages values that meet a single condition
- `AVERAGEIFS()` = `=AVERAGEIFS(B2:B10,A2:A10,"East",C2:C10,">100")` : Averages values that meet multiple conditions
