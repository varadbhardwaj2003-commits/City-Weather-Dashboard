async function getWeather() {
    
    const input = document.getElementById('input').value.trim();
    const weatherBox = document.getElementById('weatherBox');
    const location = document.getElementById('location');
    const weatherDescription = document.getElementById('weather-description');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');

    if (!input) return;


  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=92a1326484d1d36ef2ada683bdb28ca5&units=metric`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Weather API error', response.status, err);
      alert(err.message || 'City not found or API error');
      return;
    }
    const data = await response.json();

    // map main weather to emoji/icon
    const main = (data.weather && data.weather[0] && data.weather[0].main) || '';
    const iconEl = document.getElementById('weather-icon');
    const iconMap = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️'
    };

    const icon = iconMap[main] || '🌤️';
    if (iconEl) iconEl.textContent = icon;

    location.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherBox.style.display = 'block';

  } catch (error) {
    console.error(error);
    alert('Network error. Check console for details.');
  }
}

// Setup: prevent the form from submitting (which reloads the page)
// and call getWeather() when the user submits the form.
const form = document.getElementById('form');
const weatherBoxGlobal = document.getElementById('weatherBox');
if (weatherBoxGlobal) weatherBoxGlobal.style.display = 'none';
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWeather();
  });
}

// Suggested cities: populate a list of 10 common cities and wire clicks
const suggestionCities = [
  'New York',
  'London',
  'Tokyo',
  'Paris',
  'Sydney',
  'Mumbai',
  'São Paulo',
  'Cairo',
  'Toronto',
  'Dubai'
];

const suggestionsList = document.getElementById('suggestions');
function renderSuggestions() {
  if (!suggestionsList) return;
  suggestionsList.innerHTML = '';
  suggestionCities.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.tabIndex = 0;
    li.addEventListener('click', () => {
      const input = document.getElementById('input');
      if (input) input.value = city;
      getWeather();
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
    suggestionsList.appendChild(li);
  });
}

renderSuggestions();
