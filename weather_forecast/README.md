<details open>
  <summary>Table of Contents</summary>

1. [About the Project](#about-the-project)
   - [Description](#description)
   - [Features](#features)
   - [Project Access](#project-access)
   - [Installation](#installation)

4. [Skills](#skills)

5. [Author / Contributors](#author--contributors)
   - [Contact](#contact)

6. [License](#license)
   - [About the License](#about-the-license)
</details>

# Weather Dashboard

## Project Overview
A modern, responsive weather dashboard application that provides current weather conditions, historical weather data, and weather forecasts. The application features an intuitive user interface with dynamic weather icons and detailed weather information.

## Features
- Current weather display
- Past 7 days weather history
- Next 7 days weather forecast
- Geolocation support
- City-based weather search
- Dynamic weather icons based on conditions
- Responsive design for all devices
- Color-coded weather indicators
- Day/Night mode for weather icons

## Technical Specifications

### Frontend Technologies
- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome 6.0.0 (Icons)

### API Integration
- WeatherAPI.com
  - Current Weather API
  - Historical Weather API
  - Forecast API
  - Search/Geocoding API

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

### Responsive Design Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## System Requirements

### Minimum Requirements
- Modern web browser with JavaScript enabled
- Internet connection
- Screen resolution: 320px minimum width
- WeatherAPI.com API key

### Recommended Requirements
- High-speed internet connection
- Screen resolution: 1024px or higher
- Modern browser with CSS Grid support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-dashboard.git
```

2. Navigate to the project directory:
```bash
cd weather-dashboard
```

3. Open `script.js` and replace the API key:
```javascript
const API_KEY = 'YOUR_API_KEY'; // Replace with your WeatherAPI.com key
```

4. Open `index.html` in a web browser or serve using a local server.

## API Configuration

### Required API Endpoints
1. Current Weather:
   - Endpoint: `https://api.weatherapi.com/v1/current.json`
   - Parameters: `key`, `q`

2. Historical Weather:
   - Endpoint: `https://api.weatherapi.com/v1/history.json`
   - Parameters: `key`, `q`, `dt`

3. Forecast Weather:
   - Endpoint: `https://api.weatherapi.com/v1/forecast.json`
   - Parameters: `key`, `q`, `days`

## Weather Data Specifications

### Current Weather Display
- City name and country
- Current date and time
- Temperature in Celsius
- Weather condition with icon
- Wind speed (km/h)
- Humidity percentage
- "Feels like" temperature

### Historical Weather Cards
- Date
- Average temperature
- Weather condition with icon
- Maximum wind speed
- Average humidity
- Daily weather summary

### Forecast Weather Cards
- Date
- Predicted temperature
- Weather condition with icon
- Wind speed forecast
- Humidity forecast
- High/Low temperature

## Dynamic Weather Icons

### Condition-based Icons
- Rain: Cloud with raindrops (blue)
- Thunder: Lightning bolt (yellow)
- Snow: Snowflake (white)
- Cloudy: Cloud (grey)
- Clear/Sunny: Sun/Moon (yellow)
- Partly Cloudy: Sun/Moon with cloud
- Fog/Mist: Smog icon (grey)

### Temperature Icons
- ≥30°C: Red high temperature
- ≥20°C: Yellow high temperature
- ≥10°C: Blue medium temperature
- <10°C: Dark blue low temperature

### Humidity Icons
- ≥80%: Dark blue droplet
- ≥60%: Medium blue droplet
- ≥40%: Light blue droplet
- <40%: Grey slashed droplet

### Wind Icons
- ≥50 km/h: Red wind
- ≥30 km/h: Yellow wind
- <30 km/h: Blue wind

## UI/UX Specifications

### Card Layout
- Minimum width: 250px
- Minimum height: 300px
- Padding: 1.8rem
- Border radius: 15px
- Background: Semi-transparent white
- Shadow effect on hover

### Typography
- Primary font: Segoe UI
- Fallback fonts: Tahoma, Geneva, Verdana, sans-serif
- Heading sizes: 1.3rem - 2.5rem
- Body text: 0.9rem - 1.1rem

### Color Scheme
- Primary: #4a90e2 (Blue)
- Secondary: #f5f6fa (Light Grey)
- Text: #2c3e50 (Dark Blue)
- Background: Linear gradient (#6ea5e3 to #a1c4fd)
- Card Background: rgba(255, 255, 255, 0.95)

## Performance Optimization

### Loading Optimization
- Asynchronous API calls
- Font Awesome CDN integration
- Minimal CSS animations
- Efficient DOM manipulation

### Error Handling
- API error detection and user notification
- Geolocation error handling
- Data validation
- Fallback displays for missing data

## Security Considerations

### API Key Protection
- API key should be stored securely
- Server-side proxy recommended for production
- Rate limiting consideration

### Data Privacy
- Geolocation permission handling
- No personal data storage
- HTTPS recommended for deployment

## Future Enhancements
1. Temperature unit toggle (Celsius/Fahrenheit)
2. Multiple location saving
3. Weather alerts and notifications
4. Detailed hourly forecasts
5. Weather maps integration
6. Offline support with PWA
7. Dark mode theme
8. Multiple language support

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For API support, visit [WeatherAPI.com](https://www.weatherapi.com/docs/)

## Author
[Your Name]
[Your Contact Information]