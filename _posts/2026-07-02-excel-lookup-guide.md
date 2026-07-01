---
layout: post
title: A Complete Guide to Excel LOOKUP Functions
date: 2026-07-02
description: VLOOKUP, INDEX-MATCH, XLOOKUP — how each works, when to use them, and why XLOOKUP is usually the best choice.
---

Excel offers several ways to look up values. Choosing the right one can make your spreadsheets faster and easier to maintain.

## VLOOKUP

The classic lookup function. It searches for a value in the first column of a range and returns a value from a specified column.

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

Limitations:
- It only looks left-to-right. The lookup column must be the first column.
- If you insert a column in the table, the column index breaks.

## INDEX-MATCH

This combo is more flexible than VLOOKUP.

```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```

`MATCH` finds the position. `INDEX` returns the value at that position. Unlike VLOOKUP, the lookup and return ranges can be anywhere.

## XLOOKUP

Available in Excel 365 and Excel 2021. It replaces all the above.

```
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
```

Advantages:
- Looks both left and right.
- Returns a default value if nothing is found (no more `#N/A`).
- Supports wildcards and binary search for large datasets.

## Which One Should You Use?

| Function | When to Use |
|----------|-------------|
| VLOOKUP | Legacy spreadsheets, backward compatibility |
| INDEX-MATCH | Older Excel versions, right-to-left lookups |
| XLOOKUP | Always, if you have Excel 365 or 2021+ |

If you are on a modern version of Excel, XLOOKUP is almost always the right choice. It is simpler, more powerful, and less error-prone.
