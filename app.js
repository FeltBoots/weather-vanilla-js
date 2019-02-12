'use strict';
window.addEventListener('load', () => {
    const container = document.querySelector('.weather-js');
    if (!container)
        return;

    class Utills {
        static appendNodes(parent, ...childs) {
            childs.forEach(child => {
                parent.appendChild(child);
            });
        }
    }
    
    class Card {
	
        constructor(parent) {
            this.createCardNode(parent);
        }
        
        createCardNode(parent) {
            let degreeSection = document.createElement('div');
            degreeSection.classList.add('degree-section');
            
            this.tempDayNode = document.createElement('h2');
            this.tempDayNode.classList.add('temperature-degree-day');
    
            this.tempNightNode = document.createElement('h2');
            this.tempNightNode.classList.add('temperature-degree-night');
            
            let span = document.createElement('span');
            
            Utills.appendNodes(degreeSection, this.tempDayNode, this.tempNightNode, span);
            Utills.appendNodes(parent, degreeSection);
        }

        static create(parent, count) {
            const tempSection = document.createElement('div');
            tempSection.classList.add('temperature-section');
            const week = [];
            for (let i = 0; i < count; i++) 
                week.push(new Card(tempSection));
            Utills.appendNodes(parent, tempSection);
        }
        
        get tempDay() {}
    
        set tempDay(value) {}
        
        get tempNight() {}
        
        set tempNigth(value) {}
    
    }
    
    class TodayDescription {
        
        constructor(parentNode) {        
            this.createDescriptionNode(parentNode);
        }
        
        createDescriptionNode(parent) {
            let section = document.createElement('div');
            section.classList.add('location-section');
            
            this.locationNode = document.createElement('h1');
            this.locationNode.classList.add('location-timezone');
            
            this.iconCanvas = document.createElement('canvas');
            this.iconCanvas.setAttribute("class", "icon");
            this.iconCanvas.setAttribute("id", "icon1"); // change it
            this.iconCanvas.setAttribute("width", "128"); 
            this.iconCanvas.setAttribute("height", "128"); 
            
            Utills.appendNodes(section, this.locationNode, this.iconCanvas);
            Utills.appendNodes(parent, section);
        }

        static create() {
            return new TodayDescription(container);
        }
        
        get location() {
            return this.locationNode.textContent;
        }
           
        set location(value) {
            this.locationNode.textContent = value;
        }
        
    }
    
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
    
    const description = TodayDescription.create(container);
    const week = Card.create(container, 8);
    console.log(week);

    const location = {
        long : 0,
        lat : 0,
    }

    let days = [];

    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegreeDay = document.querySelector('.temperature-degree-day');
    let temperatureDegreeNight = document.querySelector('.temperature-degree-night');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature-section');
    const temperatureSpan = document.querySelector('.temperature-section span');

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
