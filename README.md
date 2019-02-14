# Weather vanilla js

Responsive weather application using modern javascript, flex-boxes, media queries, css animations, Google Maps Geocoding, Google Places and Dark Sky.

In build folder you can find transpiled and minimized JavaScript CSS. Demo site uses it.

Try out demo https://weather-vanilla-js.herokuapp.com/index.html

![example image of the project](https://github.com/FeltBoots/weather-vanilla-js/blob/master/resources/example.png)

## Features

* Basically, you can allow browser to serve your location or tap the city you interested for
* Then, you can click to week days to see detailed description of the certain day
* Also you can tap on temperature to change it from degrees Fahrenheit to degrees Celsius
* If something goes wrong you will see red box with error message inside
* Try it out on different screen sizes

## Getting Started

``` bash
# clone repo
git clone https://github.com/FeltBoots/weather-vanilla-js.git
```

## API

This project uses [Dark Sky API](https://darksky.net/dev/) and [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key)
It fetches geolocation data from Google and weather data from Dark Sky and returns it to the application.

## Setup

Rename **googleMapAPIKey** and **darkSkyAPIKey** in constructor of the class **Connector** to yours 
[Dark Sky API](https://darksky.net/dev/) and [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key) keys.

***Make sure*** that your browser supports `EcmaScript6+` standard of JavaScript. 
If it do not than use [Babel](https://babeljs.io/) to transpile your code to `EcmaScript5` version.

## Built With
* [ES6](https://www.ecma-international.org/ecma-262/6.0/)
* [Dark Sky API](https://darksky.net/dev/)
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key)
* [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key)
* [Google Places API](https://developers.google.com/places/web-service/autocomplete)

Also it uses open-source libraries for correct displaying HTML5 elements and make CSS3 media queries work on different browsers

## License 
This project is licensed under the MIT License - see the LICENSE file for details