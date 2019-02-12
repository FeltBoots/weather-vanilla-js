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
        
        static attachIconNode(parent, width, height) {
            this.iconCanvas = document.createElement('canvas');
            this.iconCanvas.setAttribute('class', 'icon');
            this.iconCanvas.setAttribute('id', 'icon1'); // change it
            this.iconCanvas.setAttribute('width', width); 
            this.iconCanvas.setAttribute('height', height); 
            Utills.appendNodes(parent, this.iconCanvas);
        }
        
        static setIcon(icon, iconID, color="white") {
            const skycons = new Skycons({"color": color});
            const currentIcon = icon.replace(/-/g, '_').toUpperCase();
            skycons.play();
            skycons.set(iconID, Skycons[currentIcon]);
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

            this.dayNode = document.createElement('h2');
            
            Utills.attachIconNode.call(this, row, 64, 64);
            Utills.appendNodes(row, this.dayNode);
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

        get dayName() {
            return this.dayNode.textContent;
        }

        set dayName(value) {
            this.dayNode.textContent = value;
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

            this.dayNode = document.createElement('h2');
            
            Utills.appendNodes(section, this.locationNode);
            Utills.attachIconNode.call(this, section, 128, 128);
            Utills.appendNodes(section, this.dayNode);
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

        get dayName() {
            return this.dayNode.textContent;
        }

        set dayName(value) {
            this.dayNode.textContent = value;
        }
        
    }
    
    class Day {

        constructor(data, timezone) {
            this.time = data.time;
            this.zone = timezone;
        }

        static createDays(weekData, timezone) {
            const days = [];
            weekData.forEach(dayData => {
                days.push(new Day(dayData, timezone));
            });
            return days;
        }

        get fullDay() {
            return moment(this.time * 1000).tz(this.zone).format('dddd, MMMM Do');
        }

        get weekDay() {
            return moment(this.time * 1000).tz(this.zone).format('ddd');
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
            today.dayName = this.days[0].fullDay;
            
            const icon = data.icon;
            Utills.setIcon(icon, today.iconCanvas);
        }

        fillWeek(data) {
            data.forEach((dayData, i) => {
                const {temperatureMax, temperatureMin, icon} = dayData;
                const cardDay = this.week[i];
                cardDay.dayName = this.days[i].weekDay;

                Utills.setIcon(icon, cardDay.iconCanvas);
                
                cardDay.tempDay = temperatureMax;
                cardDay.tempNight = temperatureMin;

                cardDay.degreeSectionNode.addEventListener('click', () => {
                    if (cardDay.spanNode.textContent == 'F') { // Change to smt more interesting
                        cardDay.spanNode.textContent = 'C';
                        const celsius = value => (value - 32) * (5 / 9);
                        cardDay.tempDay = celsius(cardDay.tempDay);
                        cardDay.tempNight = celsius(cardDay.tempNight);
                    } else {
                        cardDay.spanNode.textContent = 'F';
                        cardDay.tempDay = temperatureMax;
                        cardDay.tempNight = temperatureMin;
                    }
                });   
            });
        }

        fillContent(data) {
            let weekData = data.daily.data;
            this.days = Day.createDays(weekData, data.timezone);
            this.fillToday(data.currently, data.timezone);
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
                    console.log(data);
                    manager.fillContent(data);
                    console.log(data);
                })
        });    
    }
});
