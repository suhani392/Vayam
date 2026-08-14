"""
scripts/sentinel_crawler.py

Vayam Sentinel - Scrapy Source Intelligence Crawler.
Crawls official Indian government portals, extracts clean text content,
normalizes HTML/PDF content, and outputs structured change detection payloads.
"""

import sys
import json
import re
import urllib.request
from html.parser import HTMLParser

class CleanTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.ignore_tags = {'script', 'style', 'head', 'title', 'meta', 'noscript'}
        self.current_tag = None

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag.lower()

    def handle_data(self, data):
        if self.current_tag not in self.ignore_tags:
            cleaned = data.strip()
            if cleaned:
                self.text_parts.append(cleaned)

    def get_text(self):
        return " ".join(self.text_parts)

def fetch_and_normalize(url):
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VayamSentinelBot/1.0 (+https://vayam.gov.in)'
            }
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode('utf-8', errors='ignore')
            parser = CleanTextExtractor()
            parser.feed(html)
            text = parser.get_text()
            text = re.sub(r'\s+', ' ', text).strip()
            return {
                'status': 'success',
                'url': url,
                'clean_text': text[:10000],
                'content_length': len(text)
            }
    except Exception as e:
        return {
            'status': 'error',
            'url': url,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
        result = fetch_and_normalize(target_url)
        print(json.dumps(result))
    else:
        print(json.dumps({'status': 'error', 'error': 'No URL specified'}))
