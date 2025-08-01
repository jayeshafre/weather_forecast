// API configuration
const API_KEY = 'a82589532cb54e9eb5d93113251406'; // WeatherAPI.com key
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM elements
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const currentLocationButton = document.getElementById('currentLocation');
const currentWeather = document.getElementById('currentWeather');
const weatherHistory = document.getElementById('weatherHistory');
const weatherForecast = document.getElementById('weatherForecast');
const historyButton = document.getElementById('historyButton');
const historyModal = document.getElementById('historyModal');
const closeModalButton = document.querySelector('.close-modal');
const searchHistoryList = document.getElementById('searchHistoryList');
const hourlyModal = document.getElementById('hourlyModal');
const closeHourlyModal = document.getElementById('closeHourlyModal');
const hourlyModalTitle = document.getElementById('hourlyModalTitle');

// Chart instance
let hourlyChart = null;

// Initialize search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Weather icon mapping
function getCustomWeatherIcon(condition, isDay = 1) {
    const text = condition.toLowerCase();
    
    // Rain conditions
    if (text.includes('rain') || text.includes('drizzle')) {
        return '<i class="fas fa-cloud-rain fa-2x" style="color: #4a90e2;"></i>';
    }
    // Thunder conditions
    if (text.includes('thunder') || text.includes('storm')) {
        return '<i class="fas fa-bolt fa-2x" style="color: #f1c40f;"></i>';
    }
    // Snow conditions
    if (text.includes('snow') || text.includes('blizzard')) {
        return '<i class="fas fa-snowflake fa-2x" style="color: #white;"></i>';
    }
    // Cloudy conditions
    if (text.includes('cloud') || text.includes('overcast')) {
        return '<i class="fas fa-cloud fa-2x" style="color: #95a5a6;"></i>';
    }
    // Fog or mist
    if (text.includes('fog') || text.includes('mist')) {
        return '<i class="fas fa-smog fa-2x" style="color: #bdc3c7;"></i>';
    }
    // Clear conditions
    if (text.includes('clear') || text.includes('sunny')) {
        return isDay 
            ? '<i class="fas fa-sun fa-2x" style="color: #f1c40f;"></i>'
            : '<i class="fas fa-moon fa-2x" style="color: #f1c40f;"></i>';
    }
    // Partly cloudy
    if (text.includes('partly')) {
        return isDay
            ? '<i class="fas fa-cloud-sun fa-2x" style="color: #f1c40f;"></i>'
            : '<i class="fas fa-cloud-moon fa-2x" style="color: #f1c40f;"></i>';
    }
    // Default icon
    return '<i class="fas fa-cloud fa-2x" style="color: #95a5a6;"></i>';
}

// Get temperature icon based on temperature value
function getTemperatureIcon(temp) {
    if (temp >= 30) {
        return '<i class="fas fa-temperature-high fa-lg" style="color: #e74c3c;"></i>';
    } else if (temp >= 20) {
        return '<i class="fas fa-temperature-high fa-lg" style="color: #f1c40f;"></i>';
    } else if (temp >= 10) {
        return '<i class="fas fa-temperature-half fa-lg" style="color: #3498db;"></i>';
    } else {
        return '<i class="fas fa-temperature-low fa-lg" style="color: #2980b9;"></i>';
    }
}

// Get humidity icon based on humidity value
function getHumidityIcon(humidity) {
    if (humidity >= 80) {
        return '<i class="fas fa-droplet fa-lg" style="color: #3498db;"></i>';
    } else if (humidity >= 60) {
        return '<i class="fas fa-droplet fa-lg" style="color: #85c1e9;"></i>';
    } else if (humidity >= 40) {
        return '<i class="fas fa-droplet fa-lg" style="color: #aed6f1;"></i>';
    } else {
        return '<i class="fas fa-droplet-slash fa-lg" style="color: #95a5a6;"></i>';
    }
}

// Get wind icon based on speed
function getWindIcon(speed) {
    if (speed >= 50) {
        return '<i class="fas fa-wind fa-lg" style="color: #e74c3c;"></i>';
    } else if (speed >= 30) {
        return '<i class="fas fa-wind fa-lg" style="color: #f1c40f;"></i>';
    } else {
        return '<i class="fas fa-wind fa-lg" style="color: #3498db;"></i>';
    }
}

