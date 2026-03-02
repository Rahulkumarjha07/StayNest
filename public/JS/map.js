document.addEventListener("DOMContentLoaded", function () {

  if (!window.listingData) {
    console.log("No listing data found");
    return;
  }

  mapboxgl.accessToken = window.mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: window.listingData.coordinates,
    zoom: 9
  });

  map.addControl(new mapboxgl.NavigationControl());

  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`
      <h6 style="margin:0;">${window.listingData.title}</h6>
      <p style="margin:0; font-size:13px;">${window.listingData.location}</p>
    `);

  new mapboxgl.Marker({ color: "#ff385c" })
    .setLngLat(window.listingData.coordinates)
    .setPopup(popup)
    .addTo(map);

});