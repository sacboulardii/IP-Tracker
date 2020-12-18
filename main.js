/* Getting Elementos from DOM */

const inputIP = document.querySelector('#ip');
const button = document.querySelector('#button');

const ipAddress = document.querySelector('#ip-address');
const ipLocation = document.querySelector('#location');
const ipTimezone = document.querySelector('#timezone');
const isp = document.querySelector('#isp');

const results = document.querySelector('.result');
const spinner = document.querySelector('.spinner');
const error = document.querySelector('.error-message');

const allInfoBlocks = Array.from(document.querySelectorAll('.result__info-block'));

let loading


// Get User IP
const getUserIp = async () => {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    return data;
}

// Toggle Spinner
const toggleSpinner = () => {
    !loading ? loading = true: loading = false;
    spinner.classList.toggle('hide');
    allInfoBlocks.map(info => info.classList.toggle('hide'))
    results.classList.toggle('loading');
}


// Get User IP Location
 const getLocation = async (ipAddress) => {
     let response;
    
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipAddress)) {
        response = await fetch('https://geo.ipify.org/api/v1?apiKey=at_ys9yahx7DWOJ9RalppnnOjGe2XVkI&ipAddress=' + ipAddress);

    } else {
        response = await fetch('https://geo.ipify.org/api/v1?apiKey=at_ys9yahx7DWOJ9RalppnnOjGe2XVkI&domain=' + ipAddress);
    }

    if (response.status !== 200) {
        throw new Error('Invalid IP Address');
    }

    const data = await response.json()
    return data;
 } 

// Fill user info results
function fillInfo(data) {
    let loc = data['location'];
    ipAddress.textContent = `${data['ip']}`;
    ipLocation.textContent = `${loc['region']}, ${loc['country']} ${loc['postalCode'] !== '' ? loc['postalCode']: ''}`;
    ipTimezone.textContent = `UTC ${loc['timezone']}`;
    isp.textContent = `${data['isp']}`;
}

// Receives a data object from ipify API and updates the Map
function updateMap(data) {
    let lat = data['location']['lat'];
    let lng = data['location']['lng'];

    mymap.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]);
}

// If some error occurs, reset fields
function resetFields() {
    ipAddress.textContent = '--';
    ipLocation.textContent = '--';
    ipTimezone.textContent = '--';
    isp.textContent = '--';
}

function toggleError(bool) {

    if (!bool && !error.classList.contains('hide')) {
        error.classList.toggle('hide');
        results.classList.add('moveBack');
        results.classList.remove('moveAway');

    } else if (bool && error.classList.contains('hide')) {
        error.classList.toggle('hide');
        results.classList.add('moveAway');
        results.classList.remove('moveBack');
    }
}

// Receives an IP Address from ipify API or user input
function updateUserLocation(ipAddress) {
    if (!loading) toggleSpinner();
    getLocation(ipAddress)
    .then(data => {
        toggleSpinner();
        toggleError(false);
        fillInfo(data);
        updateMap(data);
        return data;
    })
    .catch(e => {
        resetFields();
        toggleSpinner();
        toggleError(true);
    })
}

button.addEventListener('click', (e) => {
    e.preventDefault();
    let ipInputValue = inputIP.value.trim();
    updateUserLocation(ipInputValue);
});

// Starts by getting the user IP and Infos
toggleSpinner()
getUserIp()
    .then(data => updateUserLocation(data['ip']))
    

var customIcon = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize:     [45, 55], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var mymap = L.map('map').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxlc3NhbmRic3MiLCJhIjoiY2tpcnNwaDk4MDZoZzJ5b2E3b3lkZHhvZiJ9.6refQpujKF50TMn-2WpFkA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxlc3NhbmRic3MiLCJhIjoiY2tpcnNwaDk4MDZoZzJ5b2E3b3lkZHhvZiJ9.6refQpujKF50TMn-2WpFkA'
}).addTo(mymap);
mymap.zoomControl.setPosition('bottomleft');