// Event listeners
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeatherData(location);
    } else {
        alert('Please enter a location.');
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherData(location);
        }
    }
});

currentLocationButton.addEventListener('click', getCurrentLocation);

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        currentLocationButton.disabled = true;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = `${latitude},${longitude}`;
                getWeatherData(location);
                currentLocationButton.disabled = false;
            },
            (error) => {
                alert('Error getting location: ' + error.message);
                currentLocationButton.disabled = false;
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Get weather data by location
async function getWeatherData(location) {
    try {
        const [currentData, historyData, forecastData] = await Promise.all([
            fetchCurrentWeather(location),
            fetchHistoricalWeather(location),
            fetchForecastWeather(location)
        ]);

        updateCurrentWeather(currentData);
        updateWeatherHistory(historyData);
        updateWeatherForecast(forecastData);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Fetch current weather
async function fetchCurrentWeather(location) {
    const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch current weather data');
    }
    return response.json();
}

// Fetch historical weather
async function fetchHistoricalWeather(location) {
    const today = new Date();
    const pastDates = [];
    for (let i = 1; i <= 7; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);
        pastDates.push(pastDate.toISOString().split('T')[0]);
    }

    const historicalData = [];
    for (const date of pastDates) {
        const response = await fetch(
            `${BASE_URL}/history.json?key=${API_KEY}&q=${encodeURIComponent(location)}&dt=${date}`
        );
        if (response.ok) {
            const data = await response.json();
            historicalData.push(data);
        }
    }
    return historicalData;
}

// Fetch forecast weather
async function fetchForecastWeather(location) {
    const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch forecast weather data');
    }
    return response.json();
}

