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
