

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _config){
	this.parentElement = _parentElement;
	this.data = _data;
	this.config = _config;
	this.displayData = _data;

	this.initVis();
};



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	// * TO-DO *
	// SVG drawing area

	vis.margin = { top: 30, right: 30, bottom: 20, left: 200 };

	vis.width = 600 - vis.margin.left - vis.margin.right,
		vis.height = 200 - vis.margin.top - vis.margin.bottom;


	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.x = d3.scale.linear()
		.range([0, vis.width]);

	vis.y = d3.scale.ordinal()
		.rangeRoundBands([0, vis.height], .1);

	// vis.xAxis = d3.svg.axis()
	// 	.scale(vis.x)
	// 	.orient("bottom");

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left");

	vis.svg.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
		.attr("class", "y-axis axis");

	// (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by key variable (e.g. 'electricity') and count leaves
	// (2) Sort columsn descending

	vis.filteredData = d3.nest()
		.key(function(d) { return d[vis.config]; })
		.rollup(function(d) { return d.length; })
		.entries(vis.displayData);

	vis.displayData = vis.data;


	vis.title = configs.filter(function(d) {return d.key == vis.config})[0].title;

	vis.svg.append("text")
		.attr("class", "title")
		.data(vis.filteredData)
		.text(vis.title)
		.attr("y",-10);

	// * TO-DO *


	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(){
	var vis = this;

	// (1) Update domains
	// (2) Draw rectangles
	// (3) Draw labels

	var max = d3.max(vis.filteredData, function(d) {
		return d.values;

	});
	vis.x.domain([0,max + (max * .1)]);

	vis.y.domain(vis.filteredData.map(function(d) { return d.key; }));

	vis.rectangles = vis.svg.selectAll("rect")
		.data(vis.filteredData);

	vis.rectangles.enter().append("rect")
		.attr("class", "bar");

	// Update (set the dynamic properties of the elements)
	vis.rectangles.transition()
		.attr("x", function(d) {
			return vis.y(0);
		})
		.attr("y", function(d) {
			return vis.y(d.key) + 10;
		})
		.attr("width", function(d) {
			return vis.x(d.values);
		})
		.attr("height", 10)
		.attr("stroke", "black");

	// Exit
	vis.rectangles.exit().remove();

	vis.textlabels = vis.svg.selectAll(".textlabel")
		.data(vis.filteredData);

	vis.textlabels.enter().append("text")
		.attr("class", "textlabel");

	// Update (set the dynamic properties of the elements)
	vis.textlabels.transition()
		.attr("x", function(d) {
			return vis.x(d.values) + 10;
		})
		.attr("y", function(d) {
			return vis.y(d.key) + 20;
		})
		.text(function(d) {
			return d.values;
		});

	// Exit
	vis.textlabels.exit().remove();


	// vis.xAxis = d3.svg.axis().scale(vis.x).orient("bottom");
	vis.yAxis = d3.svg.axis().scale(vis.y).orient("left");



	// vis.svg.selectAll(".x-axis").transition()
	// 	.call(vis.xAxis);

	// * TO-DO *


	// Update the y-axis
	vis.svg.selectAll(".y-axis").transition()
		.call(vis.yAxis);
}



/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion){
	var vis = this;

	vis.displayData = vis.data.filter(function(d) {
		return d.survey <= brushRegion[1] && d.survey >= brushRegion[0];
	});

	// Filter data accordingly without changing the original data

	// * TO-DO *

	// Update the visualization
	vis.wrangleData();
}
