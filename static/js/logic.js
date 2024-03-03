var map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson')
      .then(response => response.json())
      .then(data => {
        data.features.forEach(feature => {
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
          var radius;

          if (magnitude >= 5.1) {
            radius = 30;
          } else if (magnitude >= 4.1) {
            radius = 10;
          } else if (magnitude >= 3.1) {
            radius = 7;
          } else if (magnitude >= 2.1) {
            radius = 3;
          } else if (magnitude >= 1.1) {
            radius = 2;
          } else {
            radius = 1;
          }

          var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: radius,
            fillColor: getColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          marker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
        });
      });

    function getColor(depth) {
      return depth > 300 ? '#800026' :
             depth > 100 ? '#BD0026' :
             depth > 70 ? '#E31A1C' :
             depth > 50 ? '#FC4E2A' :
             depth > 30 ? '#FD8D3C' :
             depth > 10 ? '#FEB24C' :
                          '#FFEDA0';
    }

    // Adding Legend
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend');
      var depths = [0, 10, 30, 50, 70, 100, 300];
      var labels = [];

      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<div class="legend-item"><span style="background:' + getColor(depths[i] + 1) + '"></span> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km') + '</div>';
      }

      return div;
    };

    legend.addTo(map);