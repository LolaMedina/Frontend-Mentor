const ipAddress = document.querySelector('#ipAddress');
const locationID = document.querySelector('#location');
const timezone = document.querySelector('#timezone');
const ISP = document.querySelector('#ISP');
const submitBtn = document.getElementById('submitBtn');
const errorText = document.getElementById('errorMessage');
let inputField = document.querySelector('#inputField');

fetchData();

//on submit check input
submitBtn.addEventListener('click', e => {
    e.preventDefault();

    if(inputField.value){
        checkData(inputField.value);
    } else (
        errorText.textContent = 'invalid input'
    )
});


// Search for any IP addresses or domains and see the key information and location
// The regex for a valid IP address is inspired by this post
// https://www.regular-expressions.info/numericranges.html
function checkData(inputInfo) {
    const input = inputInfo;
    const domainFormat = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const ipFormat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if(input.match(domainFormat)) {
        fetchData(input, "domain");
    } else if (input.match(ipFormat)) {
        fetchData(input, "ipAddress")
    } else{
        errorText.textContent = "Invalid domain name or Ip Address";
    }
}

//display client IP address on load
async function fetchData(inputInfo, inputType) {
    const url = 'https://geo.ipify.org/api/v1?';
    const apiKey = "at_fyv4lvoegiqjTBQRFVrTj4C5a8wld&";
    const urlTemplate =`${url}apiKey=${apiKey}${inputType}=${inputInfo}`
    const response = await fetch(`${urlTemplate}`)
    const data = await response.json();
    // const userIP = await data.ip ;

    generateInfo(data);
     displayMap(data);
}

function generateInfo(info) {
    ipAddress.textContent = info.ip;
    ISP.textContent = info.isp;
    locationID.textContent = `${info.location.region}, ${info.location.city} ${info.location.postalCode}`;
    timezone.textContent = `UTC ${info.location.timezone}`; 

}


//display map

const mapOptions = {
    zoomControl: false,
}
const map = new L.map('mapid', mapOptions);

const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

const mapIcon = L.icon({
    iconUrl: '../IP-Tracker/images/icon-location.svg',
    iconSize: [40,50],
    iconAnchor: [20,50],
})

function displayMap(info) {
    const lat = info.location.lat;
    const long = info.location.lng;

    map.setView([lat, long], 16)

    const marker =  L.marker([lat,long], {icon : mapIcon });

    marker.addTo(map);

// marker.bindPopup(`lat : ${lat} , long : ${long}`).openPopup();
  }



