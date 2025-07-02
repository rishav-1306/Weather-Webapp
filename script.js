// ======= config =======
const apiKey = "6104abace427aa34c7b1a267006134ee";

// ======= element refs =======
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const resultBox   = document.getElementById("weatherResult");
const loader      = document.getElementById("loader");

// ======= events =======
searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") getWeather();
});

// ======= main function =======
async function getWeather() {
  const city = cityInput.value.trim();
  resultBox.innerHTML = "";               // clear old result
  if (!city) {
    resultBox.innerHTML = `<p id="error">Please enter a city name.</p>`;
    return;
  }

  loader.classList.remove("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const res  = await fetch(url);
    const data = await res.json();

    // API returns error details inside JSON too
    if (!res.ok || data.cod !== 200) {
      throw new Error(data.message || "City not found");
    }

    renderWeather(data);
  } catch (err) {
    resultBox.innerHTML = `<p id="error">${err.message}</p>`;
  } finally {
    loader.classList.add("hidden");
  }
}

// ======= helper: render =========
function renderWeather(data) {
  const { name, sys, main, weather } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  resultBox.innerHTML = `
    <img class="weather-icon" src="${iconUrl}" alt="${weather[0].description}" />
    <h2>${name}, ${sys.country}</h2>
    <p class="temp">${main.temp.toFixed(1)}°C</p>
    <p><strong>Weather:</strong> ${weather[0].main} (${weather[0].description})</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Feels like:</strong> ${main.feels_like.toFixed(1)}°C</p>
  `;
}

