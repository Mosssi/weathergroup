const city_input = document.getElementById("city_input");
const country = document.getElementById("country");
const temp = document.getElementById("temp");
const feels_like = document.getElementById("feels_like");
const wind_speed = document.getElementById("wind_speed");
const humidity = document.getElementById("humidity");

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
      city_name.textContent = `${data.name} `;
      country.textContent = `${data.sys.country}`;
      temp.textContent = `${data.main.temp}°C  `;
      feels_like.textContent = `Feels like: ${data.main.feels_like}°C`;
      wind_speed.textContent = `Wind Speed :${data.wind.speed} m/s`;
      humidity.textContent = `Humidity : ${data.main.humidity}%`;

      //Hourly weather report

      data.list.forEach((item, index) => {
        if (index >= 8) return; // 8 × 3 hours = 24 hours

        const dateObj = new Date(item.dt * 1000);
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        hourlyHTML += `
                <p><b>${time}</b>: ${item.main.temp}°C — ${item.data[0].description}</p>
            `;
      }); //end of hourly report
    })
    .catch((error) => {
      console.error("Error:", error);
      city_input.textContent = "Could not load weather";
    });
};

btn_findweather.addEventListener("click", getWeatherReport);
