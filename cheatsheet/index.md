---
layout: default
title: Cheatsheet
permalink: /cheatsheet/
description: Free cheatsheets for Excel, Power BI, Tableau, and SQL — 250+ formulas each with clear explanations.
---

<style>
  .cheatsheet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    max-width: 1000px;
    margin: 40px auto;
  }
  .cheatsheet-card {
    background: var(--surface);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cheatsheet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  .cheatsheet-card img {
    width: 72px;
    height: 72px;
    margin-bottom: 16px;
  }
  .cheatsheet-card h3 {
    margin: 0 0 8px;
    font-size: 1.1em;
  }
  .cheatsheet-card p {
    margin: 0;
    font-size: 14px;
    color: var(--text-muted);
  }
  h1 {
    text-align: center;
    margin-top: 20px;
    font-size: 2em;
  }
</style>

<h1>Cheatsheet</h1>
<p style="text-align:center;color:var(--text-muted);margin-bottom:8px;">Select a subject to start learning.</p>

<div class="cheatsheet-grid">
  <a class="cheatsheet-card" href="/excel-250-formulas/">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Microsoft_Office_Excel_%282019%E2%80%932025%29.svg/960px-Microsoft_Office_Excel_%282019%E2%80%932025%29.svg.png" alt="Excel">
    <h3>Excel 250+ Formulas</h3>
  </a>

  <a class="cheatsheet-card" href="/power-bi-250-formulas/">
    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/power-bi-icon.png" alt="Power BI">
    <h3>Power BI 250+ Formulas</h3>
  </a>

  <a class="cheatsheet-card" href="/tableau-250-formulas/">
    <img src="https://play-lh.googleusercontent.com/mOnDUzDzCg17hGNgAkMAnaR8dAcT8WwyBfkKqJtSRC0MdNZ4RrNR01GK0PrgEFA_NFM=w240-h480-rw" alt="Tableau">
    <h3>Tableau 250+ Formulas</h3>
  </a>

  <a class="cheatsheet-card" href="/sql-250-formulas/">
    <img src="https://cdn.prod.website-files.com/66754aa69a5d872183713f9c/672dfced5422c158fb5a6002_mysql%20logo.png" alt="SQL">
    <h3>SQL 250+ Formulas</h3>
  </a>
</div>
