'use strict';
window.addEventListener('load', () => {
    let long;
    let lat;

    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegreeDay = document.querySelector('.temperature-degree-day');
    let temperatureDegreeNight = document.querySelector('.temperature-degree-night');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature-section');
    const temperatureSpan = document.querySelector('.temperature-section span');

    let days = [];

    class Day {

        constructor(data, timezone) {
            this.name = this.getFullDay(data.time * 1000, timezone);
            this.fullName = this.getDayOfWeek(data.time * 1000, timezone);
            this.dayTemperature = Math.round(data.temperatureMax);
            this.nightTemperature = Math.round(data.temperatureMin);
        }

        static createDays(dailyData, timezone) {
            days = [];
            dailyData.forEach(element => {
                days.push(new Day(element, timezone));
            });
        }

        getFullDay(time, zone) {
            return moment(time).tz(zone).format('dddd, MMMM Do');
        }

        getDayOfWeek(time, zone) {
            return moment(time).tz(zone).format('ddd');
        }

    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/30babca7ccb92efe1f4309d7f1a58a79/${lat},${long}`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    
                    const { temperature, summary, icon } = data.currently;
                    const dailyData  = data.daily.data;

                    Day.createDays(dailyData, data.timezone);
                    
                    temperatureDegreeDay.textContent = temperature;
                    temperatureDegreeNight.textContent = temperature;
                    temperatureDescription.textContent = summary; 
                    locationTimezone.textContent = data.timezone;
                    
                    setIcon(icon, document.querySelector('.icon'));
                    
                    let celsius = (temperature - 32) * (5 / 9);
                    
                    temperatureSection.addEventListener('click', () => {
                        if (temperatureSpan.textContent == 'F') {
                            temperatureSpan.textContent = 'C';
                            temperatureDegreeDay.textContent = Math.floor(celsius);
                        } else {
                            temperatureSpan.textContent = 'F';
                            temperatureDegreeDay.textContent = temperature;
                            
                        }
                    });
                })
        });    
    }
    
    function setIcon(icon, iconID) {
        const skycons = new Skycons({"color": "white"});
        const currentIcon = icon.replace(/-/g, '_').toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon])
    }

});
