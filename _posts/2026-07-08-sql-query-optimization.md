---
layout: post
title: "SQL Query Optimization: How Your Database Executes Queries"
date: 2026-07-08
description: A practical guide to understanding SQL execution plans, indexing strategies, and writing faster queries — with SQLite examples you can run yourself.
---

SQL is declarative: you write *what* you want, not *how* to get it. The database decides the "how". But when a query is slow, understanding that "how" is the difference between guessing and fixing.

This article shows you how SQLite executes queries, how to read execution plans, and how to write queries that play to the database's strengths.

## EXPLAIN QUERY PLAN

Every major database has a way to show you how it plans to execute a query. In SQLite:

```sql
EXPLAIN QUERY PLAN
SELECT c.channel_name, v.title
FROM channels c
JOIN videos v ON c.channel_id = v.channel_id
WHERE c.subscriber_count > 1000000;
```

Output:

```
QUERY PLAN
|--SCAN channels
|--SEARCH videos USING INDEX idx_videos_channel_id
```

This tells you:
- `SCAN channels` — SQLite is reading every row in the `channels` table (a full table scan)
- `SEARCH videos USING INDEX` — SQLite found an index to quickly locate matching videos

A full table scan isn't always bad. If the table has only 50 rows, a scan is faster than using an index. The problem is when large tables get scanned repeatedly.

## Indexes: The Foundation of Fast Queries

An index is a separate data structure (usually a B-tree) that maps column values to row locations. Without an index, finding rows by a `WHERE` clause requires scanning every row.

```sql
-- Create an index on the column you filter by
CREATE INDEX idx_channels_subscribers ON channels(subscriber_count);

-- Now this query uses the index:
SELECT * FROM channels WHERE subscriber_count > 1000000;
```

### Which Columns to Index

Index columns that appear in:
- `WHERE` clauses
- `JOIN` conditions
- `ORDER BY` and `GROUP BY` columns

Don't index everything. Each index slows down writes (INSERT/UPDATE/DELETE) and consumes disk space. Index the columns that matter for your read queries.

### Composite Indexes

When you filter or sort by multiple columns, a composite index can help:

```sql
CREATE INDEX idx_videos_channel_publish ON videos(channel_id, publish_date);
```

This single index covers queries that filter by `channel_id` alone, or by `channel_id` + `publish_date` together. The order matters: put the most selective column first.

## Common Query Patterns and How to Fix Them

### Pattern 1: SELECT * When You Only Need a Few Columns

```sql
-- Slow: pulls all column data
SELECT * FROM videos WHERE channel_id = 'UC1';

-- Fast: only pulls what you need
SELECT title, views, publish_date FROM videos WHERE channel_id = 'UC1';
```

This matters because databases store row data in pages. A narrower SELECT means fewer pages to read, which means less I/O.

### Pattern 2: Functions in WHERE Clauses

```sql
-- Slow: can't use index on publish_date
SELECT * FROM videos WHERE strftime('%Y', publish_date) = '2026';

-- Fast: index can be used
SELECT * FROM videos WHERE publish_date >= '2026-01-01' AND publish_date < '2027-01-01';
```

Wrapping a column in a function (like `strftime`, `LOWER`, `SUBSTR`) usually prevents the database from using an index on that column. Restructure the query to compare the raw column value.

### Pattern 3: Missing JOIN Indexes

```sql
-- Slow if videos.channel_id isn't indexed
SELECT c.channel_name, COUNT(v.video_id) AS video_count
FROM channels c
LEFT JOIN videos v ON c.channel_id = v.channel_id
GROUP BY c.channel_id;
```

The `LEFT JOIN` on `videos.channel_id` needs an index. Without one, for every row in `channels`, SQLite scans the entire `videos` table.

**Fix:** `CREATE INDEX idx_videos_channel_id ON videos(channel_id);`

### Pattern 4: Sorting Large Result Sets

```sql
-- If you only need the top 10, don't sort the whole table
SELECT * FROM videos ORDER BY views DESC LIMIT 10;
```

With an index on `views`, SQLite can walk the index in reverse order and stop after 10 rows, never touching the full table.

### Pattern 5: Counting Rows in Large Tables

```sql
-- Slow: full table scan every time
SELECT COUNT(*) FROM videos;
```

In SQLite, `COUNT(*)` always requires a full scan because SQLite doesn't maintain row counts in metadata. For approximate counts, consider maintaining a counter table that you update on INSERT/DELETE.

## A Real Optimization Walkthrough

Let's optimize a real query from our YouTube Analytics dataset:

```sql
-- Original query
SELECT c.channel_name, v.title, v.views
FROM channels c
JOIN videos v ON c.channel_id = v.channel_id
WHERE c.country = 'US'
ORDER BY v.views DESC
LIMIT 20;
```

**Step 1 — Check the plan:**
```
QUERY PLAN
|--SCAN channels
|--SEARCH v USING INDEX idx_videos_channel_id
|--USE TEMP B-TREE FOR ORDER BY
```

The `USE TEMP B-TREE FOR ORDER BY` means SQLite is sorting the result set in a temporary structure — expensive for large result sets.

**Step 2 — Add a covering index:**
```sql
CREATE INDEX idx_videos_channel_views ON videos(channel_id, views DESC);
```

**Step 3 — Check the plan again:**
```
QUERY PLAN
|--SCAN channels
|--SEARCH v USING INDEX idx_videos_channel_views
```

The `USE TEMP B-TREE` is gone. The index already stores rows ordered by `views`, so SQLite can walk it directly.

## Understanding SQLite's Query Planner

SQLite uses a cost-based query planner. It estimates the cost of different execution strategies and picks the cheapest one. The estimates are based on:

- Table statistics (number of rows)
- Index statistics (selectivity)
- Available indexes

You can see the estimated cost in the plan output, though SQLite's output is less detailed than PostgreSQL's `EXPLAIN (ANALYZE, BUFFERS)`.

## When Optimization Doesn't Matter

Not every query needs optimization. The rule of thumb:

- Queries that run once a day and take 2 seconds — not worth optimizing
- Queries that run 1000 times per second and take 100ms — worth optimizing
- Queries on 50-row tables — never worth optimizing

Profile before you optimize. Measure the actual query time. Add `EXPLAIN QUERY PLAN` and check for table scans on large tables. Fix those first.

## Summary

- Use `EXPLAIN QUERY PLAN` to understand how SQLite executes your query
- Index columns used in `WHERE`, `JOIN`, and `ORDER BY`
- Avoid wrapping indexed columns in functions in `WHERE` clauses
- Prefer covering indexes that include all columns needed by a query
- Profile first, optimize second — not all queries need speed
