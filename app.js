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

        static getPercentage(value) {
            return Math.round(value * 100);
        }

        static getWeekDay(time, zone) {
            return moment(time * 1000).tz(zone).format('ddd');
        }

        static getTimeStamp(time, zone) {
            return moment(time).tz(zone).format('h:mm A');
        }

        static getDate(time, zone) {
            return moment(time * 1000).tz(zone).format('dddd, MMMM Do');
        }

    }
    
    class Card {
	
        constructor(parent, create=true) {
            if (create)
                this.createCardNode(parent);
        }
        
        createCardNode(parent) {
            /* row */
            let row = document.createElement('div');
            row.classList.add('row');

            this.dayNode = document.createElement('h2');
            this.dayNode.classList.add('week-day');

            /* degree-section */
            this.degreeSectionNode = document.createElement('div');
            this.degreeSectionNode.classList.add('degree-section');
            
            this.tempDayNode = document.createElement('h2');
            this.tempDayNode.classList.add('temperature-degree-day', 'deg-far');
            this.tempNightNode = document.createElement('h2');
            this.tempNightNode.classList.add('temperature-degree-night', 'deg-far');
            
            Utills.appendNodes(this.degreeSectionNode, this.tempDayNode, this.tempNightNode);

            /* temperature-description */
            this.tempDescriptionNode = document.createElement('h2');
            this.tempDescriptionNode.classList.add('temperature-description');
            
            Utills.attachIconNode.call(this, row, 64, 64);
            Utills.appendNodes(row, this.dayNode);
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

        set description(value) {
            this.tempDescriptionNode.textContent = value;
        }
    
    }
    
    class TodayDescription extends Card {
        
        constructor(parentNode) {        
            super(null, false);
            this.createCardNode(parentNode);
            this.atachEventOnTemperature();
        }
        
        createCardNode(parent) {            
            /* timezone-description */
            let timezoneDescription = document.createElement('div');
            timezoneDescription.classList.add('timezone-description');
            
            this.locationNode = document.createElement('h1');
            this.locationNode.classList.add('location-timezone');
            
            this.dayNode = document.createElement('h2');  

            this.dayTemperature = document.createElement('h3');
            this.dayTemperature.classList.add('deg-far');

            this.weatherDescription = document.createElement('h4');

            Utills.appendNodes(timezoneDescription,
                this.locationNode,
                this.dayNode,
                this.dayTemperature,
                this.weatherDescription,
            )

            /* day-description */
            let dayDescription = document.createElement('div');
            dayDescription.classList.add('day-description');

            let descFirst = document.createElement('ul');
            descFirst.classList.add('desc-first');
            
            let descSecond = document.createElement('ul');
            descSecond.classList.add('desc-second');

            this.precipitationNode = document.createElement('li');
            this.humidityNode = document.createElement('li');
            this.windNode = document.createElement('li');
            this.cloudCoverageNode = document.createElement('li');
            this.sunriseNode = document.createElement('li');
            this.dewPointNode = document.createElement('li');
            this.visibilityNode = document.createElement('li');
            this.sunsetNode = document.createElement('li');

            Utills.appendNodes(descFirst,
                this.sunriseNode,
                this.precipitationNode,
                this.humidityNode,
                this.windNode,
            )

            Utills.appendNodes(descSecond,
                this.sunsetNode,
                this.cloudCoverageNode,
                this.dewPointNode,
                this.visibilityNode,       
            )

            Utills.appendNodes(dayDescription,
                descFirst,
                descSecond,
            )

            /* location section */
            let locationSection = document.createElement('div');
            locationSection.classList.add('location-section');

            Utills.appendNodes(locationSection, timezoneDescription);
            Utills.attachIconNode.call(this, locationSection, 128, 128);
            Utills.appendNodes(locationSection, dayDescription);
            Utills.appendNodes(parent, locationSection);            
        }

        atachEventOnTemperature() {
            const node = this.dayTemperature;
            node.addEventListener('click', () => {
                if (node.classList.contains('deg-far')) {
                    node.classList.remove('deg-far');
                    node.classList.add('deg-cel');
                    this.temperature = (this.temperatureFer - 32) * (5 / 9);
                } else {
                    node.classList.remove('deg-cel');
                    node.classList.add('deg-far');
                    this.temperature = this.temperatureFer;
                }
            });
        }

        static create() {
            return new TodayDescription(container);
        }

        get cityLocation() {
            return this.locationNode.textContent;
        }
           
        set cityLocation(value) {
            this.locationNode.textContent = value;
        }

        set precipitation(value) {
            this.precipitationNode.innerHTML = 
                `Precipitation: <span>${Utills.getPercentage(value)}%</span>`;
        }

        set humidity(value) {
            this.humidityNode.innerHTML = 
                `Humidity: <span>${Utills.getPercentage(value)}%</span>`;
        }

        set wind(value) {
            this.windNode.innerHTML = `Wind: <span>${value} mph</span>`;
        }

        set sunrise(sunriseTime) {
            const time = Utills.getTimeStamp(sunriseTime * 1000, this.cityLocation);
            this.sunsetNode.innerHTML = `Sunset: <span>${time}</span>`;
        }

        set sunset(sunetTime) {
            const time = Utills.getTimeStamp(sunetTime * 1000, this.cityLocation);
            this.sunriseNode.innerHTML = `Sunrise: <span>${time}</span>`;
        }

        set cloudCoverage(value) {
            this.dewPointNode.innerHTML = 
                `Cloud Coverage: <span>${Utills.getPercentage(value)}%</span>`;
        }

        set dewPoint(value) {
            this.cloudCoverageNode.innerHTML = 
                `Dew Point: <span>${Math.round(value)}° F</span>`;
        }

        set visibility(value) {
            this.visibilityNode.innerHTML = 
                `Visibility: <span>${Math.round(value)} miles</span>`;
        }

        set description(value) {
            this.weatherDescription.textContent = value;
        }

        set temperature(value) {
            this.dayTemperature.textContent = Math.round(value);
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
            return Utills.getDate(this.time, this.zone);
        }

        get weekDay() {
            return Utills.getWeekDay(this.time, this.zone);
        }

    }

    class Input {
        
        constructor(parent) {
            this.createCardNode(parent);
        }

        createCardNode(parent) {
            /* input section*/
            let inputSectionNode = document.createElement('div');
            inputSectionNode.classList.add('input-section');

            this.formNode = document.createElement('form');
            this.formNode.classList.add('flex-form');

            this.inputSearchNode = document.createElement('input');
            this.inputSearchNode.setAttribute('type', 'search');
            this.inputSearchNode.setAttribute('placeholder', 'Enter the name of the city');
            this.inputSearchNode.classList.add('searchInput');
            
            this.inputSubmitNode = document.createElement('input');
            this.inputSubmitNode.setAttribute('type', 'submit');
            this.inputSubmitNode.setAttribute('value', 'Search');

            Utills.appendNodes(this.formNode,
                this.inputSearchNode,
                this.inputSubmitNode,
            )
            Utills.appendNodes(inputSectionNode, this.formNode)
            Utills.appendNodes(parent, inputSectionNode);
        }
        
        static create() {
            return new Input(container);
        }
    }
    class Manager {
        
        constructor() {
            this.input = Input.create(container);
            this.description = TodayDescription.create(container);
            this.week = Card.create(container, 8);
            this.location = {
                long : 0,
                lat : 0,
            }
            this.days = [];
        }

        fillToday(data) {
            const today = this.description;
            today.cityLocation = this.timezone;
            today.dayName = this.days[0].fullDay;

            today.precipitation = data.precipProbability;
            today.sunrise = data.sunriseTime;
            today.humidity = data.humidity;
            today.wind = data.windSpeed;
            today.sunset = data.sunsetTime;
            today.cloudCoverage = data.cloudCover;
            today.dewPoint = data.dewPoint;
            today.visibility = data.visibility;
            today.description = data.summary;
            today.temperature = Math.round(data.temperatureMax);
            today.temperatureFer = Math.round(data.temperatureMax);
            
            const icon = data.icon;
            Utills.setIcon(icon, today.iconCanvas);
        }

        fillWeek(data) {
            data.forEach((dayData, i) => {
                const {temperatureMax, temperatureMin, icon, summary} = dayData;
                const cardDay = this.week[i];
                cardDay.dayName = this.days[i].weekDay;

                Utills.setIcon(icon, cardDay.iconCanvas);
                
                cardDay.tempDay = temperatureMax;
                cardDay.tempNight = temperatureMin;
                cardDay.description = summary;

                cardDay.dayNode.addEventListener('click', () => {
                    this.fillToday(dayData);
                });

                cardDay.degreeSectionNode.addEventListener('click', () => {
                    const node = cardDay.tempDayNode;
                    if (node.classList.contains('deg-far')) {
                        node.classList.remove('deg-far');
                        node.classList.add('deg-cel');
                        const celsius = value => (value - 32) * (5 / 9);
                        cardDay.tempDay = celsius(cardDay.tempDay);
                        cardDay.tempNight = celsius(cardDay.tempNight);
                    } else {
                        node.classList.remove('deg-cel');
                        node.classList.add('deg-far');
                        cardDay.tempDay = temperatureMax;
                        cardDay.tempNight = temperatureMin;
                    }
                });   
            });
        }

        fillContent(data) {
            let weekData = data.daily.data;
            this.timezone = data.timezone;
            // this.currentTemperature = Math.round(data.currently.temperature);
            this.days = Day.createDays(weekData, this.timezone);
            this.fillToday(weekData[0]);
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
                })
        });    
    }

    let initMap = () => {
        let input = document.querySelector('.searchInput');
        let autocomplite = new google.maps.places.Autocomplete(input);
        console.log(autocomplite);
    }

    initMap();
});

/* AIzaSyDoYhVFl3m0T8SLmWdFxHZDOLiw7nMvg_M */