---
layout: post
title: "Python for Data Analysis: Pandas vs SQL"
date: 2026-07-06
description: A practical side-by-side guide to performing the same data operations in pandas and SQL, with real code examples.
---

If you work with data, you've probably used both SQL and Python's pandas library. They overlap heavily — both let you filter, group, join, and aggregate data. But they think about data differently.

This article walks through common data operations side by side. You'll see the SQL query and the equivalent pandas code for each. By the end, you'll know when to reach for each tool and how to translate between them.

## The Setup

We'll use a simple dataset of YouTube channel statistics:

```sql
-- SQL table
CREATE TABLE channels (
    channel_id TEXT PRIMARY KEY,
    channel_name TEXT,
    subscriber_count INT,
    view_count INT,
    country TEXT,
    video_count INT
);
```

```python
# pandas DataFrame
import pandas as pd

channels = pd.DataFrame({
    'channel_id': ['UC1', 'UC2', 'UC3'],
    'channel_name': ['DataCamp', 'freeCodeCamp', 'Khan Academy'],
    'subscriber_count': [3000000, 4500000, 1200000],
    'view_count': [150000000, 280000000, 90000000],
    'country': ['US', 'US', 'US'],
    'video_count': [1500, 2200, 800]
})
```

## Selecting Columns

**SQL:** `SELECT channel_name, subscriber_count FROM channels;`

```python
# pandas
channels[['channel_name', 'subscriber_count']]
```

Both return a subset of columns. In pandas, you pass a list of column names inside the brackets. One difference: pandas returns a DataFrame when you pass a list, but a Series when you pass a single string.

## Filtering Rows

**SQL:** `SELECT * FROM channels WHERE subscriber_count > 2000000;`

```python
channels[channels['subscriber_count'] > 2000000]
```

The boolean mask is pandas' equivalent of `WHERE`. The condition `channels['subscriber_count'] > 2000000` produces a Series of True/False values, and indexing with it keeps only the matching rows.

**Multiple conditions:**

**SQL:** `SELECT * FROM channels WHERE subscriber_count > 2000000 AND country = 'US';`

```python
channels[(channels['subscriber_count'] > 2000000) & (channels['country'] == 'US')]
```

Use `&` instead of `and`, `|` instead of `OR`. The parentheses around each condition are required — operator precedence will break your query without them.

## Adding Calculated Columns

**SQL:** `SELECT channel_name, view_count / video_count AS views_per_video FROM channels;`

```python
channels['views_per_video'] = channels['view_count'] / channels['video_count']
```

pandas applies the division element-wise. The new column is added to the DataFrame. In SQL, the calculated column exists only in the query result unless you create a view or alter the table.

## Grouping and Aggregating

**SQL:** 
```sql
SELECT country, COUNT(*) AS channel_count, AVG(subscriber_count) AS avg_subscribers
FROM channels
GROUP BY country;
```

```python
channels.groupby('country').agg(
    channel_count=('channel_id', 'count'),
    avg_subscribers=('subscriber_count', 'mean')
).reset_index()
```

pandas `groupby` is more flexible — you can name your output columns and apply different functions to different columns in one pass. The `reset_index()` converts the grouped index back into a regular column.

## Sorting

**SQL:** `SELECT * FROM channels ORDER BY subscriber_count DESC LIMIT 5;`

```python
channels.sort_values('subscriber_count', ascending=False).head(5)
```

`sort_values` sorts the DataFrame. `head(5)` limits to the first 5 rows. In SQL, `LIMIT` is applied after sorting; in pandas, the order of operations is just method chaining.

## Joining Tables

Let's add a second table:

```sql
CREATE TABLE videos (
    video_id TEXT PRIMARY KEY,
    channel_id TEXT,
    title TEXT,
    views INT
);
```

```python
videos = pd.DataFrame({
    'video_id': ['V1', 'V2', 'V3'],
    'channel_id': ['UC1', 'UC1', 'UC2'],
    'title': ['Intro to SQL', 'Advanced SQL', 'Python Basics'],
    'views': [50000, 30000, 120000]
})
```

**SQL:** 
```sql
SELECT c.channel_name, v.title, v.views
FROM channels c
JOIN videos v ON c.channel_id = v.channel_id;
```

```python
channels.merge(videos, on='channel_id')[['channel_name', 'title', 'views']]
```

`merge` is pandas' join. By default it's an inner join. Use `how='left'` for a left join, `how='right'` for right, `how='outer'` for full outer.

## When to Use Which

**Use SQL when:**
- The data lives in a database and you only need a subset
- You're doing straightforward aggregations and filters
- You want the database engine to optimize execution
- Your dataset is larger than memory

**Use pandas when:**
- You need complex transformations (pivots, melting, custom functions)
- You're iterating between exploration and analysis
- You need to integrate with Python libraries (scikit-learn, matplotlib)
- The data is already in a CSV, JSON, or API response

## Translating Common Operations

| Operation | SQL | pandas |
|-----------|-----|--------|
| Filter | `WHERE col = x` | `df[df['col'] == x]` |
| Select columns | `SELECT a, b` | `df[['a', 'b']]` |
| Rename column | `SELECT a AS b` | `df.rename(columns={'a': 'b'})` |
| Drop duplicates | `SELECT DISTINCT` | `df.drop_duplicates()` |
| Sort | `ORDER BY col` | `df.sort_values('col')` |
| Group sum | `GROUP BY col` + `SUM(val)` | `df.groupby('col')['val'].sum()` |
| Join | `JOIN ... ON` | `df1.merge(df2, on='key')` |
| Union | `UNION ALL` | `pd.concat([df1, df2])` |
| Window rank | `ROW_NUMBER() OVER(...)` | `df['rank'] = df.groupby('col')['val'].rank()` |

## Practical Tip: Combine Both

The most effective workflow uses both. Query and filter with SQL, then pull the result into pandas for analysis:

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect('youtube.db')
df = pd.read_sql_query('''
    SELECT c.channel_name, v.title, v.views
    FROM channels c
    JOIN videos v ON c.channel_id = v.channel_id
    WHERE c.subscriber_count > 1000000
''', conn)

# Now analyze with pandas
top_videos = df.sort_values('views', ascending=False).head(10)
```

This pattern gives you the best of both: the database handles filtering and joining (what it's good at), and pandas handles the analysis and visualization (what it's good at).

## Summary

SQL and pandas are not competitors — they're complementary. SQL is declarative (you say *what* you want), pandas is imperative (you say *how* to get it). Learning both, and knowing when to use each, is the hallmark of an effective data analyst.
