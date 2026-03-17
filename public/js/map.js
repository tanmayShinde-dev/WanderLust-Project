const coords = listing.geometry?.coordinates || [77.1025, 28.7041];

const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
    center: coords,
    zoom: 10
});

map.addControl(new maplibregl.NavigationControl());

new maplibregl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(
        new maplibregl.Popup({ offset: 25 })
            .setHTML(`<h3>${listing.location}</h3>
                      <p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);