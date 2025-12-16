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
const btn_location = document.getElementById("btn_location");
const hideLocationBar = () => {
  if (btn_location) {
    btn_location.style.display = "none";
  }
};

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
      hideLocationBar();
      console.log(data);
      console.log(`It's ${data.list[0].main.temp}°C in ${data.city.name}`);
      current_weather_card.style.display = "block";
      weatherData = data;
      city_name.textContent = `${data.city.name} `;
      country.textContent = `${data.city.country}`;
      temp.textContent = `${data.list[0].main.temp}°C  `;
      feels_like.textContent = `Feels like: ${data.list[0].main.feels_like}°C`;
      wind_speed.textContent = `💨Wind Speed: ${data.list[0].wind.speed} m/s`;
      humidity.textContent = `💧Humidity: ${data.list[0].main.humidity}%`;

      let hourlyHTML =
        "<h2>Hourly Weather Report</h2><div class='hourly-items'>";

      data.list.forEach((item, index) => {
        if (index >= 8) return; // 8 × 3 hours = 24 hours

        
        const timeStr = item.dt_txt.slice(11, 16); 
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const time = `${hour12
          .toString()
          .padStart(2, "0")}:${minutes} ${period}`;

        hourlyHTML += `
          <div class="hourly-item">
            <div class="hourly-time">${time}</div>
            <div class="hourly-temp">${item.main.temp}°C</div>
            <div class="hourly-desc">${item.weather[0].description}</div>
          </div>
        `;
      });

      hourlyHTML += "</div>";
      hourly_report.innerHTML = hourlyHTML;

      
      if (showHourlyOnNextFetch) {
        current_weather_card.style.display = "block";
        hourly_report.style.display = "block";
        hourly_report.scrollIntoView({ behavior: "smooth" });
        showHourlyOnNextFetch = false;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      city_input.textContent = "Could not load weather";
    });
};

btn_findweather.addEventListener("click", getWeatherReport);

// location weather
function showLocationBar() {
  const btn = document.getElementById("btn_location");
  if (btn) btn.style.display = "flex";
}
const getWeatherBylocation = () => {
  if (navigator.geolocation) {
    city_input.placeholder = "locating...";
    const options = {
      enableHighAccuracy:false,
      timeout: 30000,
      maximumAge:300000,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`location at ${lat},${lon}`);

        const url = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error("Location fetch failed");
            return response.json();
          })
          .then((data) => {
            hideLocationBar();
            console.log(data);

            current_weather_card.style.display = "block";
            weatherData = data;
            city_input.value ="";

            city_name.textContent = `${data.city.name}`;
            country.textContent = `${data.city.country}`;
            temp.textContent = `${Math.round(data.list[0].main.temp)}°C`;
            feels_like.textContent = `Feels like:${Math.round(
              data.list[0].main.feels_like
            )}°C`;
            wind_speed.textContent = `💨wind speed:${data.list[0].wind.speed} m/s`;
            humidity.textContent = `💧Humidity:${data.list[0].main.humidity}%`;

            let hourlyHTML =
              "<h2>Hourly Weather Report</h2><div class='hourly-items'>";

            data.list.forEach((item, index) => {
              if (index >= 8) return; // 8 × 3 hours = 24 hours

              
              const timeStr = item.dt_txt.slice(11, 16); 
              const [hours, minutes] = timeStr.split(":");
              const hour = parseInt(hours);
              const period = hour >= 12 ? "PM" : "AM";
              const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              const time = `${hour12
                .toString()
                .padStart(2, "0")}:${minutes} ${period}`;

              hourlyHTML += `
          <div class="hourly-item">
            <div class="hourly-time">${time}</div>
            <div class="hourly-temp">${item.main.temp}°C</div>
            <div class="hourly-desc">${item.weather[0].description}</div>
          </div>
        `;
            });

            hourlyHTML += "</div>";
            hourly_report.innerHTML = hourlyHTML;

            city_input.placeholder = "Enter city name";
          })
          .catch((error) => {
            console.error(error);
            alert("Error getting location weather");
            city_input.placeholder = "Enter city name";
          });
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location.Please allow access");
        city_input.placeholder = "Enter city name";
      },
      options
    );
  } else {
    alert("Geolcation is not supported by your browser");
  }
};
if (btn_location) {
  btn_location.addEventListener("click", getWeatherBylocation);
}

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


const mobileToggle = document.querySelector(".mobile-toggle");
const navList = document.querySelector(".nav-list");

if (mobileToggle) {
  mobileToggle.addEventListener("click", () => {
    navList.classList.toggle("active");
  });
}
