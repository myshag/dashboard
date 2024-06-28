

        function getWeatherIcon(weatherCode) {
            const iconMap = {
                0: "./weather-icons-master/svg/wi-day-sunny.svg", // Clear sky
                1: "./weather-icons-master/svg/wi-day-sunny-overcast.svg", // Mainly clear
                2: "./weather-icons-master/svg/wi-day-cloudy.svg", // Partly cloudy
                3: "./weather-icons-master/svg/wi-cloudy.svg", // Overcast
                45: "./weather-icons-master/svg/wi-fog.svg", // Fog
                48: "./weather-icons-master/svg/wi-fog.svg", // Depositing rime fog
                51: "./weather-icons-master/svg/wi-sprinkle.svg", // Drizzle: Light
                53: "./weather-icons-master/svg/wi-showers.svg", // Drizzle: Moderate
                55: "./weather-icons-master/svg/wi-rain.svg", // Drizzle: Dense
                56: "./weather-icons-master/svg/wi-rain-mix.svg", // Freezing Drizzle: Light
                57: "./weather-icons-master/svg/wi-rain-wind.svg", // Freezing Drizzle: Dense
                61: "./weather-icons-master/svg/wi-rain.svg", // Rain: Slight
                63: "./weather-icons-master/svg/wi-rain.svg", // Rain: Moderate
                65: "./weather-icons-master/svg/wi-rain.svg", // Rain: Heavy
                66: "./weather-icons-master/svg/wi-rain-mix.svg", // Freezing Rain: Light
                67: "./weather-icons-master/svg/wi-rain-wind.svg", // Freezing Rain: Heavy
                71: "./weather-icons-master/svg/wi-snow.svg", // Snow fall: Slight
                73: "./weather-icons-master/svg/wi-snow.svg", // Snow fall: Moderate
                75: "./weather-icons-master/svg/wi-snow.svg", // Snow fall: Heavy
                77: "./weather-icons-master/svg/wi-snow.svg", // Snow grains
                80: "./weather-icons-master/svg/wi-showers.svg", // Rain showers: Slight
                81: "./weather-icons-master/svg/wi-rain.svg", // Rain showers: Moderate
                82: "./weather-icons-master/svg/wi-rain.svg", // Rain showers: Violent
                85: "./weather-icons-master/svg/wi-snow.svg", // Snow showers slight
                86: "./weather-icons-master/svg/wi-snow.svg", // Snow showers heavy
                95: "./weather-icons-master/svg/wi-thunderstorm.svg", // Thunderstorm: Slight or moderate
                96: "./weather-icons-master/svg/wi-thunderstorm.svg", // Thunderstorm with slight hail
                99: "./weather-icons-master/svg/wi-thunderstorm.svg", // Thunderstorm with heavy hail
            };

            return iconMap[weatherCode] || "./weather-icons-master/svg/wi-na.svg"; // Default icon for unknown codes
        }
       


        function getWeather(lon, lat) {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,cloud_cover,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America%2FNew_York&forecast_days=8`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    
                    const currentWeather = data.hourly;
                    const dailyWeather = data.daily;

                    $("#temperature").text(currentWeather.temperature_2m[0]);
                    $("#relative_humidity").text(currentWeather.relative_humidity_2m[0]);
                    $("#dew_point").text(currentWeather.dew_point_2m[0]);
                    $("#apparent_temperature").text(currentWeather.apparent_temperature[0]);
                    $("#precipitation_probability").text(currentWeather.precipitation_probability[0]);
                    $("#precipitation").text(currentWeather.precipitation[0]);
                    $("#rain").text(currentWeather.rain[0]);
                    $("#cloud_cover").text(currentWeather.cloud_cover[0]);
                    $("#visibility").text(currentWeather.visibility[0] / 1000);
                    $("#wind_speed").text(currentWeather.wind_speed_10m[0]);

                    // Get daily values from the first entry in the daily array
                    $("#max_temp").text(dailyWeather.temperature_2m_max[0]);
                    $("#min_temp").text(dailyWeather.temperature_2m_min[0]);
                    const sunriseTime = new Date(dailyWeather.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const sunsetTime = new Date(dailyWeather.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    $("#sunrise").text(sunriseTime);
                    $("#sunset").text(sunsetTime);

                    // Update forecast items
                    for (let i = 0; i < dailyWeather.temperature_2m_max.length; i++) {
                        //const weatherCode = dailyWeather.weathercode[i];
                        weatherCode = dailyWeather.weather_code[i];
                        const weatherIcon = getWeatherIcon(weatherCode);
                        $(`#day_${i}`).text(new Date(dailyWeather.time[i]).toLocaleDateString('en-US', { weekday: 'long' }));
                        $(`#max_temp_${i}`).text(dailyWeather.temperature_2m_max[i]);
                        $(`#min_temp_${i}`).text(dailyWeather.temperature_2m_min[i]);
                        $(`#icon_${i}`).attr("src", weatherIcon);
                    }
                })
                .catch(error => console.error('Error:', error));

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(timezone);
        }

        $(document).ready(function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lon = position.coords.longitude;
                    const lat = position.coords.latitude;

                    getWeather(lon, lat);
                });
            }
        });
