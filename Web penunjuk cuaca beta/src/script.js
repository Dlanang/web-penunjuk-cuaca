window.onload = function() {
  // Get weather data from XML API
  fetchWeatherData();

  // Update time every second
  setInterval(updateClock, 1000);

  // Initialize chat
  initChat();
};

function fetchWeatherData() {
  const url = 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml';
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const data = parseXML(request.responseText);
        displayWeatherData(data);
      } else {
        console.error('Error fetching weather data:', request.status);
      }
    }
  };

  request.open('GET', url);
  request.send();
}

function parseXML(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  
  return xmlDoc;
}

function displayWeatherData(data) {
  const areaElements = data.getElementsByTagName('Area');
  let jawaTimurData;

  // Find Jawa Timur weather data
  for (let i = 0; i < areaElements.length; i++) {
    const areaElement = areaElements[i];
    const areaName = areaElement.getAttribute('description');
    
    if (areaName === 'JAWA TIMUR') {
      jawaTimurData = areaElement;
      break;
    }
  }

  if (!jawaTimurData) {
    console.error('Weather data for Jawa Timur not found.');
    return;
  }

  const timeElement = jawaTimurData.getElementsByTagName('Issue')[0];

  const weatherData = {
    timerange: timeElement.getAttribute('DateTime'),
    weather: getWeatherDescription(jawaTimurData.getElementsByTagName('Weather').item(0).textContent),
    temperature: jawaTimurData.getElementsByTagName('Temperature').item(0).textContent,
    minTemperature: jawaTimurData.getElementsByTagName('MinTemperature').item(0).textContent,
    maxTemperature: jawaTimurData.getElementsByTagName('MaxTemperature').item(0).textContent,
    humidity: jawaTimurData.getElementsByTagName('Humidity').item(0).textContent,
    minHumidity: jawaTimurData.getElementsByTagName('MinHumidity').item(0).textContent,
    maxHumidity: jawaTimurData.getElementsByTagName('MaxHumidity').item(0).textContent,
    windSpeed: jawaTimurData.getElementsByTagName('WindSpeed').item(0).textContent,
    windDirection: getWindDirection(jawaTimurData.getElementsByTagName('WindDirection').item(0).textContent)
  };

  // Display weather data for Jawa Timur
  displayWeather(weatherData);
}

function displayWeather(weatherData) {
  const weatherDiv = document.getElementById('weather');
  weatherDiv.innerHTML = `
    <p>Time: ${weatherData.timerange}</p>
    <p>Weather: ${weatherData.weather}</p>
    <p>Temperature: ${weatherData.temperature}°C (${convertCelsiusToFahrenheit(weatherData.temperature)}°F)</p>
    <p>Min Temperature: ${weatherData.minTemperature}°C (${convertCelsiusToFahrenheit(weatherData.minTemperature)}°F)</p>
    <p>Max Temperature: ${weatherData.maxTemperature}°C (${convertCelsiusToFahrenheit(weatherData.maxTemperature)}°F)</p>
    <p>Humidity: ${weatherData.humidity}% (Min: ${weatherData.minHumidity}%, Max: ${weatherData.maxHumidity}%)</p>
    <p>Wind Speed: ${weatherData.windSpeed} knots (${convertKnotsToMph(weatherData.windSpeed)} mph, ${convertKnotsToKph(weatherData.windSpeed)} kph, ${convertKnotsToMs(weatherData.windSpeed)} m/s)</p>
    <p>Wind Direction: ${weatherData.windDirection}</p>
  `;
}

function updateClock() {
  // Mendapatkan waktu saat ini dalam zona waktu lokal pengguna
  const now = new Date();

  // Mendapatkan offset waktu zona waktu lokal pengguna dari UTC dalam menit
  const offset = now.getTimezoneOffset();

  // Menghitung waktu di zona waktu Jakarta (GMT +7) dengan menambahkan offset
  const jakartaTime = new Date(now.getTime() + (offset + 420) * 60000); // 420 menit = 7 jam

  // Format waktu sesuai dengan preferensi
  const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = jakartaTime.toLocaleString('en-US', options);
  
  // Menampilkan waktu
  document.getElementById('clock').innerHTML = `Current Jakarta Time: ${timeString}`;
}

function initChat() {
  const chatDiv = document.getElementById('chat');
  chatDiv.innerHTML = 'Chat feature coming soon...';
}

function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    '0': 'Cerah / Clear Skies',
    '1': 'Cerah Berawan / Partly Cloudy',
    '2': 'Cerah Berawan / Partly Cloudy',
    '3': 'Berawan / Mostly Cloudy',
    '4': 'Berawan Tebal / Overcast',
    '5': 'Udara Kabur / Haze',
    '10': 'Asap / Smoke',
    '45': 'Kabut / Fog',
    '60': 'Hujan Ringan / Light Rain',
    '61': 'Hujan Sedang / Rain',
    '63': 'Hujan Lebat / Heavy Rain',
    '80': 'Hujan Lokal / Isolated Shower',
    '95': 'Hujan Petir / Severe Thunderstorm',
    '97': 'Hujan Petir / Severe Thunderstorm'
  };
  return weatherDescriptions[weatherCode] || 'Unknown';
}

function getWindDirection(windDirection) {
  const windDirections = {
    'N': 'North',
    'NNE': 'North-Northeast',
    'NE': 'Northeast',
    'ENE': 'East-Northeast',
    'E': 'East',
    'ESE': 'East-Southeast',
    'SE': 'Southeast',
    'SSE': 'South-Southeast',
    'S': 'South',
    'SSW': 'South-Southwest',
    'SW': 'Southwest',
    'WSW': 'West-Southwest',
    'W': 'West',
    'WNW': 'West-Northwest',
    'NW': 'Northwest',
    'NNW': 'North-Northwest',
    'VARIABLE': 'Variable'
  };
  return windDirections[windDirection] || 'Unknown';
}

function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function convertKnotsToMph(knots) {
  return knots * 1.15078;
}

function convertKnotsToKph(knots) {
  return knots * 1.852;
}

function convertKnotsToMs(knots) {
  return knots * 0.514444;
}
