let cityLon = 0
let cityLat = 0
let cityInputEl = document.querySelector("#city");
let cityFormEl = document.querySelector("#city-form");
let forecastHeaderEl = document.querySelector("#forecast-header")

function getLonLat(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=5&appid=3235f6ca43f152b21beee3053909231f"

    console.log(apiUrl);

    fetch(apiUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        cityLon = data[0].lon;
        cityLat = data[0].lat;
        console.log(cityLon, cityLat)
        getForecast(cityLon, cityLat);
    })
    
}

function getForecast(cityLon, cityLat) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely&units=imperial&appid=3235f6ca43f152b21beee3053909231f"
    console.log(cityLon, cityLat)
    fetch(apiUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        console.log(data.hourly)
        console.log(data.daily)
        getCurrentWeather(data);
        getDailyWeather(data);
    })
}

function getCurrentWeather(data) {
    let cityName = cityInputEl.value.trim();
    let currentTemp = data.current.temp
    let currentWind = data.current.wind_speed
    let currentHumidity = data.current.humidity
    let currentUV = data.current.uvi
    console.log(cityName, currentTemp, currentWind, currentHumidity, currentUV)
}

function getDailyWeather(data) {
    let weatherCard = document.createElement("div");
    dateEl.textContent = ""
    dailyTemp.textContent = ""
    dailyWind.textContent = ""
    dailyHumid.textContent = ""


    for (let i = 0; i < 5; i++) {
        let date = new Date((data.daily[i].dt*1000)-(data.timezone_offset*1000))
        let dateEl = document.createElement("h4")
        console.log((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear())
        dateEl.textContent = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()

        let dailyTemp = document.createElement("p");
        dailyTemp.textContent = data.daily[i].temp.max

        let dailyWind = document.createElement("p");
        dailyWind.textContent = data.daily[i].wind_speed

        let dailyHumid = document.createElement("p");
        dailyHumid.textContent = data.daily[i].humidity

        console.log(dateEl, dailyTemp, dailyWind, dailyHumid)
        weatherCard.append(dateEl, dailyTemp, dailyWind, dailyHumid)
    }
    forecastHeaderEl.append(weatherCard);

}

cityFormEl.addEventListener("submit", getLonLat)