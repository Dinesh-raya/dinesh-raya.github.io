---
layout: post
title: "Building a Data Pipeline with Python and SQLite"
date: 2026-07-15
description: A practical walkthrough of building an ETL pipeline in Python that extracts data from an API, transforms it with pandas, and loads it into SQLite for analysis.
---

A data pipeline is a series of steps that moves data from a source to a destination, transforming it along the way. In production environments, you might use Airflow, dbt, or Spark. But for personal projects and small teams, Python + SQLite is surprisingly capable.

This article builds a complete ETL pipeline — Extract, Transform, Load — using the YouTube Data API as the source.

## The Architecture

```
[YouTube API] → [Extract: requests] → [Transform: pandas] → [Load: SQLite] → [Analysis]
```

We'll write a Python script that:
1. Fetches channel statistics from the YouTube API
2. Cleans and normalizes the data with pandas
3. Loads it into a local SQLite database
4. Runs a summary query

## Step 1: Extract

First, fetch data from an API. We'll use a mock API call — in production, replace with the actual YouTube Data API:

```python
import requests
import json
import time

def extract_channel_data(api_key, channel_ids):
    """Fetch channel statistics from YouTube API."""
    url = "https://www.googleapis.com/youtube/v3/channels"
    all_channels = []
    
    # Process in batches of 50 (API limit per request)
    for i in range(0, len(channel_ids), 50):
        batch = channel_ids[i:i+50]
        params = {
            'part': 'snippet,statistics',
            'id': ','.join(batch),
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        for item in data.get('items', []):
            channel = {
                'channel_id': item['id'],
                'channel_name': item['snippet']['title'],
                'subscriber_count': int(item['statistics'].get('subscriberCount', 0)),
                'view_count': int(item['statistics'].get('viewCount', 0)),
                'video_count': int(item['statistics'].get('videoCount', 0)),
                'country': item['snippet'].get('country', 'Unknown'),
                'published_at': item['snippet']['publishedAt']
            }
            all_channels.append(channel)
        
        time.sleep(0.1)  # Rate limiting
    
    return all_channels
```

The `extract` function is responsible for one thing: getting raw data from the source. No transformation. No cleaning. Just fetch and return.

### Extracting from a CSV

If your source is a file instead of an API:

```python
import pandas as pd

def extract_csv(filepath):
    """Extract data from a CSV file."""
    df = pd.read_csv(filepath)
    return df.to_dict('records')
```

## Step 2: Transform

Raw API data is rarely analysis-ready. Transformation handles cleaning, type conversion, and enrichment:

```python
import pandas as pd

def transform_channel_data(raw_channels):
    """Clean and normalize channel data."""
    df = pd.DataFrame(raw_channels)
    
    # Parse dates
    df['published_at'] = pd.to_datetime(df['published_at'])
    
    # Remove channels with zero videos (placeholder channels)
    df = df[df['video_count'] > 0]
    
    # Categorize by size
    def categorize(subscribers):
        if subscribers >= 1000000:
            return 'Large'
        elif subscribers >= 100000:
            return 'Medium'
        elif subscribers >= 1000:
            return 'Small'
        else:
            return 'Micro'
    
    df['size_category'] = df['subscriber_count'].apply(categorize)
    
    # Calculate engagement ratio
    df['engagement_ratio'] = (
        df['view_count'] / df['subscriber_count'].replace(0, 1)
    ).round(2)
    
    # Standardize country codes
    df['country'] = df['country'].str.upper().fillna('UNKNOWN')
    
    return df
```

Transformation rules depend entirely on your use case. The key principle: each transformation should be a single, testable operation.

## Step 3: Load

Load the cleaned data into SQLite:

```python
import sqlite3

def load_to_sqlite(df, db_path, table_name, if_exists='replace'):
    """Load DataFrame into SQLite database."""
    conn = sqlite3.connect(db_path)
    
    df.to_sql(
        table_name,
        conn,
        if_exists=if_exists,
        index=False,
        dtype={
            'channel_id': 'TEXT PRIMARY KEY',
            'subscriber_count': 'INTEGER',
            'view_count': 'INTEGER',
            'video_count': 'INTEGER',
            'published_at': 'DATE',
            'engagement_ratio': 'REAL'
        }
    )
    
    conn.close()
    print(f"Loaded {len(df)} rows into {table_name}")
```

