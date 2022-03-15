let cityLon = 0
let cityLat = 0
let cityInputEl = document.querySelector("#city");
let cityFormEl = document.querySelector("#city-form");
let forecastHeaderEl = document.querySelector("#forecast-header")
let jumboEl = document.querySelector("#jumbotron");

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
    let date = new Date((data.current.dt*1000)-(data.timezone_offset*1000))
    let cityName = document.createElement("h3");
    cityName.textContent = cityInputEl.value.trim() + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    let currentIconEl = document.createElement("img");
    let icon = data.current.weather[0].icon
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ icon + "@2x.png");
    currentIconEl.setAttribute("class", "weather-icon");
    cityName.appendChild(currentIconEl);

    let currentTemp = document.createElement("p");
    currentTemp.textContent = "Temp: " + data.current.temp + "°F";

    let currentWind = document.createElement("p");
    currentWind.textContent = "Wind: " + data.current.wind_speed + "mph";

    let currentHumidity = document.createElement("p");
    currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";

    let currentUV = document.createElement("p");
    let uvSpan = document.createElement("span")
    uvSpan.innerHTML = data.current.uvi
    currentUV.textContent = "UV Index: ";
    currentUV.append(uvSpan);
    if (data.current.uvi <= 2) {
        uvSpan.setAttribute("class", "success")
    } else if (data.current.uvi > 2 && data.current.uvi < 8) {
        uvSpan.setAttribute("class", "warning");
    } else if (data.current.uvi === 8) {
        uvSpan.setAttribute("class", "danger");
    }

    jumboEl.append(cityName, currentTemp, currentWind, currentHumidity, currentUV);

}

function getDailyWeather(data) {
    let weatherCard = document.createElement("div");
    weatherCard.setAttribute("class", "justify-content-evenly row")
    

    for (let i = 1; i < 6; i++) {
        let date = new Date((data.daily[i].dt*1000)-(data.timezone_offset*1000))
        let dateCard = document.createElement("div")
        dateCard.setAttribute("class", "card col-2 lower-cards")
        let dateEl = document.createElement("h4")
        console.log((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear())
        dateEl.textContent = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()

        let dailyIconEl = document.createElement("img");
        let icon = data.daily[i].weather[0].icon
        dailyIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ icon + "@2x.png");
        dailyIconEl.setAttribute("class", "weather-icon");
        dateEl.append(dailyIconEl)

        let dailyTemp = document.createElement("p");
        dailyTemp.setAttribute("class", "card-p")
        dailyTemp.textContent = data.daily[i].temp.max

        let dailyWind = document.createElement("p");
        dailyWind.textContent = data.daily[i].wind_speed

        let dailyHumid = document.createElement("p");
        dailyHumid.textContent = data.daily[i].humidity

        console.log(dateEl, dailyTemp, dailyWind, dailyHumid)
        dateCard.append(dateEl, dailyTemp, dailyWind, dailyHumid)
        weatherCard.append(dateCard)
    }
    forecastHeaderEl.append(weatherCard);

}

function formSubmitHandler(event) {
    let elementExists = document.querySelector(".lower-cards")

    if(elementExists) {
        clearPage()
        getLonLat(event)
    } else {
        getLonLat(event);
    }
}

cityFormEl.addEventListener("submit", formSubmitHandler)