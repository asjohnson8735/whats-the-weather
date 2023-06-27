// Selecting elements from the DOM
const searchBtn = document.querySelector('#searchBtn'); // Search button
const cityInput = document.querySelector('#cityInput'); // City input field
const weatherDiv = document.querySelector('#weather'); // Weather container
const todaysDate = dayjs().format("ddd, MMM D"); // Current date
const todaysWeather = document.querySelector('#weatherData'); // Today's weather container
const daysLater = document.querySelectorAll(".daysLater"); // Weather forecast for upcoming days
const recentSearchesDiv = document.querySelector("#recentSearches"); // Recent searches container
let recentSearches = JSON.parse(localStorage.getItem("searches")) || []; // Array to store recent searches
const weatherIcon = document.querySelectorAll('.weatherIcon'); // Weather icons for forecast
const firstWeatherIcon = document.querySelector("#firstWeatherIcon"); // Weather icon for today's weather

// Function to fetch city data based on search query
function getCity(city) {
  const url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=30938dd6fcd531961e9f7d4e28342bde";
  let latitude, longitude;

  // Fetching city data
  fetch(url)
    .then(function(response) {
      if (!response.ok)
        console.log(response.status);
      else
        response.json().then(function(data) {
          latitude = data[0].lat;
          longitude = data[0].lon;
          getWeather(latitude, longitude); // Call function to fetch weather data
        });
    });
}

// Function to handle city search and fetch weather data
function getCityWeather(event) {
  event.preventDefault();
  let city = this.textContent;
  if (city === "Search")
    city = cityInput.value;
  getCity(city); // Call function to fetch city data
  renderSearch(city); // Call function to render recent searches
}

// Function to fetch weather data based on latitude and longitude
function getWeather(latitude, longitude) {
  const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=30938dd6fcd531961e9f7d4e28342bde&units=imperial";

  // Fetching weather data
  fetch(url)
    .then(function(response) {
      if (!response.ok)
        console.log(response.status);
      else
        response.json().then(function(data) {
          renderPage(data); // Call function to render weather data on the page
          console.log(data);
        });
    });
}

// Function to render weather data on the page
function renderPage(data) {
  // Updating today's weather information
  todaysWeather.children[0].textContent = data.city.name + "," + data.city.country;
  todaysWeather.children[1].textContent = todaysDate;
  todaysWeather.children[3].children[0].textContent = "temp: " + data.list[0].main.temp + "°F";
  todaysWeather.children[3].children[1].textContent = "wind: " + data.list[0].wind.speed + "mph";
  todaysWeather.children[3].children[2].textContent = "humidty: " + data.list[0].main.humidity + "%";
  firstWeatherIcon.src = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
  weatherDiv.setAttribute("class", "col");

  let hourIndex = 7;
  for (let i = 0; i < daysLater.length; i++) {
    daysLater[i].parentElement.children[0].textContent = dayjs().add(i + 1, "day").format('dddd');
    daysLater[i].parentElement.children[1].textContent = dayjs().add(i + 1, "day").format('MMM, D');
    daysLater[i].children[0].textContent = data.list[hourIndex].main.temp + "°F";
    daysLater[i].children[1].textContent = data.list[hourIndex].wind.speed + "mph";
    daysLater[i].children[2].textContent = data.list[hourIndex].main.humidity + "%";
    weatherIcon[i].src = "https://openweathermap.org/img/wn/"+data.list[hourIndex].weather[0].icon+"@2x.png"
        hourIndex+=8


    }
}
// Function to render recent searches and store them in local storage
function renderSearch(city){
    recentSearchesDiv.innerHTML=""; // Clearing the recent searches container

    // Checking if there are any previous searches stored in local storage
    if (localStorage.getItem("searches")==null) {
        if(city){
            recentSearches.push(city); // Adding the current city to the recent searches array
        }
        localStorage.setItem("searches", JSON.stringify(recentSearches)); // Storing the recent searches array in local storage
    } else {
        recentSearches = JSON.parse(localStorage.getItem("searches")); // Retrieving the recent searches array from local storage
        if(!recentSearches.includes(city)&& city){
            recentSearches.push(city); // Adding the current city to the recent searches array if it doesn't already exist
            localStorage.setItem("searches", JSON.stringify(recentSearches)); // Updating the recent searches array in local storage
        }
    }
      
    // Rendering each recent search as a clickable button
    for(let i=0;i<recentSearches.length;i++){
        let newSearch=document.createElement("li"); // Creating a new list item
        let newSearchClickable=document.createElement("button"); // Creating a new button
        newSearchClickable.innerHTML=recentSearches[i]; // Setting the button's text content to the recent search city
        newSearchClickable.addEventListener("click",getCityWeather); // Adding an event listener to the button
        newSearch.append(newSearchClickable); // Appending the button to the list item
        recentSearchesDiv.appendChild(newSearch); // Appending the list item to the recent searches container
    }
}

// Adding event listener to the search button
searchBtn.addEventListener("click", getCityWeather);

// Rendering the recent searches when the page loads
renderSearch(null);