`to_sql` handles the table creation and data insertion. The `dtype` parameter lets you specify SQL column types; without it, pandas makes reasonable guesses.

### Incremental Loading

For pipelines that run on a schedule, you don't want to reload everything each time:

```python
def load_incremental(df, db_path, table_name, key_column):
    """Append only new rows, skip existing."""
    conn = sqlite3.connect(db_path)
    
    # Get existing keys
    existing = pd.read_sql_query(
        f"SELECT {key_column} FROM {table_name}", conn
    )
    existing_keys = set(existing[key_column].tolist())
    
    # Filter out duplicates
    new_rows = df[~df[key_column].isin(existing_keys)]
    
    if not new_rows.empty:
        new_rows.to_sql(table_name, conn, if_exists='append', index=False)
        print(f"Added {len(new_rows)} new rows")
    else:
        print("No new rows to add")
    
    conn.close()
```

## Step 4: Orchestrate

Tie it all together in a main function:

```python
def run_pipeline(api_key, channel_ids, db_path):
    """Run the full ETL pipeline."""
    print("Starting pipeline...")
    
    # Extract
    print("Extracting...")
    raw = extract_channel_data(api_key, channel_ids)
    print(f"Extracted {len(raw)} channels")
    
    # Transform
    print("Transforming...")
    clean = transform_channel_data(raw)
    print(f"Transformed to {len(clean)} rows after cleaning")
    
    # Load
    print("Loading...")
    load_to_sqlite(clean, db_path, 'channels')
    
    # Verify
    conn = sqlite3.connect(db_path)
    result = pd.read_sql_query(
        "SELECT size_category, COUNT(*) AS count, AVG(subscriber_count) AS avg_subs "
        "FROM channels GROUP BY size_category ORDER BY avg_subs DESC",
        conn
    )
    conn.close()
    
    print("\nPipeline complete. Summary:")
    print(result.to_string(index=False))

if __name__ == '__main__':
    run_pipeline(
        api_key='YOUR_API_KEY',
        channel_ids=['UC1', 'UC2', 'UC3'],
        db_path='youtube_analytics.db'
    )
```

## Running on a Schedule

Once the pipeline works, automate it. On Linux/macOS, use cron:

```bash
# Run every day at 6 AM
0 6 * * * cd /path/to/project && python pipeline.py >> pipeline.log 2>&1
```

On Windows, use Task Scheduler to run `python pipeline.py` daily.

## Error Handling

Real pipelines fail. Handle errors gracefully:

```python
import logging
from datetime import datetime

logging.basicConfig(
    filename=f'pipeline_{datetime.now():%Y%m%d}.log',
    level=logging.INFO
)

def run_pipeline_with_logging(api_key, channel_ids, db_path):
    try:
        logging.info("Pipeline started")
        raw = extract_channel_data(api_key, channel_ids)
        clean = transform_channel_data(raw)
        load_to_sqlite(clean, db_path, 'channels')
        logging.info(f"Pipeline succeeded: {len(clean)} rows")
    except requests.exceptions.RequestException as e:
        logging.error(f"API error: {e}")
    except Exception as e:
        logging.error(f"Pipeline failed: {e}")
        raise
```

## Extending the Pipeline

This pattern scales to more complex needs:

- **Multiple sources** — Add more extract functions (CSVs, APIs, databases) and run them sequentially
- **Multiple tables** — Transform data into a star schema with fact and dimension tables
- **Data quality checks** — Add assertions after each step (row count expectations, null checks)
- **Notifications** — Send email or Slack alerts on failure

## Summary

A Python + SQLite pipeline is a practical, zero-infrastructure way to automate data workflows:

- **Extract** from APIs, CSVs, or databases with Python's standard library
- **Transform** with pandas — clean, type, enrich, validate
- **Load** into SQLite for fast, local querying
- **Schedule** with cron or Task Scheduler for automation

This pattern handles data pipelines for personal projects, team dashboards, and analytics workflows without the overhead of a distributed system. Start simple, add complexity only when you outgrow it.
