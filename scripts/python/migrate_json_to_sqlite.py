import os
import sys
import json
from datetime import datetime

# Adjust module path to import backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

from backend.database import init_db, CropPrice, MarketPrice, get_connection

def migrate():
    # Initialize the database
    init_db()
    print("Database initialized.")

    # Paths to JSON files (check both possible locations)
    json_path_data = os.path.join(BASE_DIR, 'data', 'json', 'prices.json')
    json_path_backend = os.path.join(BASE_DIR, 'backend', 'prices.json')

    source_file = None
    if os.path.exists(json_path_backend):
        source_file = json_path_backend
    elif os.path.exists(json_path_data):
        source_file = json_path_data

    if not source_file:
        print("Error: Could not find prices.json in 'data/json/' or 'backend/'.")
        return

    print(f"Reading data from: {source_file}")
    with open(source_file, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error reading JSON: {e}")
            return

    # Extract top-level metadata if they exist
    last_updated = data.get('lastUpdated', datetime.now().isoformat())
    global_source = data.get('source', 'Unknown')
    
    crops_migrated = 0
    markets_migrated = 0

    # Iterate through keys, avoiding known top-level metadata keys
    skip_keys = {'lastUpdated', 'source', 'api_version', 'timestamp'}
    
    # Clean the old data first to avoid inserting duplicates if running multiple times
    conn = get_connection()
    conn.execute("DELETE FROM market_prices")
    conn.execute("DELETE FROM crop_prices")
    conn.commit()
    conn.close()

    for key, value in data.items():
        if key in skip_keys or not isinstance(value, dict):
            continue
            
        crop_name = key
        crop_data = value
        
        # Get historical data
        hist_labels = crop_data.get('labels', [])
        hist_data = crop_data.get('data', [])
        current_price = hist_data[-1] if hist_data else 0.0
        
        # Create CropPrice model
        crop_model = CropPrice(
            crop_name=crop_name,
            state=crop_data.get('state', 'Maharashtra'),
            unit=crop_data.get('unit', '₹/quintal'),
            current_price=current_price,
            source=crop_data.get('source', global_source),
            color=crop_data.get('color', '#000000'),
            last_updated=last_updated,
            historical_labels=hist_labels,
            historical_data=hist_data
        )
        
        # Save Crop and get its ID
        crop_id = CropPrice.save(crop_model)
        crops_migrated += 1
        
        # Migrate markets for this crop
        markets = crop_data.get('markets', [])
        for market in markets:
            MarketPrice.save(
                crop_id=crop_id,
                market_name=market.get('name', 'Unknown'),
                district=market.get('district', 'Unknown'),
                price=market.get('price', 0.0)
            )
            markets_migrated += 1

    print(f"Migration completed successfully!")
    print(f"- Crops migrated: {crops_migrated}")
    print(f"- Market prices migrated: {markets_migrated}")
    print(f"Data saved to data/farm_database.db")

if __name__ == '__main__':
    migrate()
