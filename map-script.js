var mapboxAccessToken = '';

function showMapTokenWarning(message) {
    var warning = document.getElementById('map-token-warning');

    if (!warning) {
        return;
    }

    warning.textContent = message;
    warning.hidden = false;
}

function setupLayerToggles(map) {
    var toggleableLayerIds = [
        {'id': 'power_lines', 'name': "Power Lines"},
        {'id': 'power_stations', 'name': "Power Stations"},
        {'id': 'cell_towers', 'name': "Cell Towers"}
    ];
    var layers = document.getElementById('menu');

    if (!layers) {
        return;
    }

    layers.hidden = false;

    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var link = document.createElement('button');
        link.type = 'button';
        link.className = 'active';
        link.textContent = toggleableLayerIds[i]['name'];
        link.dataset.layerId = toggleableLayerIds[i]['id'];
        link.setAttribute('aria-pressed', 'true');

        // Handle clicks on the layer toggle button.
        link.onclick = function (e) {
            var clickedLayer = this.dataset.layerId;
            e.preventDefault();
            e.stopPropagation();

            if (!map.getLayer(clickedLayer)) {
                return;
            }

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            // Change the visibility when the individual has clicked.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
                this.setAttribute('aria-pressed', 'false');
            } else {
                this.className = 'active';
                this.setAttribute('aria-pressed', 'true');
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };

        // Append the links to the layers menu
        layers.appendChild(link);
    }
}

function initializeMap() {
    mapboxgl.accessToken = mapboxAccessToken;

    // Handle the Mapbox Map
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-122.626991, 38.244923], // starting position
        zoom: 11 // starting zoom
    });

    // Setup a line animation for the power to run through e.g. like a strobe..
    var animationStep = 30;
    function enableLineAnimation(layerId) {
        var step = 0;
        var dashArraySeq = [
            [0, 4, 3],
            [1, 4, 2],
            [2, 4, 1],
            [3, 4, 0],
            [0, 1, 3, 3],
            [0, 2, 3, 2],
            [0, 3, 3, 1]
        ];
        setInterval(function() {
            step = (step + 1) % dashArraySeq.length;
            map.setPaintProperty(layerId, 'line-dasharray', dashArraySeq[step]);
        }, animationStep);
    }

    // Once the map loads we push the geoJson over the top.
    map.on('load', function() {


        // Load Power Stations
        var powerStationsUrl = 'geojson/power_stations.geojson';
        map.loadImage("images/power-stations.png", function(error, image) { //this is where we load the image file
        if (error) throw error;
            map.addImage("custom-marker", image);
            map.addLayer({
            'id': 'power_stations',
            'type': 'symbol',
            'source': {
                'type': 'geojson',
                'data': powerStationsUrl
            },
            'layout': {
                "icon-image": "custom-marker", // the name of image file we used above
                "icon-allow-overlap": true,
                "icon-size": 0.5 //this is a multiplier applied to the standard size. So if you want it half the size put ".5"
            }
            });
        });

        // Load Cell Towers
        var cellTowersUrl = 'geojson/cell_towers.geojson';
        map.loadImage("images/cell-towers.png", function(error, image) { //this is where we load the image file
        if (error) throw error;
            map.addImage("cell-tower", image);
            map.addLayer({
            'id': 'cell_towers',
            'type': 'symbol',
            'source': {
                'type': 'geojson',
                'data': cellTowersUrl
            },
            'layout': {
                "icon-image": "cell-tower", // the name of image file we used above
                "icon-allow-overlap": true,
                "icon-size": 0.5 //this is a multiplier applied to the standard size. So if you want it half the size put ".5"
            }
            });
        });



        // Power Lines
        var powerLinesUrl = 'geojson/power_lines.geojson';
        map.addLayer({
            'id': 'power_lines',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': powerLinesUrl
            },
            'paint': {
                'line-color': '#FF5023',
                'line-width': 2,
                'line-dasharray': [1, 1],
            }
        });

        enableLineAnimation('power_lines');
        setupLayerToggles(map);
    });

    // Add Zoom
    map.addControl(new mapboxgl.NavigationControl());
}

if (typeof mapboxgl === 'undefined') {
    showMapTokenWarning('Mapbox GL JS did not load. Check network access or serve this page where the Mapbox library can be reached.');
} else if (!mapboxAccessToken) {
    showMapTokenWarning('Add a local Mapbox access token in map-script.js to view the map. Keep the checked-in token empty before committing changes.');
} else {
    initializeMap();
}
