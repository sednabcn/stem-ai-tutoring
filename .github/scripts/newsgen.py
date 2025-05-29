import json
import os

def load_news():
    try:
        with open("data/news.json", "r", encoding="utf-8") as f:
            news_data = json.load(f)
            return news_data["articles"] if "articles" in news_data else []
    except Exception:
        print("⚠️ Failed to load news.json — using default articles")
        return get_default_articles()

def get_default_articles():
    # Return some hardcoded or safe defaults
    return [
        {"title": "Default Science News 1", "url": "#"},
        {"title": "Default Science News 2", "url": "#"},
    ]
