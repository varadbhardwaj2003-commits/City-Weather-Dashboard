const iconMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️'
};

async function getWeather() {
    const input = document.getElementById('input').value.trim();
    const weatherBox = document.getElementById('weatherBox');
    const forecastBox = document.getElementById('forecastBox');
    
    const location = document.getElementById('location');
    const weatherDescription = document.getElementById('weather-description');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const adviceText = document.getElementById('advice-text');
    const forecastList = document.getElementById('forecast-list');

    if (!input) return;

    const apiKey = '92a1326484d1d36ef2ada683bdb28ca5';

    try {
        // Fetch Current Weather
        const curRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`);
        if (!curRes.ok) throw new Error('City not found');
        const data = await curRes.json();

        // Fetch Forecast
        const forRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${apiKey}&units=metric`);
        const forData = await forRes.json();

        // 1. Current Weather Update
        const main = (data.weather && data.weather[0] && data.weather[0].main) || '';
        const iconEl = document.getElementById('weather-icon');
        const icon = iconMap[main] || '🌤️';
        if (iconEl) iconEl.textContent = icon;

        location.textContent = data.name;
        weatherDescription.textContent = data.weather[0].description;
        temperature.textContent = `Temperature: ${data.main.temp} °C`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        
        // 2. Generate Advice
        adviceText.textContent = generateAdvice(data.main.temp, main);

        // 3. Render 5-Day Forecast
        renderForecast(forData.list, forecastList);

        // Show Boxes
        weatherBox.style.display = 'block';
        forecastBox.style.display = 'block';
        
        setTimeout(() => {
            weatherBox.classList.add('show');
            forecastBox.classList.add('show');
        }, 10);

    } catch (error) {
        console.error(error);
        alert(error.message || 'Error fetching weather data');
    }
}

function generateAdvice(temp, condition) {
    let advice = "";
    
    // Condition-based
    if (condition === "Rain" || condition === "Drizzle") advice = "🌧️ Bring an umbrella! ";
    else if (condition === "Thunderstorm") advice = "⛈️ Stay indoors! ";
    else if (condition === "Snow") advice = "❄️ Wear warm boots. ";
    
    // Temp-based
    if (temp < 10) advice += "🧥 Wear a heavy jacket.";
    else if (temp < 20) advice += "🧣 A light jacket would be nice.";
    else if (temp < 30) advice += "👕 T-shirt weather!";
    else advice += "☀️ Stay hydrated, it's hot!";
    
    return advice;
}

function renderForecast(list, container) {
    container.innerHTML = '';
    // Filter forecast to get one entry per day (roughly at 12:00)
    const dailyData = list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
    
    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const main = item.weather[0].main;
        const temp = Math.round(item.main.temp);
        
        const div = document.createElement('div');
        div.className = 'forecast-item';
        div.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">${iconMap[main] || '🌤️'}</div>
            <div class="forecast-temp">${temp}°C</div>
        `;
        container.appendChild(div);
    });
}

// Setup form submission
const form = document.getElementById('form');
const weatherBoxGlobal = document.getElementById('weatherBox');
const forecastBoxGlobal = document.getElementById('forecastBox');

if (weatherBoxGlobal) weatherBoxGlobal.style.display = 'none';
if (forecastBoxGlobal) forecastBoxGlobal.style.display = 'none';

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (weatherBoxGlobal) {
            weatherBoxGlobal.classList.remove('show');
            forecastBoxGlobal.classList.remove('show');
            setTimeout(getWeather, 50);
        } else {
            getWeather();
        }
    });
}

// Dropdown Logic
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = dropdownMenu.classList.contains('active');
        
        if (isActive) {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownMenu.setAttribute('aria-hidden', 'true');
        } else {
            dropdownBtn.classList.add('active');
            dropdownMenu.classList.add('active');
            dropdownBtn.setAttribute('aria-expanded', 'true');
            dropdownMenu.setAttribute('aria-hidden', 'false');
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownMenu.setAttribute('aria-hidden', 'true');
        }
    });
}

// Suggested cities logic
const suggestionCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Mumbai', 'São Paulo', 'Cairo', 'Toronto', 'Dubai'];
const suggestionsList = document.getElementById('suggestions');

function renderSuggestions() {
    if (!suggestionsList) return;
    suggestionsList.innerHTML = '';
    suggestionCities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.tabIndex = 0;
        li.addEventListener('click', () => {
            document.getElementById('input').value = city;
            dropdownBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
            if (weatherBoxGlobal) {
                weatherBoxGlobal.classList.remove('show');
                forecastBoxGlobal.classList.remove('show');
                setTimeout(getWeather, 50);
            } else {
                getWeather();
            }
        });
        suggestionsList.appendChild(li);
    });
}
renderSuggestions();
