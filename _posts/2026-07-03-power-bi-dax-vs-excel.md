---
layout: post
title: Power BI DAX vs Excel Formulas — Key Differences
date: 2026-07-03
description: DAX looks like Excel formulas but works differently. Learn the key differences between Power BI DAX and Excel formulas.
---

If you come from Excel, DAX in Power BI will look familiar. But the similarities are surface-level. Under the hood, DAX works differently.

## Row Context vs Filter Context

Excel formulas operate on individual cells. DAX operates on entire columns and tables.

In Excel:
```
=SUM(A1:A10)
```

In DAX:
```
SUM(Sales[Amount])
```

The DAX version sums the entire column, not a range. Filters applied to visuals automatically affect the result. This is called **filter context** — and it is the most important concept in DAX.

## Calculated Columns vs Measures

A calculated column evaluates row-by-row and stores a value in the table.

```
Profit = Sales[Revenue] - Sales[Cost]
```

A measure evaluates dynamically based on filters from slicers, rows, and columns.

```
Total Profit = SUM(Sales[Revenue]) - SUM(Sales[Cost])
```

Measures are almost always preferred. They do not consume memory and they respond to user interactions.

## CALCULATE

CALCULATE is the most powerful DAX function. It modifies filter context.

```
Sales in East Region =
CALCULATE(
    SUM(Sales[Amount]),
    Sales[Region] = "East"
)
```

Excel has no direct equivalent. You would use SUMIFS instead. But CALCULATE is more flexible because it can add, remove, or override multiple filters at once.

## Time Intelligence

DAX has built-in time intelligence functions that Excel cannot match.

```
Sales Same Period Last Year =
CALCULATE(
    SUM(Sales[Amount]),
    SAMEPERIODLASTYEAR('Calendar'[Date])
)
```

Functions like `DATESYTD`, `PREVIOUSMONTH`, and `TOTALQTD` make time-based calculations straightforward.

## Key Takeaways

- DAX works with columns and tables, not cells.
- Measures are dynamic; calculated columns are static.
- CALCULATE is the Swiss Army knife of DAX.
- Time intelligence is built in and powerful.

If you are learning Power BI, spend time understanding filter context. Everything else builds on that foundation.
