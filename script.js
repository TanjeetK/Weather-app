const apikey="397fae0c1ab3bc58076dca2659424189";
const apiURL="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox=document.querySelector('.searchbar input');
const searchBtn=document.querySelector('.searchbar button');
const weatherIcon=document.querySelector('.weather-icon');

async function checkWeather(city){
    const response= await fetch(apiURL + city + `&appid=${apikey}`);
    var data= await response.json();

    if (response.status === 404) {
        document.querySelector(".error-message").style.display = "block";
        document.querySelector(".weather").style.display      = "none";
        return;
    }

    console.log(data);
    document.querySelector(".city").innerHTML =data.name;
    document.querySelector(".temp").innerHTML =Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML =data.main.humidity + "%";
    document.querySelector(".wind").innerHTML =data.wind.speed + " Km/Hr";

    if(data.weather[0].main =="Clouds"){
            weatherIcon.src="images/cloudy.png";
    }
    else if(data.weather[0].main =="Clear"){
            weatherIcon.src="images/sun.png";
    }
    else if(data.weather[0].main =="Rain"){
            weatherIcon.src="images/rain.png";
    }
    else if(data.weather[0].main =="Drizzle"){
            weatherIcon.src="images/rainy.png";
    }
    else if(data.weather[0].main =="Mist"){
            weatherIcon.src="images/mist.png";
    }
    else if(data.weather[0].main =="Snow"){
        weatherIcon.src="images/snow.png";
    }  
        document.querySelector(".error-message").style.display = "none"; // hide error
        document.querySelector(".weather").style.display = "block"; // show weather
    
}


searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city !== "") {
        checkWeather(city);
    }
});

searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const city = searchBox.value.trim();
        if (city !== "") {
            checkWeather(city);
        }
    }
});
