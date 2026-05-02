#!/usr/bin/env python3
"""
SmartSheti Translation API Service
Provides real-time translation using multiple translation services
Supports: English, Hindi, Marathi
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import os
from functools import lru_cache
import hashlib
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Translation cache to reduce API calls
translation_cache = {}
CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'json', 'translation_cache.json')

def load_cache():
    global translation_cache
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                translation_cache = json.load(f)
            logger.info(f"Loaded {len(translation_cache)} translations from files")
        except Exception as e:
            logger.error(f"Error loading cache: {e}")
            translation_cache = {}

def save_cache():
    try:
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(translation_cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Error saving cache: {e}")

load_cache()

class TranslationService:
    """Multi-provider translation service with fallback"""
    
    def __init__(self):
        # Language codes
        self.languages = {
            'en': 'English',
            'hi': 'Hindi',
            'mr': 'Marathi'
        }
        
        # MyMemory Translation API (Free, no API key needed)
        self.mymemory_url = "https://api.mymemory.translated.net/get"
        
        # Google Translate API (would need API key for production)
        # self.google_api_key = "YOUR_GOOGLE_API_KEY"
        
        logger.info("Translation service initialized")
    
    def get_cache_key(self, text, source_lang, target_lang):
        """Generate cache key for translation"""
        content = f"{text}|{source_lang}|{target_lang}"
        return hashlib.md5(content.encode()).hexdigest()
    
    @lru_cache(maxsize=1000)
    def translate_mymemory(self, text, source_lang, target_lang):
        """Translate using MyMemory API (Free)"""
        try:
            params = {
                'q': text,
                'langpair': f'{source_lang}|{target_lang}'
            }
            
            response = requests.get(self.mymemory_url, params=params, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('responseStatus') == 200:
                    translated = data['responseData']['translatedText']
                    logger.info(f"MyMemory: {text[:30]}... -> {translated[:30]}...")
                    return translated
            
            return None
            
        except Exception as e:
            logger.error(f"MyMemory translation error: {e}")
            return None
    
    def translate_google(self, text, source_lang, target_lang):
        """Translate using Google Translate (would need API key)"""
        # This is a placeholder for Google Translate API
        # In production, you would use: googletrans library or Google Cloud Translation API
        try:
            from googletrans import Translator
            translator = Translator()
            result = translator.translate(text, src=source_lang, dest=target_lang)
            return result.text
        except:
            return None
    
    def translate_text(self, text, source_lang='en', target_lang='hi'):
        """Main translation method with caching and fallback"""
        
        # Return original if same language
        if source_lang == target_lang:
            return text
        
        # Check cache first
        cache_key = self.get_cache_key(text, source_lang, target_lang)
        if cache_key in translation_cache:
            logger.info(f"Cache hit for: {text[:30]}...")
            return translation_cache[cache_key]
        
        # Try MyMemory API first (free, no key needed)
        translated = self.translate_mymemory(text, source_lang, target_lang)
        
        # Fallback to Google Translate (if googletrans installed)
        if not translated:
            translated = self.translate_google(text, source_lang, target_lang)
        
        # If all fails, return original text
        if not translated:
            translated = text
            logger.warning(f"Translation failed, using original: {text[:30]}...")
        
        # Cache the result
        translation_cache[cache_key] = translated
        save_cache()
        
        return translated
    
    def translate_batch(self, texts, source_lang='en', target_lang='hi'):
        """Translate multiple texts at once"""
        results = {}
        for key, text in texts.items():
            results[key] = self.translate_text(text, source_lang, target_lang)
        return results

# Initialize translation service
translator = TranslationService()

@app.route('/api/translate', methods=['POST'])
def translate():
    """
    Translate single text
    POST body: {
        "text": "Hello",
        "source": "en",
        "target": "hi"
    }
    """
    try:
        data = request.json
        text = data.get('text', '')
        source = data.get('source', 'en')
        target = data.get('target', 'hi')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400
        
        translated = translator.translate_text(text, source, target)
        
        return jsonify({
            'success': True,
            'original': text,
            'translated': translated,
            'source': source,
            'target': target
        })
        
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/translate/batch', methods=['POST'])
def translate_batch():
    """
    Translate multiple texts at once
    POST body: {
        "texts": {
            "home": "Home",
            "weather": "Weather"
        },
        "source": "en",
        "target": "hi"
    }
    """
    try:
        data = request.json
        texts = data.get('texts', {})
        source = data.get('source', 'en')
        target = data.get('target', 'hi')
        
        if not texts:
            return jsonify({
                'success': False,
                'error': 'Texts object is required'
            }), 400
        
        translated = translator.translate_batch(texts, source, target)
        
        return jsonify({
            'success': True,
            'source': source,
            'target': target,
            'count': len(translated),
            'translations': translated
        })
        
    except Exception as e:
        logger.error(f"Batch translation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/translate/languages', methods=['GET'])
def get_languages():
    """Get supported languages"""
    return jsonify({
        'success': True,
        'languages': translator.languages
    })

@app.route('/api/translate/cache/stats', methods=['GET'])
def cache_stats():
    """Get cache statistics"""
    return jsonify({
        'success': True,
        'cached_items': len(translation_cache),
        'cache_info': {
            'size': len(translation_cache),
            'max_size': 1000
        }
    })

@app.route('/api/translate/cache/clear', methods=['POST'])
def clear_cache():
    """Clear translation cache"""
    global translation_cache
    old_size = len(translation_cache)
    translation_cache.clear()
    save_cache()
    
    return jsonify({
        'success': True,
        'message': f'Cleared {old_size} cached translations'
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'SmartSheti Translation API',
        'languages': list(translator.languages.keys()),
        'cached_translations': len(translation_cache)
    })

@app.route('/')
def index():
    """API documentation"""
    return jsonify({
        'service': 'SmartSheti Translation API',
        'version': '1.0',
        'endpoints': {
            'POST /api/translate': 'Translate single text',
            'POST /api/translate/batch': 'Translate multiple texts',
            'GET /api/translate/languages': 'Get supported languages',
            'GET /api/translate/cache/stats': 'Cache statistics',
            'POST /api/translate/cache/clear': 'Clear cache',
            'GET /api/health': 'Health check'
        },
        'example': {
            'single': {
                'url': 'POST /api/translate',
                'body': {
                    'text': 'Hello',
                    'source': 'en',
                    'target': 'hi'
                }
            },
            'batch': {
                'url': 'POST /api/translate/batch',
                'body': {
                    'texts': {
                        'home': 'Home',
                        'weather': 'Weather'
                    },
                    'source': 'en',
                    'target': 'hi'
                }
            }
        },
        'supported_languages': translator.languages
    })

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║      SmartSheti Translation API Server                   ║
    ║                                                          ║
    ║  🌐 Real-time translation for agricultural platform     ║
    ║                                                          ║
    ║  Supported Languages:                                    ║
    ║  • English (en)                                         ║
    ║  • हिंदी / Hindi (hi)                                   ║
    ║  • मराठी / Marathi (mr)                                 ║
    ║                                                          ║
    ║  API Endpoints:                                          ║
    ║  • http://localhost:5001/api/translate                  ║
    ║  • http://localhost:5001/api/translate/batch            ║
    ║  • http://localhost:5001/api/translate/languages        ║
    ║                                                          ║
    ║  Press Ctrl+C to stop the server                        ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    print("🚀 Starting Translation API Server on http://localhost:5001\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
