//this is the url of the where is iss api to take all information
//about ISS
const URL_ISS = "https://api.wheretheiss.at/v1/satellites/25544";

//this is async function I used it every second
//take the update coordinator
async function getCoordinator() {
  const response = await fetch(URL_ISS);
  const data = await response.json();
  const { longitude, latitude, velocity, visibility, timestamp} = data;

  document.querySelector("#lat").textContent = latitude.toFixed(3);
  document.querySelector("#lon").textContent = longitude.toFixed(3);
  document.querySelector("#vel").textContent = velocity.toFixed(3);
  document.querySelector("#vis").textContent = visibility;
  document.querySelector("#tim").textContent = timestamp;
  let coordinator = [latitude, longitude];
  return coordinator;
}

//this function for mapping according to the coordinator
//that i take it from the previous function
function makerOnMap(latitude, longitude) {
  //set the map using leaflet library 
  //if you want to understand all function from leaflet library
  //and openstreetmap I will put all liks in readme file
  let myMap = L.map("map", {
    renderer: L.svg()
  }).setView([0, 0], 4);

  //set the custom icon of the satellite
  let myIcon = L.icon({
    iconUrl: "myIssIcon.png",
    iconSize: [80, 60],
    iconAnchor: [40, 30],
    popupAnchor: [-3, -20],
  });

  //set the tile of the map which is from openstreetmap
  let tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let marker = L.marker([0, 0], { icon: myIcon });
  setInterval(async () => {
    let response = await getCoordinator();
    let coordinator = response;
    marker.setLatLng(coordinator).addTo(myMap);
    myMap.setView(coordinator);
    let myRenderer = L.svg({padding: 0.5});

    L.circle(coordinator, {radius: 1, color: '#000', renderer: myRenderer}).addTo(myMap)
  }, 1000);
  let attribution = `© OpenStreetMap`;
  let tileOption = { maxZoom: 19, attribution };
  let tile = L.tileLayer(tileURL, tileOption);
  tile.addTo(myMap);
  marker.bindPopup("the ISS location right now");
}

makerOnMap();
