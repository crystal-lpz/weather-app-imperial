// Date
function updateTime(timezone) {
  let time = document.querySelector("#time-placement");
  let currentTime = document.querySelector("#last-update");
  let timePLace = luxon.DateTime.now().setZone(timezone);
  let currentPlace = luxon.DateTime.now();
  time.innerHTML = timePLace.toFormat(`cccc HH:mm`);
  currentTime.innerHTML = currentPlace.toFormat(`DDDD HH:mm`);
}

// Day forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}
// Daily forecast
function displayForecast(respond) {
  let forecast = respond.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ` <div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-4">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        </div>

        <div class="col-4 text-center">
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        </div>
        <div class="col-4">
        <div class="temperature-forecast">
         <span class="weather-forecast-temp-max">${Math.round(
           forecastDay.temp.max
         )} </span>°
         <span class="weather-forecast-temp-min">${Math.round(
           forecastDay.temp.min
         )}</span>°
       </div>
        </div>

      
     
   `;
    }
    forecastMinTemp = forecastDay.temp.min;
    forecastMaxTemp = forecastDay.temp.max;
  });
  forecastHTML = forecastHTML + ` </div>`;
  forecastElement.innerHTML = forecastHTML;
  updateTime(respond.data.timezone);
}

// Coordinates for forecast
function getForecast(coordinates) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// Display Temperature and Info
function showTemperature(respond) {
  let mainTemp = document.querySelector("#main-temp");
  let humidity = document.querySelector("#humidity");
  let city = document.querySelector(`h2`);
  let windSpeed = document.querySelector("#wind-speed");
  let maxTemp = document.querySelector("#max-temp");
  let minTemp = document.querySelector("#min-temp");
  let description = document.querySelector(`#description`);

  city.innerHTML = respond.data.name;
  humidity.innerHTML = respond.data.main.humidity;
  windSpeed.innerHTML = Math.round(respond.data.wind.speed);
  maxTemp.innerHTML = Math.round(respond.data.main.temp_max);
  minTemp.innerHTML = Math.round(respond.data.main.temp_min);
  description.innerHTML = respond.data.weather[0].description;
  mainTemp.innerHTML = Math.round(respond.data.main.temp);

  fahrenheitTemperature = respond.data.main.temp;

  // Calling Coordinates for forecast
  getForecast(respond.data.coord);
}

// Current Position Button + geolocation
function showPosition(position) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
}

// Navigator Geolocation
function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
// Button for current location
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);

// axios API
function search(city) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}q=${city}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
}

//WindSpeed
let unitWindspeed = document.querySelector(`#windspeed-unit`);
let metricWindspeed = `km/h`;
let windSpeed = document.querySelector("#wind-speed");
let windSpeedNumber = windSpeed.innerHTML;
let kilometres = Math.round(windSpeedNumber * 1.609);
windSpeed.innerHTML = `${kilometres}`;
unitWindspeed.innerHTML = `${metricWindspeed}`;

// API response Searching City name
function lookUp(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let fahrenheitTemperature = null;
let celsiusTemperature = null;
let forecastMinTemp = null;
let forecastMaxTemp = null;

// Calling function (lookup)
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);

search("new york");
