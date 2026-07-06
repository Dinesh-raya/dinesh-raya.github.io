---
layout: post
title: "CTEs and Window Functions in SQL: Beyond the Basics"
date: 2026-07-13
description: Master Common Table Expressions and Window Functions with real examples from YouTube Analytics data. Includes running totals, rankings, and moving averages.
---

Two of the most powerful SQL features are Common Table Expressions (CTEs) and Window Functions. Together, they let you write queries that would otherwise require complex subqueries or application-level code.

This article uses the YouTube Analytics schema from our [SQL Project](/sql-project/) to show practical examples you can run yourself.

## The Schema

We'll work with these two tables:

```sql
CREATE TABLE channels (
    channel_id VARCHAR PRIMARY KEY,
    channel_name VARCHAR,
    subscriber_count BIGINT,
    country VARCHAR,
    published_at DATE
);

CREATE TABLE videos (
    video_id VARCHAR PRIMARY KEY,
    channel_id VARCHAR REFERENCES channels(channel_id),
    title VARCHAR,
    publish_date DATE,
    views BIGINT,
    likes BIGINT
);
```

## Common Table Expressions (CTEs)

A CTE is a temporary named result set that exists only within a single query. Think of it as a "view" for one query.

### Basic CTE

```sql
WITH big_channels AS (
    SELECT channel_id, channel_name, subscriber_count
    FROM channels
    WHERE subscriber_count > 1000000
)
SELECT c.channel_name, v.title, v.views
FROM big_channels c
JOIN videos v ON c.channel_id = v.channel_id
ORDER BY v.views DESC;
```

Without a CTE, you'd either write a subquery or create a view. The CTE makes the query read top-to-bottom: first define `big_channels`, then join it with videos.

### Multiple CTEs

You can define multiple CTEs in one `WITH` clause:

```sql
WITH
channel_stats AS (
    SELECT channel_id, COUNT(*) AS video_count, AVG(views) AS avg_views
    FROM videos
    GROUP BY channel_id
),
us_channels AS (
    SELECT channel_id, channel_name
    FROM channels
    WHERE country = 'US'
)
SELECT uc.channel_name, cs.video_count, cs.avg_views
FROM us_channels uc
JOIN channel_stats cs ON uc.channel_id = cs.channel_id
ORDER BY cs.avg_views DESC;
```

Each CTE can reference previous ones in the same `WITH` block, but the order matters — a CTE can only reference those defined before it.

### Recursive CTE

Recursive CTEs are useful for hierarchical data like comment threads:

```sql
WITH RECURSIVE comment_thread AS (
    -- Base case: top-level comments
    SELECT comment_id, parent_comment_id, text, 1 AS depth
    FROM comments
    WHERE parent_comment_id IS NULL
    
    UNION ALL
    
    -- Recursive step: replies
    SELECT c.comment_id, c.parent_comment_id, c.text, ct.depth + 1
    FROM comments c
    JOIN comment_thread ct ON c.parent_comment_id = ct.comment_id
)
SELECT * FROM comment_thread ORDER BY depth, comment_id;
```

This builds a complete comment hierarchy. Without a recursive CTE, you'd need multiple queries or application code.

## Window Functions

Window functions perform calculations across a set of rows related to the current row. Unlike `GROUP BY`, they don't collapse rows — each row retains its identity.

### ROW_NUMBER

Assign a unique number to each video within its channel, ordered by views:

```sql
SELECT
    channel_id,
    title,
    views,
    ROW_NUMBER() OVER (
        PARTITION BY channel_id
        ORDER BY views DESC
    ) AS video_rank
FROM videos;
```

`PARTITION BY` splits the data into groups (one per channel). `ORDER BY` within each group determines the numbering. The result: each channel's videos ranked by popularity.

### RANK vs DENSE_RANK

```sql
SELECT
    channel_id,
    title,
    views,
    RANK() OVER (ORDER BY views DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY views DESC) AS dense_rank
FROM videos;
```

- `RANK()` — ties get the same rank, next rank skips (1, 2, 2, 4)
- `DENSE_RANK()` — ties get the same rank, next rank doesn't skip (1, 2, 2, 3)

Use `RANK` when you want gaps (e.g., "top 3" might give 4 results if there's a tie for 3rd). Use `DENSE_RANK` when you want no gaps.

### Running Totals with SUM() OVER

Calculate cumulative views over time for each channel:

```sql
SELECT
    channel_id,
    title,
    publish_date,
    views,
    SUM(views) OVER (
        PARTITION BY channel_id
        ORDER BY publish_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_views
FROM videos
ORDER BY channel_id, publish_date;
```

The frame clause `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` defines the window as all rows from the start of the partition up to the current row. This creates a running total.

### Moving Average

```sql
SELECT
    channel_id,
    publish_date,
    views,
    AVG(views) OVER (
        PARTITION BY channel_id
        ORDER BY publish_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3
FROM videos;
```

A 3-row moving average smooths out daily fluctuations and reveals trends.

### FIRST_VALUE and LAG

Compare each video to the channel's first and previous video:

```sql
SELECT
    channel_id,
    title,
    publish_date,
    views,
    FIRST_VALUE(views) OVER (
        PARTITION BY channel_id
        ORDER BY publish_date
    ) AS first_video_views,
    LAG(views, 1) OVER (
        PARTITION BY channel_id
        ORDER BY publish_date
    ) AS previous_video_views
FROM videos;
```

`LAG(views, 1)` gets the views from the row one position before the current row within the same channel. Great for comparing performance over time.

## Combining CTEs with Window Functions

This is where the real power emerges. Use a CTE to prepare data with window functions, then query the results:

```sql
WITH ranked_videos AS (
    SELECT
        channel_id,
        title,
        views,
        ROW_NUMBER() OVER (
            PARTITION BY channel_id
            ORDER BY views DESC
        ) AS rn
    FROM videos
)
SELECT c.channel_name, rv.title, rv.views
FROM ranked_videos rv
JOIN channels c ON rv.channel_id = c.channel_id
WHERE rv.rn <= 3
ORDER BY c.channel_name, rv.rn;
```

This query gives you the top 3 videos per channel — a common business requirement that's surprisingly hard without window functions.

## Performance Considerations

Window functions can be expensive on large datasets because the database must sort data within each partition. Tips:

- Ensure the `ORDER BY` columns in the `OVER` clause are indexed
- Use `PARTITION BY` columns that are indexed
- Avoid large frame clauses when possible (`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` requires scanning the entire partition into memory)

## Summary

- **CTEs** make complex queries readable by breaking them into named steps
- **Recursive CTEs** handle hierarchical data like comment threads
- **Window functions** compute rankings, running totals, and moving averages without collapsing rows
- **Combined**, they solve the "top N per group" and "comparison to previous" patterns elegantly

Write cleaner, more expressive SQL by reaching for CTEs and window functions before subqueries and self-joins. Your future self (and your colleagues) will thank you.
