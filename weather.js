document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("Search-button");
    const tempToggleButton = document.getElementById("temp-toggle");
    const cityInput = document.getElementById("city-input");

    let isCelsius = true; // Track temperature unit

    searchButton.addEventListener("click", fetchWeather);
    tempToggleButton.addEventListener("click", toggleTemperature);

    // Add event listener for Enter key
    cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            fetchWeather();
        }
    });

    function fetchWeather() {
        const city = cityInput.value.trim();
        if (city === "") return alert("Please enter a city name");

        // Using your actual API key from the previous code
        const apiKey = "eedf56d13c22445d8c4160951240612";
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

        // Show loading indicator
        document.getElementById("weather-display").classList.add("loading");

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("City not found or API error");
                }
                return response.json();
            })
            .then(data => {
                updateWeatherDisplay(data);
                document.getElementById("weather-display").classList.remove("loading");
            })
            .catch(error => {
                alert("Error: " + error.message);
                console.error("API Error:", error);
                document.getElementById("weather-display").classList.remove("loading");
            });
    }

    function updateWeatherDisplay(data) {
        // Make sure all elements exist before updating them
        const cityNameEl = document.getElementById("city-name");
        const cityTimeEl = document.getElementById("city-time");
        const cityTempEl = document.getElementById("city-temp");
        const weatherConditionEl = document.getElementById("weather-condition");
        const humidityWindEl = document.getElementById("humidity-wind");
        const weatherIconEl = document.getElementById("weather-icon");

        if (cityNameEl) cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
        if (cityTimeEl) cityTimeEl.textContent = `Local Time: ${data.location.localtime}`;
        if (cityTempEl) {
            cityTempEl.textContent = `${data.current.temp_c}°C`;
            // Store temperature in dataset for conversion
            cityTempEl.dataset.tempC = data.current.temp_c;
            cityTempEl.dataset.tempF = data.current.temp_f;
        }
        if (weatherConditionEl) weatherConditionEl.textContent = data.current.condition.text;
        if (humidityWindEl) humidityWindEl.textContent = `Humidity: ${data.current.humidity}%, Wind: ${data.current.wind_kph} kph`;

        if (weatherIconEl) {
            weatherIconEl.src = "https:" + data.current.condition.icon;
            weatherIconEl.alt = data.current.condition.text;
            weatherIconEl.style.display = "block"; // Show image after fetching
        }

        isCelsius = true; // Reset to Celsius by default
        if (tempToggleButton) tempToggleButton.textContent = "Switch to °F";

        // Display the weather container if it was hidden
        const weatherDisplay = document.getElementById("weather-display");
        if (weatherDisplay) weatherDisplay.style.display = "block";
    }

    function toggleTemperature() {
        const tempDisplay = document.getElementById("city-temp");
        if (!tempDisplay || !tempDisplay.dataset.tempC || !tempDisplay.dataset.tempF) return;

        if (isCelsius) {
            tempDisplay.textContent = `${tempDisplay.dataset.tempF}°F`;
            tempToggleButton.textContent = "Switch to °C";
        } else {
            tempDisplay.textContent = `${tempDisplay.dataset.tempC}°C`;
            tempToggleButton.textContent = "Switch to °F";
        }
        isCelsius = !isCelsius;
    }
});
