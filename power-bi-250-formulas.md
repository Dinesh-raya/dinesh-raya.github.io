---
layout: default
title: Power BI 250+ Formulas
permalink: /power-bi-250-formulas/
---

# Power BI 250+ Formulas

## Basic Aggregations Formulas

MAX(): MAX( Profit ) : Returns the largest value found in a column, ignoring blanks

COUNT(): COUNT( Order ID ) : Tallies the number of rows that contain values in the specified column

COUNTA(): COUNTA( Comments ) : Counts cells in a column regardless of whether they hold numbers, text, or logical values

DISTINCTCOUNT(): DISTINCTCOUNT( Customer ID ) : Counts only unique or distinct entries in a given column

COUNTROWS(): COUNTROWS( Orders ) : Returns the total number of rows in a table or a table expression

COUNTX(): COUNTX( Products, Products[OnHand] ) : Iterates over each row of a table and counts rows where the expression evaluates to a number

DIVIDE(): DIVIDE( Sales, Orders ) : Safely performs division and returns BLANK or an alternate result when dividing by zero

PRODUCT(): PRODUCT( Quantity ) : Multiplies together all numeric values in a column

PERCENTILE.EXC(): PERCENTILE.EXC( Sales, 0.9 ) : Returns the k-th percentile of values, using an exclusive calculation method

MEDIAN(): MEDIAN( Profit ) : Computes the middle value in a sorted column of numbers

STDEV.P(): STDEV.P( Sales ) : Estimates standard deviation across an entire population

VAR.S(): VAR.S( Profit ) : Calculates the variance of a sample, measuring how far values deviate from the mean
