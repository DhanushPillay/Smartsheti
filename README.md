# 🌾 SmartSheti - Smart Farming Assistant

**SmartSheti** is an intelligent agricultural platform designed to empower farmers in Maharashtra. It provides accurate crop suggestions, real-time weather updates, and market price insights—all in **English, Hindi, and Marathi**.

> **🌐 Live Demo:** [https://smartsheti-rho.vercel.app](https://smartsheti-rho.vercel.app)

---

## ✨ Features at a Glance

### 🌱 Smart Crop Suggestions
- **Personalized Advice**: Tells you the best crops to grow based on your **Soil Type**, **Location**, and **Water Availability**.
- **Profitability**: Shows potential profit for each crop based on current market rates.
- **Scientific**: Uses data-driven algorithms to match crops to your specific farm conditions.

### 🌤️ Weather & Pest Alerts
- **Live Weather**: Get accurate temperature, humidity, and rainfall data for your village.
- **Pest Warnings**: Predicts possible pest attacks (like Bollworm or Aphids) based on the weather.
- **Farming Advice**: Gives you tips on when to water your crops or apply fertilizers.

### 💰 Market Prices (Mandi Rates)
- **Real-Time Prices**: Check daily rates for Wheat, Cotton, Rice, Onions, and more.
- **Price Trends**: See if prices are going up 📈 or down 📉 over the last 8 weeks.
- **Compare Markets**: Compare rates between major markets like Mumbai, Pune, and Nashik APMC.

### 📱 Downloadable App (PWA)
- **Install App**: You can install SmartSheti on your phone just like a regular app.
- **Works Offline**: Essential features load quickly even with slow internet.
- **No Play Store Needed**: Download directly from the website!

---

## 🚀 How to Use

1. **Choose Language**: Click the "Identify Language" button (🌐) at the top to switch between English, Hindi, or Marathi.
2. **Get Suggestions**: Go to **"Crop Suggestion"**, enter your details (Soil, Location), and click "Get Suggestions".
3. **Check Weather**: Go to **"Weather"** and search for your village to see the forecast.
4. **Check Prices**: Go to **"Market Demand"** to see the latest crop rates in different markets.

---

## 🛠️ For Developers: Installation Guide

Want to run this project on your own computer? Follow these steps:

### Prerequisites
- **Python** (3.8 or newer)
- **Git** (to clone the project)

### Step 1: Download the Code
```bash
git clone https://github.com/DhanushPillay/Smartsheti.git
cd farmer
```

### Step 2: Set Up Backend (Python)
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Run the Server
You can run the simple price API to see data locally:
```bash
python api/simple_price_api.py
```
*The server will start at `http://localhost:5000`*

### Step 4: Open the Frontend
- Go back to the main `farmer` folder.
- Double-click `index.html` to open it in your browser.
- Or use a local server:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080`

---

## 📂 Project Structure

- `frontend/`: Contains all the visible parts (HTML, CSS, JavaScript).
    - `html/`: Pages like Weather, Crop Suggestion, etc.
    - `js/`: Logic for calculations, translations, and data fetching.
- `backend/`: The brain of the application (Python).
    - `api/`: Servers that provide data to the frontend.
    - `python/`: Scripts that scrape data from government websites.
    - `prices.json`: A file storing the latest market prices.

---

## 🔗 Data Sources
We use trusted sources for our data:
- **Weather**: OpenWeatherMap API
- **Market Prices**: AgMarkNet (Government of India) & data.gov.in
- **Translations**: MyMemory API & Custom Dictionary

---

## 👥 Team
**Developed by:** Dhanush Pillay & Shubhangini Dixit
**Institution:** MIT-ADT University (Project Based Learning)

---

> _**Disclaimer:** Market prices and crop suggestions are estimates based on available data. Please verify with local experts before making large financial decisions._
