# 🌐 SmartSheti Translation API

## Overview
Real-time translation API for SmartSheti platform supporting **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.

## 🚀 Quick Start

### Start Translation Server
```bash
# Double-click to run:
start_translation_api.bat

# Or manually:
cd backend/api
python translation_api.py
```

Server runs on: **http://localhost:5001**

## 📡 API Endpoints

### 1. Translate Single Text
```http
POST /api/translate
```

**Request:**
```json
{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "original": "Hello, how are you?",
  "translated": "नमस्ते, आप कैसे हैं?",
  "source": "en",
  "target": "hi"
}
```

### 2. Translate Batch (Multiple Texts)
```http
POST /api/translate/batch
```

**Request:**
```json
{
  "texts": {
    "home": "Home",
    "weather": "Weather",
    "crops": "Crops",
    "market": "Market"
  },
  "source": "en",
  "target": "mr"
}
```

**Response:**
```json
{
  "success": true,
  "source": "en",
  "target": "mr",
  "count": 4,
  "translations": {
    "home": "घर",
    "weather": "हवामान",
    "crops": "पिके",
    "market": "बाजार"
  }
}
```

### 3. Get Supported Languages
```http
GET /api/translate/languages
```

**Response:**
```json
{
  "success": true,
  "languages": {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi"
  }
}
```

### 4. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "SmartSheti Translation API",
  "languages": ["en", "hi", "mr"],
  "cached_translations": 127
}
```

### 5. Cache Statistics
```http
GET /api/translate/cache/stats
```

### 6. Clear Cache
```http
POST /api/translate/cache/clear
```

## 💻 Frontend Integration

### Using the Translation API Client

```javascript
// Initialize
const translationAPI = new TranslationAPI();

// Translate single text
const translated = await translationAPI.translateText(
    "Welcome to SmartSheti",
    "en",  // source
    "hi"   // target
);
console.log(translated); // "स्मार्टशेती में आपका स्वागत है"

// Translate multiple texts
const texts = {
    home: "Home",
    crops: "Crops",
    weather: "Weather"
};
const results = await translationAPI.translateBatch(texts, "en", "mr");
console.log(results);
// { home: "घर", crops: "पिके", weather: "हवामान" }
```

### Auto-fallback
If API is unavailable, system automatically uses static translations:
```javascript
// Automatically falls back to static translations if API is down
const text = await translationAPI.translateText("Crop", "en", "hi");
// Returns "फसल" from static dictionary
```

## 🛠️ How It Works

### Translation Flow
```
User Input (English)
       ↓
Check Cache (Fast!)
       ↓
Cache Miss? → Try MyMemory API (Free)
       ↓
Failed? → Try Google Translate (if available)
       ↓
All Failed? → Return Original Text
       ↓
Save to Cache → Return Translation
```

### Translation Providers

1. **MyMemory API** (Primary - Free)
   - No API key needed
   - Good quality
   - Rate limits apply

2. **Google Translate** (Fallback - Optional)
   - Requires `googletrans` package
   - Better quality
   - Install: `pip install googletrans==3.1.0a0`

3. **Static Dictionary** (Final Fallback)
   - Offline support
   - Common agricultural terms
   - Always available

## 📊 Features

✅ **Multi-language Support**: en, hi, mr
✅ **Automatic Caching**: Fast repeated translations
✅ **Batch Translation**: Translate multiple texts at once
✅ **Auto-fallback**: Works even if API is down
✅ **CORS Enabled**: Works from any frontend
✅ **Smart Caching**: Reduces API calls
✅ **Free to Use**: No API key needed (MyMemory)

## 🌍 Language Codes

| Language | Code | Example |
|----------|------|---------|
| English | `en` | Hello |
| Hindi | `hi` | नमस्ते |
| Marathi | `mr` | नमस्कार |

## 🔧 Configuration

### Change Port
Edit `translation_api.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
#                              ↑ change this
```

### Add More Languages
Edit `translation_api.py`:
```python
self.languages = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi',
    'te': 'Telugu',  # Add new languages
    'ta': 'Tamil'
}
```

### Enable Google Translate
```bash
pip install googletrans==3.1.0a0
```

The API will automatically use it as fallback.

## 📱 Usage Examples

### Website Button
```html
<button onclick="translatePage('hi')">हिंदी</button>
<button onclick="translatePage('mr')">मराठी</button>

<script>
async function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    const texts = {};
    
    elements.forEach(el => {
        texts[el.getAttribute('data-translate')] = el.textContent;
    });
    
    const results = await translationAPI.translateBatch(
        texts, 'en', lang
    );
    
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        el.textContent = results[key];
    });
}
</script>
```

### Form Translation
```javascript
// Translate form labels
const form = {
    name: "Name",
    email: "Email",
    phone: "Phone Number"
};

const hindiForm = await translationAPI.translateBatch(form, 'en', 'hi');
// { name: "नाम", email: "ईमेल", phone: "फोन नंबर" }
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr :5001
taskkill /PID <process_id> /F
```

### CORS Errors
- Ensure API server is running
- Check `flask-cors` is installed
- Verify URL is `http://localhost:5001`

### Translation Not Working
1. Check API health: `http://localhost:5001/api/health`
2. Check console for errors
3. System will auto-fallback to static translations

### Slow Translations
- First request is slower (API call)
- Subsequent requests are cached (fast!)
- Use batch endpoint for multiple texts

## 🎯 Best Practices

1. **Use Batch Translation** for multiple texts
2. **Cache aggressively** - API caches automatically
3. **Provide fallback** - Static translations as backup
4. **Test both modes** - With and without API
5. **Monitor cache** - Use `/api/translate/cache/stats`

## 📈 Performance

| Operation | Speed | Notes |
|-----------|-------|-------|
| Cache Hit | <1ms | Instant |
| API Call | 200-500ms | First time |
| Batch (10 items) | 1-2s | Faster than individual |
| Static Fallback | <1ms | Always available |

## 🔒 Security

- API has CORS enabled
- No authentication (local use)
- No sensitive data stored
- Translations are cached locally

## 📞 Support

### Check Status
```bash
curl http://localhost:5001/api/health
```

### Test Translation
```bash
curl -X POST http://localhost:5001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","source":"en","target":"hi"}'
```

### Clear Cache
```bash
curl -X POST http://localhost:5001/api/translate/cache/clear
```

---

## Summary

**Without API**: Uses static translations (works offline)
**With API**: Real-time translation with caching (better quality)

**To Start**: Just double-click `start_translation_api.bat`

The system works perfectly in both modes! 🌾🌐
