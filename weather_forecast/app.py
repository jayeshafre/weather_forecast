from flask import Flask, request, jsonify
from weather_ml import WeatherML
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
weather_ml = WeatherML()

# WeatherAPI.com configuration
API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = 'https://api.weatherapi.com/v1'

@app.route('/api/weather/ml', methods=['POST'])
def get_ml_weather():
    data = request.json
    location = data.get('location')
    
    if not location:
        return jsonify({'error': 'Location is required'}), 400
        
    try:
        # Fetch current weather and historical data
        current_weather = fetch_current_weather(location)
        historical_data = fetch_historical_data(location)
        
        # Train models if enough data is available
        if len(historical_data) >= 24:
            weather_ml.train_temperature_model(historical_data)
            weather_ml.train_pattern_model(historical_data)
            weather_ml.train_anomaly_detector(historical_data)
        
        # Generate ML predictions and insights
        predictions = weather_ml.predict_temperature(current_weather)
        anomalies = weather_ml.detect_weather_anomalies(historical_data)
        pattern_analysis = weather_ml.analyze_weather_patterns(historical_data)
        recommendations = weather_ml.get_weather_recommendation(current_weather, predictions)
        
        return jsonify({
            'current_weather': current_weather,
            'predictions': predictions,
            'anomalies': anomalies,
            'pattern_analysis': pattern_analysis,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def fetch_current_weather(location):
    """Fetch current weather data from WeatherAPI.com"""
    response = requests.get(
        f"{BASE_URL}/current.json",
        params={
            'key': API_KEY,
            'q': location
        }
    )
    response.raise_for_status()
    data = response.json()
    return data['current']

def fetch_historical_data(location):
    """Fetch historical weather data for the past 7 days"""
    historical_data = []
    today = datetime.now()
    
    for i in range(7):
        date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
        response = requests.get(
            f"{BASE_URL}/history.json",
            params={
                'key': API_KEY,
                'q': location,
                'dt': date
            }
        )
        
        if response.ok:
            data = response.json()
            historical_data.extend(data['forecast']['forecastday'][0]['hour'])
            
    return historical_data

if __name__ == '__main__':
    app.run(debug=True, port=5000) 