import os
from zipfile import ZipFile
from pathlib import Path

structure = {
    ".github/workflows/fetch-news.yml": """name: Fetch News Daily

on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch:

jobs:
  fetch-news:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Fetch news from NewsAPI
      run: |
        curl -s "https://newsapi.org/v2/top-headlines?country=us&category=science&pageSize=5&apiKey=${{ secrets.NEWS_API_KEY }}" \\
        -o data/news.json

    - name: Commit and push updated news
      run: |
        git config --global user.name "GitHub Actions"
        git config --global user.email "actions@github.com"
        git add data/news.json
        git commit -m "📰 Update news"
        git push
      continue-on-error: true
""",

    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>STEM AI Tutoring Hub - News</title>
  <style>
    #flushingText {
      font-weight: bold;
      font-size: 1.2rem;
      color: #007acc;
      min-height: 1.5em;
    }
  </style>
</head>
<body>
  <div class="advertising-news">
    <h4>Latest in Maths Learning and AI</h4>
    <p id="flushingText">
      Stay updated with the newest trends in education and technology!
      <a id="stopLink" href="#">Stop Flushing</a>
    </p>
  </div>
  <script src="/assets/js/scripts.js"></script>
</body>
</html>
""",

    "assets/js/scripts.js": """const NewsManager = {
  element: null,
  intervalId: null,
  news: [],
  currentIndex: 0,

  init() {
    this.element = document.getElementById('flushingText');
    if (this.element) {
      this.setupStopLink();
      this.displayNews();
    }
  },

  async fetchNews() {
    try {
      const response = await fetch('/data/news.json');
      const data = await response.json();

      if (!data.articles || data.articles.length === 0) {
        return ['No news found.'];
      }

      return data.articles.map(article => \`\${article.title} — \${article.source.name}\`);
    } catch (error) {
      console.error('News fetch failed:', error);
      return ['Fallback news: Stay curious!'];
    }
  },

  async createFlushingEffect() {
    let iterations = 0;
    const maxIterations = 10;

    return new Promise((resolve) => {
      const flushInterval = setInterval(() => {
        if (this.element) {
          this.element.style.visibility = this.element.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }

        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(flushInterval);
          if (this.element) this.element.style.visibility = 'visible';
          resolve();
        }
      }, 300);
    });
  },

  async displayNews() {
    if (!this.element) return;

    await this.createFlushingEffect();
    this.element.textContent = 'Loading news...';

    this.news = await this.fetchNews();
    this.element.textContent = this.news[0] || 'No news available';
    this.currentIndex = 1;

    this.intervalId = setInterval(() => {
      this.element.textContent = this.news[this.currentIndex % this.news.length];
      this.currentIndex++;
    }, 6000);
  },

  setupStopLink() {
    const stopLink = document.getElementById('stopLink');
    if (stopLink) {
      stopLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearInterval(this.intervalId);
        if (this.element) {
          this.element.textContent += ' (News paused)';
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => NewsManager.init());
""",

    "data/news.json": """{
  "articles": []
}
"""
}

output_dir = Path("stem-ai-news-template")
output_dir.mkdir(parents=True, exist_ok=True)

for path, content in structure.items():
    full_path = output_dir / path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    full_path.write_text(content)

# Create the ZIP
with ZipFile("stem-ai-news-template.zip", "w") as zipf:
    for file_path in output_dir.rglob("*"):
        zipf.write(file_path, file_path.relative_to(output_dir.parent))

print("✅ ZIP created: stem-ai-news-template.zip")
