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
    // let cityName = cityInputEl.value.trim();
    // let currentTemp = data.current.temp
    // let currentWind = data.current.wind_speed
    // let currentHumidity = data.current.humidity
    // let currentUV = data.current.uvi
    // console.log(cityName, currentTemp, currentWind, currentHumidity, currentUV)

    let cityName = document.createElement("h3");
    cityName.textContent = cityInputEl.value.trim();

    let currentTemp = document.createElement("p");
    currentTemp.textContent = data.current.temp;

    let currentWind = document.createElement("p");
    currentWind.textContent = data.current.wind_speed;

    let currentHumidity = document.createElement("p");
    currentHumidity.textContent = data.current.humidity;

    let currentUV = document.createElement("p");
    currentUV.textContent = data.current.uvi;
    if (data.current.uvi <= 2) {
        currentUV.setAttribute("class", "success")
    } else if (data.current.uvi > 2 && data.current.uvi < 8) {
        currentUV.setAttribute("class", "warning");
    } else if (data.current.uvi === 8) {
        currentUV.setAttribute("class", "danger");
    }

    jumboEl.append(cityName, currentTemp, currentWind, currentHumidity, currentUV);

}

function getDailyWeather(data) {
    let weatherCard = document.createElement("div");
    weatherCard.setAttribute("class", "justify-content-evenly row")
    

    for (let i = 0; i < 5; i++) {
        let date = new Date((data.daily[i].dt*1000)-(data.timezone_offset*1000))
        let dateCard = document.createElement("div")
        dateCard.setAttribute("class", "card col-2")
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
        dateCard.append(dateEl, dailyTemp, dailyWind, dailyHumid)
        weatherCard.append(dateCard)
    }
    forecastHeaderEl.append(weatherCard);

}

cityFormEl.addEventListener("submit", getLonLat)