mapboxgl.accessToken = '';

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
    let dashArraySeq = [
        [0, 4, 3],
        [1, 4, 2],
        [2, 4, 1],
        [3, 4, 0],
        [0, 1, 3, 3],
        [0, 2, 3, 2],
        [0, 3, 3, 1]
    ];
    setInterval(() => {
        step = (step + 1) % dashArraySeq.length;
        map.setPaintProperty(layerId, 'line-dasharray', dashArraySeq[step]);
        }, animationStep);
}

// Once the map loads we push the geoJson over the top.
map.on('load', function() {

    
    // Load Power Stations
    var url = 'geojson/power_stations.geojson';
    map.loadImage("images/power-stations.png", function(error, image) { //this is where we load the image file 
    if (error) throw error;
        map.addImage("custom-marker", image); 
        map.addLayer({
        'id': 'power_stations',
        'type': 'symbol',
        'source': {                
            'type': 'geojson',
            'data': url
        },
        'layout': {
            "icon-image": "custom-marker", // the name of image file we used above
            "icon-allow-overlap": true,
            "icon-size": 0.5 //this is a multiplier applied to the standard size. So if you want it half the size put ".5"
        }
        })
    });

    // Load Cell Towers
    var cell_towers_url = 'geojson/cell_towers.geojson';
    map.loadImage("images/cell-towers.png", function(error, image) { //this is where we load the image file 
    if (error) throw error;
        map.addImage("cell-tower", image); 
        map.addLayer({
        'id': 'cell_towers',
        'type': 'symbol',
        'source': {                
            'type': 'geojson',
            'data': cell_towers_url
        },
        'layout': {
            "icon-image": "cell-tower", // the name of image file we used above
            "icon-allow-overlap": true,
            "icon-size": 0.5 //this is a multiplier applied to the standard size. So if you want it half the size put ".5"
        }
        })
    });

    

    // Power Lines
    var url = 'geojson/power_lines.geojson';
    map.addLayer({
        'id': 'power_lines',
        'type': 'line',
        'source': {                
            'type': 'geojson',
            'data': url
        },
        'paint': {
            'line-color': '#FF5023',
            'line-width': 2,
            'line-dasharray': [1, 1],
        }
    });

    enableLineAnimation('power_lines');
});

var toggleableLayerIds = [ {'id': 'power_lines', 'name': "Power Lines"},
                            {'id': 'power_stations', 'name': "Power Stations"},
                            {'id': 'cell_towers', 'name': "Cell Towers"}
                        ]

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i]['id'];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = toggleableLayerIds[i]['name'];
    link.idContent = toggleableLayerIds[i]['id']


    // Handle on click on link
    link.onclick = function (e) {
        var clickedLayer = this.idContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
        
        // Change the visibility when the individual has clicked.
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    // Append the liniks to the layers to the menu
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

// Add Zoom 
map.addControl(new mapboxgl.NavigationControl());