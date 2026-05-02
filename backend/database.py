import sqlite3
import os
import json
from datetime import datetime

# Path to the SQLite database
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DB_PATH = os.path.join(DATA_DIR, 'farm_database.db')

def get_connection():
    """Returns a connection to the SQLite database."""
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create valid tables matching our models
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS crop_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT NOT NULL UNIQUE,
            state TEXT,
            unit TEXT,
            current_price REAL,
            source TEXT,
            color TEXT,
            last_updated TEXT,
            historical_labels TEXT, -- stored as JSON string
            historical_data TEXT    -- stored as JSON string
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_id INTEGER NOT NULL,
            market_name TEXT NOT NULL,
            district TEXT,
            price REAL,
            FOREIGN KEY (crop_id) REFERENCES crop_prices(id) ON DELETE CASCADE
        )
    ''')

    conn.commit()
    conn.close()

class CropPrice:
    """A model-like wrapper for the crop_prices table."""
    def __init__(self, crop_name, state, unit, current_price, source, color, last_updated, historical_labels, historical_data, id=None):
        self.id = id
        self.crop_name = crop_name
        self.state = state
        self.unit = unit
        self.current_price = current_price
        self.source = source
        self.color = color
        self.last_updated = last_updated
        self.historical_labels = historical_labels
        self.historical_data = historical_data

    @classmethod
    def save(cls, crop):
        conn = get_connection()
        cursor = conn.cursor()
        
        labels_json = json.dumps(crop.historical_labels) if crop.historical_labels else '[]'
        data_json = json.dumps(crop.historical_data) if crop.historical_data else '[]'
        
        cursor.execute('''
            INSERT OR REPLACE INTO crop_prices 
            (crop_name, state, unit, current_price, source, color, last_updated, historical_labels, historical_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            crop.crop_name, crop.state, crop.unit, crop.current_price, 
            crop.source, crop.color, crop.last_updated, labels_json, data_json
        ))
        
        crop.id = cursor.lastrowid
        conn.commit()
        conn.close()
        return crop.id

class MarketPrice:
    """A model-like wrapper for the market_prices table."""
    @staticmethod
    def save(crop_id, market_name, district, price):
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO market_prices (crop_id, market_name, district, price)
            VALUES (?, ?, ?, ?)
        ''', (crop_id, market_name, district, price))
        
        record_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return record_id

if __name__ == '__main__':
    # Initializing DB when running directly
    init_db()
    print(f"Database initialized at {DB_PATH}")
