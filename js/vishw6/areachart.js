
/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

AreaChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = [];

	this.initVis();
};


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

AreaChart.prototype.initVis = function(){
	var vis = this;

	// * TO-DO *
	vis.margin = {top: 40, right: 40, bottom: 60, left: 60};

	vis.width = 600 - vis.margin.left - vis.margin.right,
		vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


// Scales
	vis.x = d3.time.scale()
		.range([0, vis.width]);

	vis.y = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("bottom");

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

	// TO-DO: Initialize brush component
	// Initialize time scale (x-axis)
// Initialize brush component
	vis.brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);


	// TO-DO: Append brush component here
	// Append brush component
	vis.svg.append("g")
		.attr("class", "x brush")
		.call(vis.brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", vis.height + 7);
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by date and count survey results for each day
	// (2) Sort data by day

	
	// * TO-DO *
	vis.formatDate = d3.time.format("%b %Y");

	vis.displayData = d3.nest()
		.key(function(d) { return d.survey })
		.rollup(function(d) { return d.length; })
		.entries(vis.data);

	// Convert value types
	vis.displayData.forEach(function(d) {
		vis.format = d3.time.format("%Y-%m-%d");
		d.key = vis.format.parse(d.key);
	});


	vis.displayData.sort(function(a,b) {
		return a.key - b.key;
	});

	// Update the visualization
	vis.updateVis();
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function(){
	var vis = this;


	vis.area = d3.svg.area()
		.x(function(d) { return vis.x(d.key); })
		.y0(vis.height)
		.y1(function(d) { return vis.y(d.values); });
	vis.x.domain(d3.extent(vis.displayData, function(d) { return d.key; }));
	vis.y.domain([0,d3.max(vis.displayData, function(d) { return d.values; })]);

    //

	vis.path = vis.svg.append("path")
		.attr("class", "area")
		.datum(vis.displayData);

	vis.path
		.attr("d", vis.area)
		.attr("fill","green");


	vis.svg.select(".x-axis").call(vis.xAxis);
	vis.svg.select(".y-axis").call(vis.yAxis);
	// * TO-DO *



}

