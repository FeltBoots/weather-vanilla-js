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
            let row = document.createElement('div');
            row.classList.add('row');
            
            this.degreeSectionNode = document.createElement('div');
            this.degreeSectionNode.classList.add('degree-section');
            
            this.tempDayNode = document.createElement('h2');
            this.tempDayNode.classList.add('temperature-degree-day');
    
            this.tempNightNode = document.createElement('h2');
            this.tempNightNode.classList.add('temperature-degree-night');
            
            this.spanNode = document.createElement('span');
            this.spanNode.textContent = 'F'; // Default value

            this.tempDescriptionNode = document.createElement('div');
            this.tempDescriptionNode.classList.add('temperature-description');
            
            Utills.appendNodes(this.degreeSectionNode, this.tempDayNode, this.tempNightNode, this.spanNode);
            Utills.appendNodes(row, this.degreeSectionNode);
            Utills.appendNodes(row, this.tempDescriptionNode);
            Utills.appendNodes(parent, row);
        }

        static create(parent, count) {
            const tempSection = document.createElement('div');
            tempSection.classList.add('temperature-section');
            const week = [];
            for (let i = 0; i < count; i++) 
                week.push(new Card(tempSection));
            Utills.appendNodes(parent, tempSection);
            return week;
        }
        
        get tempDay() {
            return this.tempDayNode.textContent;
        }
    
        set tempDay(value) {
            this.tempDayNode.textContent = Math.round(value);
        }
        
        get tempNight() {
            return this.tempNightNode.textContent;
        }
        
        set tempNight(value) {
            this.tempNightNode.textContent = Math.round(value);
        }
    
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
            const days = [];
            dailyData.forEach(element => {
                days.push(new Day(element, timezone));
            });
            return days;
        }

        getFullDay(time, zone) {
            return moment(time).tz(zone).format('dddd, MMMM Do');
        }

        getDayOfWeek(time, zone) {
            return moment(time).tz(zone).format('ddd');
        }

    }
    class Manager {
        
        constructor() {
            this.description = TodayDescription.create(container);
            this.week = Card.create(container, 8);
            this.location = {
                long : 0,
                lat : 0,
            }
            this.days = [];
        }

        fillToday(data, timezone) {
            const today = this.description;
            today.location = timezone;
        }

        fillWeek(data) {
            data.forEach((dayData, i) => {
                const {temperatureMax, temperatureMin} = dayData;
                const day = this.week[i];
                
                day.tempDay = temperatureMax;
                day.tempNight = temperatureMin;

                day.degreeSectionNode.addEventListener('click', () => {
                    if (day.spanNode.textContent == 'F') { // Change to smt more interesting
                        day.spanNode.textContent = 'C';
                        const celsius = value => (value - 32) * (5 / 9);
                        day.tempDay = celsius(day.tempDay);
                        day.tempNight = celsius(day.tempNight);
                    } else {
                        day.spanNode.textContent = 'F';
                        day.tempDay = temperatureMax;
                        day.tempNight = temperatureMin;
                    }
                });   
            });
        }

        fillContent(data) {
            this.fillToday(data.currently, data.timezone);
            
            let weekData = data.daily.data;
            this.days = Day.createDays(weekData, data.timezone);
            
            this.fillWeek(weekData);
        }

        setLocation(long, lat) {
            location.long = long;
            location.lat = lat;
        }
    }

    const manager = new Manager();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let long = position.coords.longitude;
            let lat = position.coords.latitude;
            manager.setLocation(long, lat);

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/30babca7ccb92efe1f4309d7f1a58a79/${lat},${long}`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    manager.fillContent(data);
                    console.log(data);
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
