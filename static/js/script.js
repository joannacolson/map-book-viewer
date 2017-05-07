var initMap = function() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6062095, lng: -122.3320708 },
        zoom: 12
    });

    // if brower support available, ask user for location data and set the map view
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialLocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            );
            map.setCenter(initialLocation);
        });
    }

    // for each marker passed through, add it to the map with a popup
    markers.forEach(function(marker) {
        // console.log(marker);
        var position = new google.maps.LatLng(marker.lat, marker.lng);
        var googleMarker = new google.maps.Marker({
            position: position,
            title: marker.name,
            map: map
        });
        // Bind a popup to the marker
        googleMarker.addListener('click', function() {
            var infoWindow = new google.maps.InfoWindow({
                content: '<h5>' + marker.name + '</h5>'
            });
            infoWindow.open(map, googleMarker);
        });
    });
};

function initStreetView() {
    // var position = { lat: 42.345573, lng: -71.098326 };
    // console.log(streetViewPlace);
    var position = new google.maps.LatLng(streetViewPlace.lat, streetViewPlace.lng);
    var map = new google.maps.Map(document.getElementById('street-view-map'), {
        center: position,
        zoom: 16
    });
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: position
        });
    map.setStreetView(panorama);
}
