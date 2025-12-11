const weather = document.getElementById("weather_detail");
const feels_like = document.getElementById("weather_detail_feels_like");
const city_input = document.getElementById("city_input");
const btn_findweather = document.getElementById("btn_findweather");
const API_KEY = "b686cc3e7c3055e05371c4abafced0bb";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const getWeatherReport = () => {
  const cityText = city_input.value.trim();
  console.log(`City name is ${cityText}`);
  if (!cityText) {
    weather.textContent = "No city specified";
    return;
  }

  fetch(
    `${API_URL}?q=${encodeURIComponent(cityText)}&appid=${API_KEY}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        return response
          .json()
          .then((body) => {
            const msg = body?.message ? `: ${body.message}` : "";
            throw new Error(`Request failed (${response.status}${msg})`);
          })
          .catch(() => {
            throw new Error(`Request failed (${response.status})`);
          });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(`It's ${data.main.temp}°C in ${data.name}`);
      weather.textContent = `${data.main.temp}°C in ${data.name}`;
      feels_like.textContent = `Feels like: ${data.main.feels_like}°C`;
    })
    .catch((error) => {
      console.error("Error:", error);
      weather.textContent = "Could not load weather";
    });
};

btn_findweather.addEventListener("click", getWeatherReport);

async function getWeather() {

  const city = city_input.value.trim();
  const currentDiv = document.querySelector(".current-weather");
  const hourlyDiv = document.querySelector(".hourly-weather");
  const overviewDiv = document.querySelector(".weather-overview");

  if (!city) {
    currentDiv.innerHTML = "Please enter a city name!";
    return;
  }

  try {
    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    if (weatherData.cod == "404") {
      currentDiv.innerHTML = "City not found!";
      return;
    }

    //currentDiv.innerHTML = `<h2>${weatherData.name}</h2>`;
/*    currentDiv.innerHTML += `
            <p><b>Weather:</b> ${weatherData.weather[0].description}</p>
            <p><b>Wind Speed:</b> ${weatherData.wind.speed} m/s</p>
            `;     */

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    let hourlyHTML = "<h3>Hourly Forecast (Next 24h)</h3>";

    forecastData.list.forEach((item, index) => {
      if (index >= 8) return; // 8 × 3 hours = 24 hours

      const dateObj = new Date(item.dt * 1000);
      const time = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      hourlyHTML += `
                <p><b>${time}</b>: ${item.main.temp}°C — ${item.weather[0].description}</p>
            `;
    });

    hourlyDiv.innerHTML = hourlyHTML;
    
    overviewDiv.innerHTML = `
    <h3>Overview</h3>
    <p><b>Weather:</b> ${weatherData.weather[0].description}</p>
    <p><b>Wind Speed:</b> ${weatherData.wind.speed} m/s</p>
    <p><b>Humidity:</b> ${weatherData.main.humidity}%</p>
    <p><b>Wind: </b> ${weatherData.wind.speed} m/s</p>
    `;
    

  } catch (error) {
  console.error("Error:", error);
    currentDiv.innerHTML = "Error fetching weather!";
  }
};

advance_weather.addEventListener("click", getWeather);
