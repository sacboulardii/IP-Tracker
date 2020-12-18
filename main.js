/* Getting Elementos from DOM */

const inputIP = document.querySelector('#ip');
const button = document.querySelector('#button');

const ipAddress = document.querySelector('#ip-address');
const ipLocation = document.querySelector('#location');
const ipTimezone = document.querySelector('#timezone');
const isp = document.querySelector('#isp');

const results = document.querySelector('.result')


/* Get User IP */
const getUserIp = async () => {
    const response = await fetch("https://cors-anywhere.herokuapp.com/https://api.ipify.org/?format=json");
    const data = await response.json();
    return data;
}


const loading = () => {

    let info = document.querySelectorAll('.result__info-block') 
    Array.from(info).map(info => info.classList.toggle('hide'))
    results.classList.toggle('loading')
    
}


//loading()

/* Get User IP Location */
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


/* */

function fillInfo(data) {

    ipAddress.textContent = `${data['ip']}`;
    ipLocation.textContent = `${data['ip']}`;
    ipTimezone.textContent = `<span>UTC</span>${data['timezone']}`;
    isp.textContent = `${data['isp']}`;
}

function updateMap(data) {
    let lat = data['location']['lat'];
    let lng = data['location']['lng'];

    mymap.setView([lat, lng], 13);
    L.marker([lat, lng]).addTo(mymap);
}

function resetFields() {
    ipAddress.textContent = '--';
    ipLocation.textContent = '--';
    ipTimezone.textContent = '--';
    isp.textContent = '--';
}

//resetFields();

button.addEventListener('click', (e) => {
    e.preventDefault();
    getUserIp()
    .then(data => {
        fillInfo(data);
        updateMap(data);
    })
    
})

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



