---
layout: post
title: "Data Cleaning with Python and Pandas: A Real-World Guide"
date: 2026-07-10
description: A step-by-step walkthrough of cleaning a messy real-world dataset using pandas, covering missing values, duplicates, outliers, and data type issues.
---

In practice, 80% of data analysis is cleaning data. Raw data is never clean — it has missing values, inconsistent formats, duplicate rows, and outliers that will break your analysis.

This article walks through a realistic data cleaning workflow using pandas. We'll start with a messy CSV and end with a clean, analysis-ready dataset.

## The Dataset

Let's create a realistic messy dataset — YouTube video analytics export with common problems:

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'video_id': ['V1', 'V2', 'V2', 'V3', 'V4', 'V5', 'V6', None, 'V7'],
    'title': [
        'Intro to SQL', 'Advanced Python', 'Advanced Python',
        'Data Cleaning', 'Pandas 101', None, 'SQL Joins',
        'Missing ID Video', 'Final Video'
    ],
    'views': [5000, 12000, 12000, None, 3000, 4500, 8000, 200, 10000],
    'duration_seconds': [600, '900', '900', 1200, 300, 450, None, 100, 750],
    'published_date': [
        '2026-01-15', '2026/02/20', '2026/02/20',
        '01-03-2026', '2026-04-10', None, '2026-05-20',
        'invalid-date', '2026-06-01'
    ],
    'category': ['Education', 'Tech', 'Tech', None, 'Education', 'Tech', 'Education', 'Tech', 'Education']
})
```

This dataset has: duplicates, missing values, mixed date formats, string-duration where integers belong, a null ID, and an outlier. Let's clean it.

## Step 1: Understand the Shape of the Mess

Before cleaning anything, get a baseline:

```python
df.info()
```

```
RangeIndex: 9 entries, 0 to 8
Data columns:
video_id           7 non-null object
title              8 non-null object
views              8 non-null float64
duration_seconds   7 non-null object
published_date     8 non-null object
category           8 non-null object
```

Immediate problems visible:
- `video_id` has 7 non-null values out of 9 rows — missing IDs
- `duration_seconds` is object (string), not int — mixed types
- `published_date` is object — needs parsing
- Multiple columns have nulls

## Step 2: Remove Duplicates

Duplicate rows inflate metrics and bias analysis. Find and remove them:

```python
# Check for duplicates
print(df.duplicated())
print(df.duplicated().sum())  # Count duplicates

# See which rows are duplicates
print(df[df.duplicated(keep=False)])
```

Output shows rows 2 and 3 are identical. Remove them:

```python
df = df.drop_duplicates()
print(df.shape)  # (8, 6)
```

`keep='first'` is the default — keeps the first occurrence and drops subsequent duplicates. If you want to keep the last, use `keep='last'`.

## Step 3: Handle Missing Values

Decide on a strategy per column:

```python
# Check how many nulls per column
print(df.isnull().sum())
```

### Drop rows with missing critical identifiers

A video with no `video_id` is useless:

```python
df = df.dropna(subset=['video_id'])
```

### Fill or drop non-critical nulls

For `title`, we can't analyze a video without a title:

```python
df = df.dropna(subset=['title'])
```

For `views`, we could fill with the median if we want to keep the row:

```python
median_views = df['views'].median()
df['views'].fillna(median_views, inplace=True)
```

For `category`, we can label it as unknown:

```python
df['category'].fillna('Unknown', inplace=True)
```

For `published_date`, drop rows where it's missing or invalid — dates are too important to guess:

```python
# We'll handle this in the date parsing step
```

After handling nulls:

```python
print(df.isnull().sum())
# Should be all zeros or intentional
```

## Step 4: Fix Data Types

### Convert duration to numeric

```python
df['duration_seconds'] = pd.to_numeric(df['duration_seconds'], errors='coerce')
```

`errors='coerce'` converts invalid values (like strings) to NaN, which you can then fill or drop:

```python
mean_duration = df['duration_seconds'].mean()
df['duration_seconds'].fillna(mean_duration, inplace=True)
df['duration_seconds'] = df['duration_seconds'].astype(int)
```

### Parse dates

Mixed formats need `pd.to_datetime` with `dayfirst` handling:

```python
df['published_date'] = pd.to_datetime(df['published_date'], errors='coerce', dayfirst=True)
```

This handles `'2026-01-15'`, `'2026/02/20'`, and `'01-03-2026'` (with `dayfirst=True`, March 1st). Invalid dates become NaT and can be dropped:

```python
df = df.dropna(subset=['published_date'])
```

### Convert views to int

```python
df['views'] = df['views'].astype(int)
```

## Step 5: Detect and Handle Outliers

Outliers distort averages and break models. Use the IQR method:

```python
Q1 = df['views'].quantile(0.25)
Q3 = df['views'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[(df['views'] < lower) | (df['views'] > upper)]
print(outliers)
```

For this dataset, a video with 200 views when the median is ~6000 might be a legitimate outlier or a data entry error. Decision depends on context. Options:

```python
# Cap at the upper bound (winsorizing)
df['views'] = df['views'].clip(upper=upper)

# Or remove outliers
df = df[~((df['views'] < lower) | (df['views'] > upper))]
```

## Step 6: Standardize Text Columns

Text columns often have inconsistent casing, extra spaces, or trailing whitespace:

```python
df['category'] = df['category'].str.strip().str.title()
df['title'] = df['title'].str.strip()
```

## Step 7: Reset the Index

After all the row removals, the index has gaps:

```python
df.reset_index(drop=True, inplace=True)
```

## The Final Cleaned Dataset

```python
print(df.info())
print(df.head())
```

```
RangeIndex: 4 entries, 0 to 3
Data columns:
video_id           4 non-null object
title              4 non-null object
views              4 non-null int64
duration_seconds   4 non-null int64
published_date     4 non-null datetime64[ns]
category           4 non-null object
```

Clean, typed, and ready for analysis.

## Putting It All Together

Here's the complete cleaning pipeline as a reusable function:

```python
def clean_youtube_data(df):
    """Clean a raw YouTube analytics DataFrame."""
    df = df.drop_duplicates()
    df = df.dropna(subset=['video_id', 'title', 'published_date'])
    
    df['duration_seconds'] = pd.to_numeric(df['duration_seconds'], errors='coerce')
    df['duration_seconds'].fillna(df['duration_seconds'].mean(), inplace=True)
    df['duration_seconds'] = df['duration_seconds'].astype(int)
    
    df['published_date'] = pd.to_datetime(df['published_date'], errors='coerce')
    
    df['views'] = pd.to_numeric(df['views'], errors='coerce')
    df['views'].fillna(df['views'].median(), inplace=True)
    df['views'] = df['views'].astype(int)
    
    df['category'].fillna('Unknown', inplace=True)
    df['category'] = df['category'].str.strip().str.title()
    df['title'] = df['title'].str.strip()
    
    df.reset_index(drop=True, inplace=True)
    return df
```

## Summary

Cleaning data is not glamorous, but it's the most important step in analysis. The consistent pattern is:

1. **Inspect** — `info()`, `isnull().sum()`, `describe()`, `duplicated()`
2. **Remove duplicates** — `drop_duplicates()`
3. **Handle nulls** — drop critical columns, fill or drop non-critical ones
4. **Fix types** — `pd.to_numeric()`, `pd.to_datetime()`, `.astype()`
5. **Handle outliers** — IQR, capping, or domain-specific rules
6. **Standardize text** — strip, case, format
7. **Verify** — check `info()` and `head()` again

A clean dataset makes every subsequent step — analysis, visualization, modeling — faster and more reliable.
