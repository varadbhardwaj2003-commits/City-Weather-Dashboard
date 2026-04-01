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
        const data = await response.json();

        location.textContent = data.name;
        weatherDescription.textContent = data.weather[0].description;
        temperature.textContent = `Temperature: ${data.main.temp} °C`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        weatherBox.style.display = 'block';
        

    } catch (error) {
      console.log(error)
    }
}

// Setup: prevent the form from submitting (which reloads the page)
// and call getWeather() when the user submits the form.
const form = document.getElementById('form');
const weatherBoxInit = document.getElementById('weatherBox');
if (weatherBoxInit) weatherBoxInit.style.display = 'none';
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWeather();
  });
}
