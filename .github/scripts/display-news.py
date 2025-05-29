#!/usr/bin/env python3
"""
📄 News Processor for GitHub Actions
Validates and structures NewsAPI articles for use in frontend applications.
"""

import os
import sys
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

class NewsProcessor:
    def __init__(self, input_file: str = "data/news.json", output_file: str = "data/news.json"):
        self.input_file = input_file
        self.output_file = output_file
        self.processed_data: Dict[str, Any] = {}

    def load_news_data(self) -> Optional[Dict[str, Any]]:
        """🔄 Load raw JSON from file"""
        if not os.path.exists(self.input_file):
            print(f"[ERROR] File not found: {self.input_file}")
            return None
        try:
            with open(self.input_file, "r", encoding="utf-8") as file:
                data = json.load(file)
                print(f"[OK] Loaded raw data from {self.input_file}")
                return data
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON decode issue: {e}")
        except Exception as e:
            print(f"[ERROR] Failed to load news: {e}")
        return None

    def is_valid_article(self, article: Dict[str, Any]) -> bool:
        """✅ Validate a single article"""
        if not all(k in article and article[k] for k in ['title', 'source']):
            return False
        if not isinstance(article['source'], dict) or 'name' not in article['source']:
            return False

        title = article['title'].strip().lower()
        if any(bad in title for bad in ['[removed]', 'untitled', 'breaking news', 'update:', 'live:', 'no title']):
            return False
        if not (10 <= len(title) <= 200):
            return False
        return True

    def process_articles(self, raw: Dict[str, Any]) -> List[Dict[str, Any]]:
        """🧹 Clean and extract articles"""
        if "articles" not in raw or not isinstance(raw["articles"], list):
            print("[WARN] No valid articles array")
            return []

        output = []
        now_iso = datetime.now(timezone.utc).isoformat()
        for i, article in enumerate(raw["articles"], 1):
            if self.is_valid_article(article):
                output.append({
                    "title": article["title"].strip(),
                    "source": {"name": article["source"]["name"]},
                    "description": (article.get("description", "")[:100] + "...") if article.get("description") else "",
                    "url": article.get("url", ""),
                    "publishedAt": article.get("publishedAt", ""),
                    "processed_at": now_iso
                })
                print(f"[OK] Article {i}: {article['title'][:60]}...")
            else:
                print(f"[SKIP] Article {i}: Invalid format or content")
        return output

    def fallback_articles(self) -> List[Dict[str, Any]]:
        """🆘 Fallback data if NewsAPI fails"""
        now_iso = datetime.now(timezone.utc).isoformat()
        titles = [
            ("Breaking: Scientists discover new method for faster learning", "Science Daily", "Revolutionary approach to accelerated learning techniques..."),
            ("Education News: Online tutoring platform shows 85% improvement rates", "EdTech Weekly", "Comprehensive study reveals significant learning gains..."),
            ("Tech Update: AI-powered study tools gain popularity", "TechCrunch", "Artificial intelligence transforms education..."),
            ("Research: Personalized learning shows promising results", "Educational Research", "Tailored educational methods demonstrate effectiveness..."),
            ("Innovation: New classroom tech boosts engagement", "Digital Learning", "Interactive technologies boost student participation...")
        ]
        fallback = [{
            "title": title,
            "source": {"name": source},
            "description": desc,
            "url": "#",
            "publishedAt": now_iso,
            "processed_at": now_iso
        } for title, source, desc in titles]
        print(f"[INFO] Using {len(fallback)} fallback articles")
        return fallback

    def compile_data(self, articles: List[Dict[str, Any]], source: str) -> None:
        """📦 Create final output format"""
        now_iso = datetime.now(timezone.utc).isoformat()
        self.processed_data = {
            "status": "success",
            "totalResults": len(articles),
            "articles": articles,
            "lastUpdated": now_iso,
            "source": source,
            "metadata": {
                "processed_by": "GitHub Actions",
                "script_version": "2.0.0",
                "compatible_with": "scripts.js NewsManager"
            }
        }

    def save(self) -> bool:
        """💾 Save processed news to output file"""
        try:
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(self.processed_data, f, indent=2, ensure_ascii=False)
            print(f"[OK] Saved to {self.output_file}")
            return True
        except Exception as e:
            print(f"[ERROR] Could not save file: {e}")
            return False

    def display_summary(self) -> None:
        """📊 Show summary of processed data"""
        print("\n[SUMMARY]")
        print(f"  • Articles: {self.processed_data.get('totalResults', 0)}")
        print(f"  • Source: {self.processed_data.get('source', '-')}")
        print(f"  • Last Updated: {self.processed_data.get('lastUpdated', '-')}")
        print(f"  • Status: {self.processed_data.get('status', '-')}")

def main():
    print("🚀 Starting News Processor...\n")
    processor = NewsProcessor()

    raw = processor.load_news_data()
    if raw:
        articles = processor.process_articles(raw)
        if not articles:
            print("[WARN] No valid articles found, using fallback")
            articles = processor.fallback_articles()
            source = "Fallback"
        else:
            source = "NewsAPI"
    else:
        print("[WARN] Loading failed, using fallback")
        articles = processor.fallback_articles()
        source = "Fallback"

    processor.compile_data(articles, source)

    if not processor.save():
        sys.exit(1)

    processor.display_summary()
    print("\n✅ News processing complete!\n")

if __name__ == "__main__":
    main()
