        // initialize basemmap
        mapboxgl.accessToken =
        'pk.eyJ1Ijoic3RldmVuY2hlbjIwNzciLCJhIjoiY2wya3lsdTd5MDdsaDNpczNqYWZ6MTZ2NyJ9.B0QJ20J285aNZ_NQ-sSayw';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            zoom: 3, // starting zoom
            center: [-100, 40] // starting center
        });

        // load data and add as layer
        async function geojsonFetch() {
            let response = await fetch('assets/us-covid-2020-rates.json');
            let stateData = await response.json();

            map.on('load', function loadingData() {
                map.addSource('stateData', {
                    type: 'geojson',
                    data: stateData
                });

                map.addLayer({
                    'id': 'stateData-layer',
                    'type': 'fill',
                    'source': 'stateData',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FFEDA0',   // stop_output_0
                            20,          // stop_input_0
                            '#FED976',   // stop_output_1
                            40,          // stop_input_1
                            '#FEB24C',   // stop_output_2
                            60,          // stop_input_2
                            '#FD8D3C',   // stop_output_3
                            80,
                            "#800026"    // stop_output_7
                        ],
                        'fill-outline-color': '#BBBBBB',
                        'fill-opacity': 0.7,
                    }
                });

                const layers = [
                    '0-19',
                    '20-39',
                    '40-59',
                    '60-79',
                    'More than 80'
                ];
                const colors = [
                    '#FFEDA070',
                    '#FED97670',
                    '#FEB24C70',
                    '#FD8D3C70',
                    '#FC4E2A70'
                ];

                // create legend
                const legend = document.getElementById('legend');
                legend.innerHTML = "<b>COVID-19 Rates by County <br></br></b>";

                layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
                const source1 =
                '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
                // combine all the html codes.
                legend.innerHTML += source1;
                const source2 =
                '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">US Census Bureau</a></p>';
                // combine all the html codes.
                legend.innerHTML += source2;

            });

            map.on('mousemove', ({point}) => {
                const state = map.queryRenderedFeatures(point, {
                    layers: ['stateData-layer']
                });
                document.getElementById('text-escription').innerHTML = state.length ?
                    `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</strong></em></p>` :
                    `<p>Hover over a County!</p>`;
            });


        }
        
        geojsonFetch();
        