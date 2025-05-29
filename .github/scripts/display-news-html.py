#!/usr/bin/env python3
import json
import os

INPUT_FILE = "data/news.json"
OUTPUT_FILE = "data/news.html"

def json_to_html(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"[ERROR] Input file not found: {input_file}")
        return
    
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    articles = data.get("articles", [])
    html_content = """
    <html>
    <head>
      <title>Daily News</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .article { margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; color: #333; }
        .source { color: #666; font-style: italic; }
        .description { margin-top: 5px; }
        .published { font-size: 12px; color: #999; margin-top: 3px; }
        a { text-decoration: none; color: #1a0dab; }
      </style>
    </head>
    <body>
      <h1>Daily News</h1>
    """

    if not articles:
        html_content += "<p>No articles found.</p>"
    else:
        for art in articles:
            title = art.get("title", "No Title")
            source = art.get("source", {}).get("name", "Unknown Source")
            description = art.get("description", "")
            url = art.get("url", "#")
            published = art.get("publishedAt", "")

            html_content += f"""
            <div class="article">
              <div class="title"><a href="{url}" target="_blank" rel="noopener">{title}</a></div>
              <div class="source">Source: {source}</div>
              <div class="description">{description}</div>
              <div class="published">Published at: {published}</div>
            </div>
            """

    html_content += """
    </body>
    </html>
    """

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"HTML news file created at: {output_file}")

if __name__ == "__main__":
    json_to_html(INPUT_FILE, OUTPUT_FILE)
