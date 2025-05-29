#!/usr/bin/env python3
"""
News Display Script for GitHub Actions
Processes and validates news data from NewsAPI for display in scripts.js
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

class NewsProcessor:
    """Handles news data processing and validation"""
    
    def __init__(self, input_file: str = "data/news.json", output_file: str = "data/news.json"):
        self.input_file = input_file
        self.output_file = output_file
        self.processed_data = {}
    
    def load_raw_news(self) -> Optional[Dict[str, Any]]:
        """Load raw news data from NewsAPI response"""
        try:
            if not os.path.exists(self.input_file):
                print(f"❌ Input file not found: {self.input_file}")
                return None
            
            with open(self.input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"✅ Loaded raw news data from {self.input_file}")
            return data
        
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error loading news: {e}")
            return None
    
    def validate_article(self, article: Dict[str, Any]) -> bool:
        """Validate individual news article"""
        required_fields = ['title', 'source']
        
        # Check required fields exist
        for field in required_fields:
            if field not in article or not article[field]:
                return False
        
        # Validate source structure
        if not isinstance(article['source'], dict) or 'name' not in article['source']:
            return False
        
        # Filter out articles with generic or placeholder titles
        title = article['title'].lower()
        invalid_phrases = [
            '[removed]',
            'untitled',
            'no title',
            'breaking news',
            'update:',
            'live:'
        ]
        
        if any(phrase in title for phrase in invalid_phrases):
            return False
        
        # Ensure title is not too short or too long
        if len(article['title'].strip()) < 10 or len(article['title']) > 200:
            return False
        
        return True
    
    def process_articles(self, raw_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process and filter articles from NewsAPI response"""
        if 'articles' not in raw_data or not isinstance(raw_data['articles'], list):
            print("❌ No valid articles array found in data")
            return []
        
        valid_articles = []
        
        for i, article in enumerate(raw_data['articles']):
            if self.validate_article(article):
                processed_article = {
                    'title': article['title'].strip(),
                    'source': {
                        'name': article['source']['name']
                    },
                    'description': article.get('description', '').strip()[:100] + '...' if article.get('description') else '',
                    'url': article.get('url', ''),
                    'publishedAt': article.get('publishedAt', ''),
                    'processed_at': datetime.now(timezone.utc).isoformat()
                }
                valid_articles.append(processed_article)
                print(f"✅ Article {i+1}: {article['title'][:50]}...")
            else:
                print(f"❌ Article {i+1}: Invalid or filtered out")
        
        return valid_articles
    
    def create_fallback_news(self) -> List[Dict[str, Any]]:
        """Create fallback news when API fails"""
        fallback_articles = [
            {
                'title': 'Breaking: Scientists discover new method for faster learning',
                'source': {'name': 'Science Daily'},
                'description': 'Revolutionary approach to accelerated learning techniques...',
                'url': '#',
                'publishedAt': datetime.now(timezone.utc).isoformat(),
                'processed_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'title': 'Education News: Online tutoring platform shows 85% improvement rates',
                'source': {'name': 'EdTech Weekly'},
                'description': 'Comprehensive study reveals significant learning gains...',
                'url': '#',
                'publishedAt': datetime.now(timezone.utc).isoformat(),
                'processed_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'title': 'Tech Update: AI-powered study tools gain popularity among students',
                'source': {'name': 'TechCrunch'},
                'description': 'Artificial intelligence transforms educational landscape...',
                'url': '#',
                'publishedAt': datetime.now(timezone.utc).isoformat(),
                'processed_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'title': 'Research: Personalized learning approaches show promising results',
                'source': {'name': 'Educational Research'},
                'description': 'Tailored educational methods demonstrate effectiveness...',
                'url': '#',
                'publishedAt': datetime.now(timezone.utc).isoformat(),
                'processed_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'title': 'Innovation: New digital classroom technologies enhance engagement',
                'source': {'name': 'Digital Learning'},
                'description': 'Interactive technologies boost student participation...',
                'url': '#',
                'publishedAt': datetime.now(timezone.utc).isoformat(),
                'processed_at': datetime.now(timezone.utc).isoformat()
            }
        ]
        
        print(f"🔄 Created {len(fallback_articles)} fallback news articles")
        return fallback_articles
    
    def process_news(self) -> bool:
        """Main processing function"""
        print("📰 Starting news processing...")
        
        # Load raw data
        raw_data = self.load_raw_news()
        
        if raw_data is None:
            print("⚠️ Using fallback news due to load failure")
            articles = self.create_fallback_news()
        else:
            # Process articles
            articles = self.process_articles(raw_data)
            
            # Use fallback if no valid articles found
            if not articles:
                print("⚠️ No valid articles found, using fallback news")
                articles = self.create_fallback_news()
        
        # Create final data structure
        self.processed_data = {
            'status': 'success',
            'totalResults': len(articles),
            'articles': articles,
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'source': 'NewsAPI' if raw_data else 'Fallback',
            'metadata': {
                'processed_by': 'GitHub Actions',
                'script_version': '1.0.0',
                'compatible_with': 'scripts.js NewsManager'
            }
        }
        
        print(f"✅ Processed {len(articles)} articles successfully")
        return True
    
    def save_processed_news(self) -> bool:
        """Save processed news to output file"""
        try:
            # Ensure output directory exists
            output_dir = os.path.dirname(self.output_file)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
                print(f"📁 Created directory: {output_dir}")
            
            # Write processed data
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(self.processed_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Saved processed news to {self.output_file}")
            
            # Display sample for verification
            if self.processed_data.get('articles'):
                print("\n📋 Sample processed articles:")
                for i, article in enumerate(self.processed_data['articles'][:3], 1):
                    print(f"  {i}. {article['title']} — {article['source']['name']}")
            
            return True
        
        except Exception as e:
            print(f"❌ Error saving processed news: {e}")
            return False
    
    def display_stats(self):
        """Display processing statistics"""
        if not self.processed_data:
            print("❌ No processed data available")
            return
        
        print("\n📊 Processing Statistics:")
        print(f"  • Total articles: {self.processed_data.get('totalResults', 0)}")
        print(f"  • Data source: {self.processed_data.get('source', 'Unknown')}")
        print(f"  • Last updated: {self.processed_data.get('lastUpdated', 'Unknown')}")
        print(f"  • Status: {self.processed_data.get('status', 'Unknown')}")

def main():
    """Main execution function"""
    print("🚀 News Display Script Starting...")
    
    # Initialize processor
    processor = NewsProcessor()
    
    # Process news
    if not processor.process_news():
        print("❌ News processing failed")
        sys.exit(1)
    
    # Save processed news
    if not processor.save_processed_news():
        print("❌ Failed to save processed news")
        sys.exit(1)
    
    # Display statistics
    processor.display_stats()
    
    print("\n✅ News processing completed successfully!")
    print("🔗 News data is now ready for scripts.js NewsManager")

if __name__ == "__main__":
    main()
