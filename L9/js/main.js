
var allData = [];
var data;

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();

function loadData() {

	// Proxy url
	var proxy = 'http://michaeloppermann.com/proxy.php?format=xml&url=';

    // Hubway XML station feed
    var url = 'https://www.thehubway.com/data/stations/bikeStations.xml';

    $.getJSON(proxy+url, function(jsonData){

        data = jsonData.station;
        data.forEach(function(d){
            d.id = +d.id;
            d.lat = +d.lat;
            d.long = +d.long;
            // d.nbBikes = +d.nbBikes;
            // d.nbEmptyDocks = +d.nbEmptyDocks;
        });

        $("#station-count").text(data.length);

        createVis();
    });

}


function createVis() {

    var stationMap = new StationMap("station-map",data,[42.364597, -71.106691]);

}