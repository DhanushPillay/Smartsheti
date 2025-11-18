#!/usr/bin/env python3
"""
SmartSheti Backend API
Simple Flask server to provide price chart data via HTTP API
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for browser requests

@app.route('/api/price-data', methods=['GET'])
def get_price_data():
    """API endpoint to get price chart data"""
    try:
        # Get parameters from query string
        crop = request.args.get('crop', 'wheat')
        state = request.args.get('state', 'Maharashtra')
        market = request.args.get('market', 'Pune APMC')
        
        print(f"📡 API request: {crop} in {state}, {market}")
        
        # Call the Python script
        script_path = os.path.join(os.path.dirname(__file__), 'price_chart_generator.py')
        python_exe = 'C:/Python313/python.exe'
        
        result = subprocess.run(
            [python_exe, script_path, crop, state, market],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # Parse the JSON output
            data = json.loads(result.stdout)
            print(f"✅ Successfully generated data for {crop}")
            return jsonify(data)
        else:
            print(f"❌ Script error: {result.stderr}")
            return jsonify({
                'success': False,
                'error': 'Failed to generate price data',
                'details': result.stderr
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Request timeout'
        }), 504
        
    except json.JSONDecodeError as e:
        return jsonify({
            'success': False,
            'error': 'Invalid JSON response from script',
            'details': str(e)
        }), 500
        
    except Exception as e:
        print(f"❌ API error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'message': 'SmartSheti Backend API is running'
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API info"""
    return jsonify({
        'service': 'SmartSheti Backend API',
        'version': '1.0.0',
        'endpoints': {
            '/api/price-data': 'GET - Fetch price chart data (params: crop, state, market)',
            '/api/health': 'GET - Health check'
        },
        'example': '/api/price-data?crop=wheat&state=Maharashtra&market=Pune%20APMC'
    })

if __name__ == '__main__':
    print("🚀 Starting SmartSheti Backend API...")
    print("📡 Available at: http://localhost:5000")
    print("🌾 Price data endpoint: http://localhost:5000/api/price-data")
    print("❤️ Health check: http://localhost:5000/api/health")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )
