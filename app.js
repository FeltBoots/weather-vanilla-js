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
            if (!create) // To do not create nodes when we call super in TodayDescription constructor
                return;
            this.createCardNode(parent);
            this.atachEventOnTemperature();
        }
        
        createCardNode(parent) {
            /* row */
            this.temperatureSection = parent;
            this.row = document.createElement('div');
            this.row.classList.add('row');

            this.dayNode = document.createElement('h2');
            this.dayNode.classList.add('week-day');

            /* degree-section */
            this.degreeSectionNode = document.createElement('div');
            this.degreeSectionNode.classList.add('degree-section');
            
            this.tempDayNode = document.createElement('h2');
            this.tempDayNode.classList.add('temperature-degree-day');
            this.tempNightNode = document.createElement('h2');
            this.tempNightNode.classList.add('temperature-degree-night');
            
            Utills.appendNodes(this.degreeSectionNode, this.tempDayNode, this.tempNightNode);

            /* temperature-description */
            // this.tempDescriptionNode = document.createElement('h2');
            // this.tempDescriptionNode.classList.add('temperature-description');
            
            Utills.attachIconNode.call(this, this.row, 64, 64);
            Utills.appendNodes(this.row, this.dayNode);
            Utills.appendNodes(this.row, this.degreeSectionNode);
            // Utills.appendNodes(this.row, this.tempDescriptionNode);
            Utills.appendNodes(parent, this.row);
        }

        static create(parent, count) {
            const tempSection = document.createElement('div');
            tempSection.classList.add('temperature-section', 'visibility-false');
            const week = [];
            for (let i = 0; i < count; i++) 
                week.push(new Card(tempSection));
            Utills.appendNodes(parent, tempSection);
            return week;
        }

        animateIn() {
            this.temperatureSection.classList.remove('visibility-false');
            this.temperatureSection.classList.add('visibility-true');
            this.row.classList.add('agent-2');
            this.tempNightNode.classList.add('deg-far');
            this.tempDayNode.classList.add('deg-far');
        }

        animateOut() {
            this.temperatureSection.classList.remove('visibility-true');
            this.temperatureSection.classList.add('visibility-false');
            this.row.classList.remove('agent-2');
            this.tempNightNode.classList.remove('deg-far');
            this.tempDayNode.classList.remove('deg-far');
        }

        atachEventOnTemperature() {
            const node = this.degreeSectionNode;
            node.addEventListener('click', () => {
                console.log('click');
                const node = this.tempDayNode;
                const nodeNight = this.tempNightNode;
                if (node.classList.contains('deg-far')) {
                    node.classList.remove('deg-far');
                    nodeNight.classList.remove('deg-far');
                    node.classList.add('deg-cel');
                    nodeNight.classList.add('deg-cel');
                    const celsius = value => (value - 32) * (5 / 9);
                    this.tempDay = celsius(this.tempDay);
                    this.tempNight = celsius(this.tempNight);
                } else {
                    console.log('netu');
                    node.classList.remove('deg-cel');
                    nodeNight.classList.remove('deg-cel');
                    node.classList.add('deg-far');
                    nodeNight.classList.add('deg-far');
                    this.tempDay = this.fixTempDay;
                    this.tempNight = this.fixTempNight;
                }
            });
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
            this.timezone = '';
        }
        
        createCardNode(parent) {            
            /* timezone-description */
            this.timezoneDescriptionNode = document.createElement('div');
            this.timezoneDescriptionNode.classList.add('timezone-description');
            
            this.locationNode = document.createElement('h1');
            this.locationNode.classList.add('location-timezone');
            
            this.dayNode = document.createElement('h2');  

            this.dayTemperature = document.createElement('h3');

            this.weatherDescription = document.createElement('h4');

            Utills.appendNodes(this.timezoneDescriptionNode,
                this.locationNode,
                this.dayNode,
                this.dayTemperature,
                this.weatherDescription,
            )

            /* day-description */
            this.dayDescriptionNode = document.createElement('div');
            this.dayDescriptionNode.classList.add('day-description');

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

            Utills.appendNodes(this.dayDescriptionNode,
                descFirst,
                descSecond,
            )

            /* location section */
            this.locationSection = document.createElement('div');
            this.locationSection.classList.add('location-section', 'visibility-false');

            Utills.appendNodes(this.locationSection, this.timezoneDescriptionNode);
            Utills.attachIconNode.call(this, this.locationSection, 128, 128);
            Utills.appendNodes(this.locationSection, this.dayDescriptionNode);
            Utills.appendNodes(parent, this.locationSection);            
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

        animateIn() {
            this.locationSection.classList.remove('visibility-false');
            this.locationSection.classList.add('visibility-true');
            this.timezoneDescriptionNode.classList.add('agent-1');
            this.iconCanvas.classList.add('agent-3');
            this.dayDescriptionNode.classList.add('agent-2');
            this.dayTemperature.classList.add('deg-far');
        }

        animateOut() {
            this.locationSection.classList.remove('visibility-true');
            this.locationSection.classList.add('visibility-false');
            this.timezoneDescriptionNode.classList.remove('agent-1');
            this.iconCanvas.classList.remove('agent-3');
            this.dayDescriptionNode.classList.remove('agent-2');
            this.dayTemperature.classList.remove('deg-far');
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
            this.windNode.innerHTML = `Wind: <span>${value} kph</span>`;
        }

        set sunrise(sunriseTime) {
            const time = Utills.getTimeStamp(sunriseTime * 1000, this.timezone);
            this.sunsetNode.innerHTML = `Sunset: <span>${time}</span>`;
        }

        set sunset(sunetTime) {
            const time = Utills.getTimeStamp(sunetTime * 1000, this.timezone);
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

            this.inputContainerNode = document.createElement('input-wrapper');
            this.inputContainerNode.classList.add('input-container', 'input-borders');

            this.inputSearchNode = document.createElement('input');
            this.inputSearchNode.setAttribute('type', 'search');
            this.inputSearchNode.setAttribute('placeholder', 'Enter the name of the city');
            this.inputSearchNode.classList.add('search-input', 'input-borders');
            
            this.inputSubmitNode = document.createElement('input');
            this.inputSubmitNode.setAttribute('type', 'submit');
            this.inputSubmitNode.setAttribute('value', 'Search');

            Utills.appendNodes(this.inputContainerNode,
                this.inputSearchNode,
                // this.inputSubmitNode,
            )
            Utills.appendNodes(inputSectionNode, this.inputContainerNode)
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
            this.days = [];
            this.address = '';
        }

        fillToday(data) {
            const today = this.description;
            today.cityLocation = this.description.cityLocation;
            today.timezone = this.timezone;
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

            today.animateIn();
        }

        fillWeek(data) {
            data.forEach((dayData, i) => {
                const {temperatureMax, temperatureMin, icon, summary} = dayData;
                const cardDay = this.week[i];
                cardDay.dayName = this.days[i].weekDay;

                Utills.setIcon(icon, cardDay.iconCanvas);
                
                cardDay.tempDay = temperatureMax;
                cardDay.tempNight = temperatureMin;
                cardDay.fixTempDay = temperatureMax;
                cardDay.fixTempNight = temperatureMin;

                cardDay.dayNode.addEventListener('click', () => {
                    this.fillToday(dayData);
                });

                cardDay.animateIn();
            });
        }

        fillContent(data) {
            let weekData = data.daily.data;
            this.timezone = data.timezone;
            this.days = Day.createDays(weekData, this.timezone);
            this.fillToday(weekData[0]);
            this.fillWeek(weekData);
        }

        updateCity(value) {
            this.description.cityLocation = value;
        }

        animateOut() {
            this.description.animateOut();
            this.week.forEach(day => {
                day.animateOut();
            });
        }

    }

    class ConnectApiError extends Error {
        constructor(...args) {
            super(...args)
            Error.captureStackTrace(this, ConnectApiError)
        }
    }

    class ParseError extends Error {
        constructor(...args) {
            super(...args)
            Error.captureStackTrace(this, ConnectApiError)
        }
    }

    class InternarLogicError extends Error {
        constructor(...args) {
            super(...args)
            Error.captureStackTrace(this, ConnectApiError)
        }
    }

    class Connector {
        
        constructor() {
            /* generate DOM structure and attach events */
            this.manager = new Manager();

            /* set api keys and proxy*/
            this.googleMapAPIKey = 'AIzaSyDoYhVFl3m0T8SLmWdFxHZDOLiw7nMvg_M';
            this.darkSkyAPIKey = '30babca7ccb92efe1f4309d7f1a58a79';
            this.proxy = 'https://cors-anywhere.herokuapp.com/';
            
            /* init input autocomplite */
            this.initInputAutocomplite();
            
            /* request current location */
            this.getCurrentWeather();
        }

        updateApiDarkSky(value) {
            this.apiDarkSky = 
                `${this.proxy}https://api.darksky.net/forecast/${this.darkSkyAPIKey}/${value.lat},${value.lng}`
        }

        updateApiGoogleMaps(value) {
            this.apiGoogleMaps =
                `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${this.googleMapAPIKey}`;
        }

        updateAddress(value) {
            this.manager.updateCity(value);
        }

        showError(error) {
            if (!this.errorMessage) {
                this.errorMessage = document.createElement('div');
                this.errorMessage.classList.add('isa-error');
                container.appendChild(this.errorMessage);
            }
            this.errorMessage.textContent = 
                `${error.message}\nPlease contact to developers in description below and have a nice day :)`;
        }

        makeRequest() {
            fetch(this.apiGoogleMaps)
                .then(response => {
                    if (response.ok)
                        return response.json();
                    throw new ConnectApiError('Sorry, it seems like Google Maps do not response.');
                })
                .then(data => {
                    if (!data)
                        throw new ParseError('Sorry, it seems like data from Google Maps is not available.');
                    this.updateApiDarkSky(data.results[0].geometry.location);
                    this.currentAddress = data.results[0].address_components[0].long_name;
                    return fetch(this.apiDarkSky);
                })
                .then(response => {
                    if (response.ok)
                        return response.json();
                    throw new ConnectApiError('Sorry, it seems like DarkSky do not response.');
                })
                .then(data => {
                    if (!data)
                        throw new ParseError('Sorry, it seems like data from DarkSky is not available.');
                    try {
                        this.manager.fillContent(data);
                        this.updateAddress(this.currentAddress);
                    } catch(error) {
                        throw new InternarLogicError('Sorry, it seems like some internal error happened.');
                    }
                })      
                .catch(error => {
                    this.showError(error);
                });
        }   

        initInputAutocomplite() {
            const fillInAddress = () => {
                this.manager.animateOut();
                let place = this.autocomplite.getPlace();
                this.updateApiGoogleMaps(place.formatted_address);
                this.makeRequest();
            }

            let input = document.querySelector('.search-input');
            this.autocomplite = new google.maps.places.Autocomplete(input);
            this.autocomplite.addListener('place_changed', fillInAddress);
            
            let inputForm = document.querySelector('.input-container');
            inputForm.addEventListener('submit', e => {
                e.preventDefault();
            });
        }

        getCurrentWeather() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    let long = position.coords.longitude;
                    let lat = position.coords.latitude;
                    this.updateApiDarkSky({lat : lat, lng: long });
                    fetch(this.apiDarkSky)
                        .then(response => {
                            if (response.ok)
                                return response.json();
                            throw new ConnectApiError('Sorry, it seems like DarkSky do not response.');
                        })
                        .then(data => {
                            if (!data)
                                throw new ParseError('Sorry, it seems like data from DarkSky is not available.');
                            try {
                                this.manager.fillContent(data);
                                this.updateAddress(data.timezone);
                            } catch(error) {
                                throw new InternarLogicError('Sorry, it seems like some internal error happened.');
                            }
                        })
                        .catch(error => {
                            this.showError(error);
                        });
                });    
            }
        }

        static create() {
            new Connector();
        }
        
    }

    /* start */
    Connector.create();
});