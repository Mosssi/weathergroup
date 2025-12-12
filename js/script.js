const city_input = document.getElementById("city_input");
const country = document.getElementById("country");
const temp = document.getElementById("temp");
const feels_like = document.getElementById("feels_like");
const wind_speed = document.getElementById("wind_speed");
const humidity = document.getElementById("humidity");
const city_name = document.getElementById("city_name");
const hourly_report = document.getElementById("hourly_report");

const btn_findweather = document.getElementById("btn_findweather");
const advance_weather = document.getElementById("advance_weather");
const current_weather_card = document.getElementById("current_weather_card");
let weatherData = null;
let showHourlyOnNextFetch = false;
const API_KEY = "b686cc3e7c3055e05371c4abafced0bb";
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

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
      console.log(`It's ${data.list[0].main.temp}°C in ${data.city.name}`);
      current_weather_card.style.display = "block";
      weatherData = data;
      city_name.textContent = `${data.city.name} `;
      country.textContent = `${data.city.country}`;
      temp.textContent = `${data.list[0].main.temp}°C  `;
      feels_like.textContent = `Feels like: ${data.list[0].main.feels_like}°C`;
      wind_speed.textContent = `Wind Speed: ${data.list[0].wind.speed} m/s`;
      humidity.textContent = `Humidity: ${data.list[0].main.humidity}%`;

     
      let hourlyHTML =
        "<h3>Hourly Weather Report</h3><div class='hourly-items'>";

      data.list.forEach((item, index) => {
        if (index >= 8) return; // 8 × 3 hours = 24 hours

        const dateObj = new Date(item.dt * 1000);
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        hourlyHTML += `
          <div class="hourly-item">
            <div class="hourly-time">${time} </div>
            <div class="hourly-temp">${item.main.temp}°C</div>
            <div class="hourly-desc">${item.weather[0].description}</div>
          </div>
        `;
      }); 

      hourlyHTML += "</div>";
      hourly_report.innerHTML = hourlyHTML;

     
    })
    .catch((error) => {
      console.error("Error:", error);
      city_input.textContent = "Could not load weather";
    });
};

btn_findweather.addEventListener("click", getWeatherReport);


advance_weather.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (weatherData) {
    current_weather_card.style.display = "block";
    hourly_report.style.display = "block";
    
  } else {
    const cityText = city_input.value.trim();
    if (cityText) {
      
      showHourlyOnNextFetch = true;
      getWeatherReport();
    } else {
      alert("Please search for a city first!");
    }
  }
});
