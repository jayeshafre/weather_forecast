import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
import os
import requests
from datetime import datetime, timedelta

class WeatherML:
    def __init__(self):
        self.scaler = StandardScaler()
        self.temp_model = None
        self.pattern_model = None
        self.anomaly_detector = None
        self.history_data = []
        
    def prepare_data(self, weather_data):
        """Convert weather data into features for ML models"""
        features = []
        for entry in weather_data:
            hour = entry.get('time', '').hour
            temp = entry.get('temp_c', 0)
            humidity = entry.get('humidity', 0)
            wind_speed = entry.get('wind_kph', 0)
            pressure = entry.get('pressure_mb', 0)
            
            features.append([
                hour,
                temp,
                humidity,
                wind_speed,
                pressure,
                np.sin(2 * np.pi * hour / 24),  # Time of day cyclical feature
                np.cos(2 * np.pi * hour / 24)
            ])
        
        return np.array(features)

    def train_temperature_model(self, weather_data):
        """Train Random Forest model for temperature prediction"""
        features = self.prepare_data(weather_data)
        targets = np.array([entry.get('temp_c', 0) for entry in weather_data])
        
        X_train, X_test, y_train, y_test = train_test_split(
            features, targets, test_size=0.2, random_state=42
        )
        
        self.temp_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.temp_model.fit(X_train, y_train)
        
        # Save the model
        joblib.dump(self.temp_model, 'temp_model.joblib')
        return self.temp_model.score(X_test, y_test)

    def train_pattern_model(self, weather_data):
        """Train LSTM model for weather pattern prediction"""
        features = self.prepare_data(weather_data)
        sequence_length = 24  # 24 hours of data
        
        # Prepare sequences
        X, y = [], []
        for i in range(len(features) - sequence_length):
            X.append(features[i:i + sequence_length])
            y.append(features[i + sequence_length, 1])  # Predict temperature
        
        X = np.array(X)
        y = np.array(y)
        
        # Create and train LSTM model
        self.pattern_model = Sequential([
            LSTM(50, input_shape=(sequence_length, features.shape[1])),
            Dropout(0.2),
            Dense(1)
        ])
        
        self.pattern_model.compile(optimizer='adam', loss='mse')
        self.pattern_model.fit(X, y, epochs=50, batch_size=32, verbose=0)
        
        # Save the model
        self.pattern_model.save('pattern_model.h5')

    def train_anomaly_detector(self, weather_data):
        """Train anomaly detection model"""
        features = self.prepare_data(weather_data)
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.anomaly_detector.fit(features)
        
        # Save the model
        joblib.dump(self.anomaly_detector, 'anomaly_detector.joblib')

    def predict_temperature(self, current_conditions):
        """Predict temperature for next 24 hours"""
        if not self.temp_model:
            return None
            
        features = self.prepare_data([current_conditions])
        predictions = []
        
        for hour in range(24):
            feature = features[0].copy()
            feature[0] = hour
            feature[5] = np.sin(2 * np.pi * hour / 24)
            feature[6] = np.cos(2 * np.pi * hour / 24)
            pred = self.temp_model.predict([feature])[0]
            predictions.append({
                'hour': hour,
                'temperature': round(pred, 2)
            })
            
        return predictions

    def detect_weather_anomalies(self, weather_data):
        """Detect unusual weather patterns"""
        if not self.anomaly_detector:
            return None
            
        features = self.prepare_data(weather_data)
        anomalies = self.anomaly_detector.predict(features)
        
        anomaly_data = []
        for i, is_anomaly in enumerate(anomalies):
            if is_anomaly == -1:  # Anomaly detected
                anomaly_data.append({
                    'timestamp': weather_data[i].get('time', ''),
                    'temperature': weather_data[i].get('temp_c', 0),
                    'description': 'Unusual weather pattern detected'
                })
                
        return anomaly_data

    def analyze_weather_patterns(self, weather_data):
        """Analyze weather patterns and provide insights"""
        temps = [entry.get('temp_c', 0) for entry in weather_data]
        humidity = [entry.get('humidity', 0) for entry in weather_data]
        
        analysis = {
            'avg_temp': round(np.mean(temps), 2),
            'temp_variance': round(np.var(temps), 2),
            'temp_trend': 'increasing' if np.polyfit(range(len(temps)), temps, 1)[0] > 0 else 'decreasing',
            'humidity_correlation': round(np.corrcoef(temps, humidity)[0, 1], 2)
        }
        
        # Add pattern classification
        if analysis['temp_variance'] > 20:
            analysis['pattern'] = 'Highly variable'
        elif analysis['temp_variance'] > 10:
            analysis['pattern'] = 'Moderately variable'
        else:
            analysis['pattern'] = 'Stable'
            
        return analysis

    def get_weather_recommendation(self, current_weather, forecast):
        """Generate weather recommendations based on ML insights"""
        temp = current_weather.get('temp_c', 0)
        humidity = current_weather.get('humidity', 0)
        wind_speed = current_weather.get('wind_kph', 0)
        
        recommendations = []
        
        # Temperature-based recommendations
        if temp > 30:
            recommendations.append("High temperature alert: Stay hydrated and avoid prolonged sun exposure")
        elif temp < 10:
            recommendations.append("Cold weather alert: Bundle up and stay warm")
            
        # Humidity-based recommendations
        if humidity > 80:
            recommendations.append("High humidity: Air quality might be affected")
        elif humidity < 30:
            recommendations.append("Low humidity: Consider using a humidifier")
            
        # Wind-based recommendations
        if wind_speed > 40:
            recommendations.append("Strong winds: Take precautions with outdoor activities")
            
        # Forecast-based recommendations
        if forecast:
            temp_changes = [abs(f['temperature'] - temp) for f in forecast[:6]]
            if max(temp_changes) > 10:
                recommendations.append("Significant temperature changes expected: Plan accordingly")
                
        return recommendations 