// Event listeners for search history
historyButton.addEventListener('click', () => {
    displaySearchHistory();
    historyModal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Function to save search to history
function saveToHistory(location, temperature, condition) {
    const searchItem = {
        location: location,
        temperature: temperature,
        condition: condition,
        timestamp: new Date().toISOString()
    };

    // Add new search to beginning of array
    searchHistory.unshift(searchItem);

    // Keep only last 10 searches
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }

    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
}

// Function to display search history
function displaySearchHistory() {
    searchHistoryList.innerHTML = '';
    
    searchHistory.forEach((item) => {
        const date = new Date(item.timestamp);
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-item-info">
                <div>
                    <div class="history-item-city">${item.location}</div>
                    <div class="history-item-date">${formatDate(date)}</div>
                </div>
                <div class="history-item-temp">${Math.round(item.temperature)}°C</div>
                ${getCustomWeatherIcon(item.condition)}
            </div>
        `;
        
        historyItem.addEventListener('click', () => {
            getWeatherData(item.location);
            historyModal.style.display = 'none';
        });
        
        searchHistoryList.appendChild(historyItem);
    });
}

// Update current weather UI with history saving
function updateCurrentWeather(data) {
    const date = new Date();
    const isDay = data.current.is_day;
    
    // Save to search history
    saveToHistory(
        `${data.location.name}, ${data.location.country}`,
        data.current.temp_c,
        data.current.condition.text
    );
    
    currentWeather.querySelector('.main-card').innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${data.location.name}, ${data.location.country}</h2>
            <p class="date">${formatDate(date)}</p>
            <div class="temperature">
                <span class="temp">${Math.round(data.current.temp_c)}°C</span>
                ${getCustomWeatherIcon(data.current.condition.text, isDay)}
            </div>
            <p class="description">${data.current.condition.text}</p>
            <div class="weather-details">
                <div class="detail">
                    ${getWindIcon(data.current.wind_kph)}
                    <span class="wind">${data.current.wind_kph} km/h</span>
                </div>
                <div class="detail">
                    ${getHumidityIcon(data.current.humidity)}
                    <span class="humidity">${data.current.humidity}%</span>
                </div>
                <div class="detail">
                    ${getTemperatureIcon(data.current.temp_c)}
                    <span>Feels like ${Math.round(data.current.feelslike_c)}°C</span>
                </div>
            </div>
        </div>
    `;
}

// Update weather history UI with click handlers
function updateWeatherHistory(historyData) {
    if (!historyData || historyData.length === 0) {
        weatherHistory.innerHTML = '<p>Historical data not available</p>';
        return;
    }

    const historyHTML = historyData
        .map((data) => {
            const day = data.forecast.forecastday[0].day;
            const date = new Date(data.forecast.forecastday[0].date);
            
            return `
                <div class="weather-card" data-date="${data.forecast.forecastday[0].date}">
                    <h3>${formatDate(date, true)}</h3>
                    ${getCustomWeatherIcon(day.condition.text, 1)}
                    <p class="temp">${Math.round(day.avgtemp_c)}°C</p>
                    <p class="description">${day.condition.text}</p>
                    <div class="weather-details">
                        <div class="detail">
                            ${getWindIcon(day.maxwind_kph)}
                            <span>${day.maxwind_kph} km/h</span>
                        </div>
                        <div class="detail">
                            ${getHumidityIcon(day.avghumidity)}
                            <span>${day.avghumidity}%</span>
                        </div>
                        <div class="detail">
                            ${getTemperatureIcon(day.avgtemp_c)}
                            <span>Avg</span>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');

    weatherHistory.innerHTML = historyHTML;
    
    // Add click handlers to weather cards
    weatherHistory.querySelectorAll('.weather-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const date = card.dataset.date;
            showHourlyData(date, historyData[index]);
        });
    });
}

// Update weather forecast UI with click handlers
function updateWeatherForecast(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) {
        weatherForecast.innerHTML = '<p>Forecast data not available</p>';
        return;
    }

    const forecastHTML = data.forecast.forecastday
        .map((forecast) => {
            const date = new Date(forecast.date);
            const day = forecast.day;
            
            return `
                <div class="weather-card" data-date="${forecast.date}">
                    <h3>${formatDate(date, true)}</h3>
                    ${getCustomWeatherIcon(day.condition.text, 1)}
                    <p class="temp">${Math.round(day.avgtemp_c)}°C</p>
                    <p class="description">${day.condition.text}</p>
                    <div class="weather-details">
                        <div class="detail">
                            ${getWindIcon(day.maxwind_kph)}
                            <span>${day.maxwind_kph} km/h</span>
                        </div>
                        <div class="detail">
                            ${getHumidityIcon(day.avghumidity)}
                            <span>${day.avghumidity}%</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-temperature-high"></i>
                            <span>H: ${Math.round(day.maxtemp_c)}°C</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-temperature-low"></i>
                            <span>L: ${Math.round(day.mintemp_c)}°C</span>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');

    weatherForecast.innerHTML = forecastHTML;

    // Add click handlers to forecast cards
    weatherForecast.querySelectorAll('.weather-card').forEach((card) => {
        card.addEventListener('click', () => {
            const date = card.dataset.date;
            const forecastDay = data.forecast.forecastday.find(f => f.date === date);
            showHourlyData(date, { forecast: { forecastday: [forecastDay] } });
        });
    });
}

// Function to show hourly temperature data
function showHourlyData(date, data) {
    const dayData = data.forecast.forecastday[0];
    const formattedDate = formatDate(new Date(date), true);
    hourlyModalTitle.textContent = `Hourly Temperature - ${formattedDate}`;

    const hours = dayData.hour.map(h => new Date(h.time).getHours() + ':00');
    const temps = dayData.hour.map(h => h.temp_c);
    const conditions = dayData.hour.map(h => h.condition.text);

    // Destroy existing chart if it exists
    if (hourlyChart) {
        hourlyChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const hour = context.dataIndex;
                            return [
                                `Temperature: ${temps[hour]}°C`,
                                `Condition: ${conditions[hour]}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });

    // Show the modal
    hourlyModal.style.display = 'block';
}

// Event listener for closing hourly modal
closeHourlyModal.addEventListener('click', () => {
    hourlyModal.style.display = 'none';
});

// Close hourly modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === hourlyModal) {
        hourlyModal.style.display = 'none';
    }
});

// Helper function to format date
function formatDate(date, short = false) {
    const options = short
        ? { month: 'short', day: 'numeric' }
        : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Initialize the app with user's current location
document.addEventListener('DOMContentLoaded', getCurrentLocation);
