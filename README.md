Here’s your **enhanced and production-ready `README.md`** with:

* ✅ Clear structure
* 🔐 Updated API key handling instructions
* 📷 Screenshot support placeholder
* 🧠 Slight grammar and flow improvements
* 🔗 Better link presentation
* ✅ Matches your `.gitignore` and config.js setup

---

````markdown
<details open>
  <summary>📑 Table of Contents</summary>

1. [About the Project](#weather-dashboard)
   - [Features](#-features)
   - [Project Access](#-project-overview)
   - [Installation](#-installation)

2. [Technical Details](#-technical-specifications)
   - [Technologies Used](#-frontend-technologies)
   - [API Configuration](#-api-configuration)

3. [UI/UX & Weather Data](#-uiux-specifications)

4. [Security & Optimization](#-security-considerations)

5. [Future Improvements](#-future-enhancements)

6. [Author & License](#-author)

</details>

---

# ⛅️ Weather Dashboard

## 📅 Project Overview

A sleek, responsive weather dashboard app that displays current, historical, and forecast data using [WeatherAPI.com](https://www.weatherapi.com/docs/). It offers dynamic weather icons, responsive design, geolocation support, and more.

---

## ✨ Features

- 🔍 City-based weather search
- 📍 Auto-detect user's geolocation
- 📆 Past 7 days historical weather
- 📈 Next 7 days forecast
- 🌗 Day/Night themed icons
- 🎨 Dynamic weather visuals
- 📱 Fully responsive design
- 🎯 Color-coded indicators
- 💾 Local storage search history

---

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
````

2. **Create a `.env` file in root folder:**

```env
VITE_API_KEY=your_actual_weather_api_key_here
```

3. **In your `config.js`:**

```javascript
export const API_KEY = import.meta.env.VITE_API_KEY;
```

4. **Start your app:**

* If using Vite:

```bash
npm install
npm run dev
```

* Or simply open `index.html` directly (if not using a bundler).

---

## 🔐 API Configuration

**WeatherAPI Endpoints Used:**

| Type      | Endpoint                                      |
| --------- | --------------------------------------------- |
| Current   | `https://api.weatherapi.com/v1/current.json`  |
| History   | `https://api.weatherapi.com/v1/history.json`  |
| Forecast  | `https://api.weatherapi.com/v1/forecast.json` |
| Geocoding | `https://api.weatherapi.com/v1/search.json`   |

> Required Params: `key`, `q`, `dt`, `days`

---

## 💻 Frontend Technologies

* HTML5
* CSS3
* JavaScript (ES6+)
* Font Awesome 6.0.0

---

## 🖼️ Screenshots

| Home                          | Historical                          | Forecast                              |
| ----------------------------- | ----------------------------------- | ------------------------------------- |
| ![Home](screenshots/home.png) | ![History](screenshots/history.png) | ![Forecast](screenshots/forecast.png) |

> 📁 Place your screenshots inside `/screenshots` and update filenames accordingly.

---

## 🌐 Browser Compatibility

* ✅ Chrome
* ✅ Firefox
* ✅ Safari
* ✅ Edge
* ✅ Opera

---

## 📱 Responsive Design

| Device  | Width          |
| ------- | -------------- |
| Mobile  | < 768px        |
| Tablet  | 768px - 1024px |
| Desktop | > 1024px       |

---

## 📊 Weather Data Displayed

### 🟡 Current

* Location, Date/Time
* Temperature (°C)
* Feels like (°C)
* Wind speed (km/h)
* Humidity %
* Weather condition + icon

### 🟠 Historical Cards

* Avg Temp, Wind, Humidity
* Daily condition summary

### 🔵 Forecast Cards

* High/Low Temp
* Wind forecast
* Humidity forecast

---

## 🎨 UI/UX Specifications

### 🧱 Card Layout

* 250x300px min size
* Rounded corners, light shadows
* Semi-transparent background

### 🖋️ Fonts & Colors

* **Font:** Segoe UI
* **Colors:**

  * Primary: `#4a90e2`
  * Background Gradient: `#6ea5e3 → #a1c4fd`
  * Card: `rgba(255,255,255,0.95)`
  * Text: `#2c3e50`

---

## ⚡️ Performance Optimization

* Async API calls
* Efficient DOM rendering
* Lazy loading modals
* Error handling for fetch failures

---

## 🔐 Security Considerations

* `.env` used for API key
* `config.js` is `.gitignore`d
* No personal data stored
* HTTPS recommended
* Rate limiting awareness

---

## 🛠️ Future Enhancements

* 🌡️ Celsius ↔ Fahrenheit toggle
* 📌 Save favorite cities
* 🔔 Weather alerts & warnings
* ⏱️ Hourly forecasts
* 🗺️ Map view for weather
* 🌙 Dark mode
* 🌍 Multilingual support
* 📴 Offline support (PWA)

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full terms.

---

## 👤 Author

**Jayesh Afre**

📫 Connect with me:

* GitHub: [@jayeshafre](https://github.com/jayeshafre)
* Email: [jayeshafre@gmail.com](mailto:jayeshafre@gmail.com) *(replace if needed)*

---

## 🧠 Special Thanks

* [WeatherAPI.com](https://www.weatherapi.com/docs/) for free & robust API
* You for checking this project out 💙


