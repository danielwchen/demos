
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapPosition = _mapPosition;

	console.log(this.data);
	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;

	$.getJSON("MBTA-Lines.json", function(data) {
		vis.mbtaLines = L.geoJson(data, {
			style: styleBorough,
			weight: 4,
			fillOpacity: .7
		}).addTo(vis.map);

		function styleBorough(feature) {
			return {color: feature.properties.LINE};
		}
	});

	vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 14);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(vis.map);
	L.Icon.Default.imagePath = 'img/';



	vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
	var vis = this;

	vis.bikeStops = L.layerGroup().addTo(vis.map);

	vis.displayData.forEach(function(d){
		vis.marker = L.marker([d.lat, d.long])
			.bindPopup("<strong>" + d.name + "</strong><br/>Available Bikes: " + d.nbBikes + "<br/>Available Docks: " + d.nbEmptyDocks);

		vis.bikeStops.addLayer(vis.marker);
	});
}
