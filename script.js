const apikey = "397fae0c1ab3bc58076dca2659424189";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?&q=";

const searchBox = document.querySelector('.searchbar input');
const searchBtn = document.querySelector('.searchbar button');
const weatherIcon = document.querySelector('.weather-icon');
const weatherDisplay = document.querySelector('.weather');
const errorMessage = document.querySelector('.error-message');
const tempElement = document.querySelector('.temp');

let currentWeatherData = null;
let units = localStorage.getItem('weatherUnits') || 'metric';

document.addEventListener('DOMContentLoaded', () => {
    const unitToggle = document.createElement('button');
    unitToggle.className = 'unit-toggle';
    unitToggle.textContent = units === 'metric' ? '°F' : '°C';
    unitToggle.title = 'Click to toggle between °C and °F';
    document.body.appendChild(unitToggle);

unitToggle.addEventListener('click', () => {
    units = units === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = units === 'metric' ? '°F' : '°C';
    localStorage.setItem('weatherUnits', units);
    
    let changeTemp = document.querySelector('.temp');
    let currentUnit = changeTemp.textContent.slice(-1); 

    if (currentUnit === 'C') {
        changeTemp.textContent = changeTemp.textContent.replace('°C', '°F');
    } else if (currentUnit === 'F') {
        changeTemp.textContent = changeTemp.textContent.replace('°F', '°C');
    }

    if (currentWeatherData) {
        updateWeatherDisplay(currentWeatherData);
    }
});
});

const weatherIcons = {
    "Clouds": "images/cloudy.png",
    "Clear": "images/sun.png",
    "Rain": "images/rain.png",
    "Drizzle": "images/rainy.png",
    "Mist": "images/mist.png",
    "Snow": "images/snow.png"
};

function setLoading(isLoading) {
    if (isLoading) {
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<div class="loading"></div>';
    } else {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<img src="./images/searchicon.png">';
    }
}

function convertTemperature(temp, targetUnit) {
    if (targetUnit === 'metric') {
        return (temp - 32) * 5 / 9;
    } else {
        return temp * 9 / 5 + 32;
    }
}

function updateWeatherDisplay(data) {
    currentWeatherData = data;

    document.querySelector(".city").textContent = data.name;

    let temperature;
    if (units === 'metric') {
        temperature = data.main.temp;
    }else {
        temperature = data.main.temp;
    }
    tempElement.textContent = Math.round(temperature) + (units === 'metric' ? '°C' : '°F');
    document.querySelector(".humidity").textContent = data.main.humidity + "%";

    const windSpeed = units === 'metric' ? data.wind.speed : data.wind.speed * 2.237;
    document.querySelector(".wind").textContent =
    Math.round(windSpeed * 10) / 10 + (units === 'metric' ? " Km/Hr" : " mph");

    const weatherCondition = data.weather[0].main;
    weatherIcon.src = weatherIcons[weatherCondition] || "images/cloudy.png";

    weatherDisplay.style.display = "block";
}

async function checkWeather(city) {
    try {
    setLoading(true);
    errorMessage.style.display = "none";

    const fetchURL = `${apiURL}${city}&units=${units}&appid=${apikey}`;
    const response = await fetch(fetchURL);
    const data = await response.json();

    if (response.status === 404) {
        errorMessage.textContent = "City not found. Please try again.";
        errorMessage.style.display = "block";
        weatherDisplay.style.display = "none";
        return;
    }

    if (response.status !== 200) {
        throw new Error(`API Error: ${data.message || 'Unknown error'}`);
    }

    updateWeatherDisplay(data);
    localStorage.setItem('lastCity', city);

    } catch (error) {
    console.error("Error fetching weather data:", error);
    errorMessage.textContent = "An error occurred. Please try again.";
    errorMessage.style.display = "block";
    } finally {
    setLoading(false);
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city !== "") {
    checkWeather(city);
    }
});

searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
    const city = searchBox.value.trim();
    if (city !== "") {
        checkWeather(city);
    }
    }
});
