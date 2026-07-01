---
layout: post
title: SQL Window Functions Explained
date: 2026-07-01
description: A practical guide to SQL window functions — ROW_NUMBER, RANK, SUM OVER, and how they differ from GROUP BY.
---

Window functions are one of the most powerful features in SQL. They let you perform calculations across a set of rows while still keeping each row distinct in the output. Unlike `GROUP BY`, which collapses rows, window functions preserve detail.

## ROW_NUMBER

Assigns a unique sequential number to each row within a partition.

```sql
SELECT
  employee_name,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
FROM employees;
```

This gives each employee a number within their department based on salary. The highest-paid person in each department gets 1.

## RANK and DENSE_RANK

`RANK` leaves gaps when there are ties. `DENSE_RANK` does not.

```sql
SELECT
  score,
  RANK() OVER (ORDER BY score DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM exam_results;
```

If two students tie at 95, `RANK` skips the next number. `DENSE_RANK` does not.

## SUM with OVER

Running totals are easy with window aggregates.

```sql
SELECT
  order_date,
  amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM sales;
```

Each row shows the cumulative sum up to that point.

## LAG and LEAD

These let you reference the previous or next row without a self-join.

```sql
SELECT
  date,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY date) AS prev_day_revenue,
  LEAD(revenue, 1) OVER (ORDER BY date) AS next_day_revenue
FROM daily_revenue;
```

Useful for calculating day-over-day changes.

## Key Takeaways

- Window functions use `OVER()` to define the window.
- `PARTITION BY` splits data into groups (like GROUP BY but without collapsing).
- `ORDER BY` inside `OVER()` controls the order within each partition.
- You can mix window functions with regular columns in the same query.

Window functions replace many complex self-joins and subqueries. Once you get comfortable with them, you will reach for them constantly.
