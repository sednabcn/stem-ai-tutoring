#!/usr/bin/env python3
import os
import json
import html
from datetime import datetime

# Static file paths for GitHub Actions
INPUT_FILE = "data/news.json"
OUTPUT_FILE = "data/news.html"

def json_to_html(input_file: str, output_file: str) -> None:
    if not os.path.exists(input_file):
        print(f"[ERROR] Input file not found: {input_file}")
        return

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON: {e}")
        return

    articles = data.get("articles", [])

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily News</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; }
    .article { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 30px; }
    .title { font-size: 20px; font-weight: bold; color: #333; }
    .source { color: #666; font-style: italic; margin-top: 5px; }
    .description { margin-top: 10px; line-height: 1.5; }
    .published { font-size: 12px; color: #999; margin-top: 8px; }
    a { text-decoration: none; color: #1a0dab; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Daily News</h1>
"""

    if not articles:
        html_content += "<p>No articles available.</p>"
    else:
        for article in articles:
            title = html.escape(article.get("title", "No Title"))
            source = html.escape(article.get("source", {}).get("name", "Unknown Source"))
            description = html.escape(article.get("description", ""))
            url = article.get("url", "#")
            published_raw = article.get("publishedAt", "")
            try:
                published_date = datetime.fromisoformat(published_raw.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M UTC")
            except ValueError:
                published_date = html.escape(published_raw)

            html_content += f"""
  <div class="article">
    <div class="title"><a href="{html.escape(url)}" target="_blank" rel="noopener noreferrer">{title}</a></div>
    <div class="source">Source: {source}</div>
    <div class="description">{description}</div>
    <div class="published">Published at: {published_date}</div>
  </div>
"""

    html_content += """
</body>
</html>
"""

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"[SUCCESS] HTML news file created at: {output_file}")
    except IOError as e:
        print(f"[ERROR] Failed to write HTML file: {e}")

if __name__ == "__main__":
    json_to_html(INPUT_FILE, OUTPUT_FILE)
