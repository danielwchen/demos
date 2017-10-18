
// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialize data
loadData();

// FIFA world cup
var data;


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = formatDate.parse(d.YEAR);
			
			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}

var xAxis = d3.svg.axis()
	.orient("bottom");

var yAxis = d3.svg.axis()
	.orient("left");

var translate = "translate(0," + height.toString() + ")";
svg.append("g")
	.attr("transform", translate)
	.attr("class","axis x-axis")
	.call(xAxis);

svg.append("g")
	.attr("class","axis y-axis")
	.call(yAxis);

svg.append("text")
	.attr("class", "label")
	.text( "Num Stores" )
	.attr("text-anchor", "middle")
	.attr("y", -10)
	.attr("x", 0);

svg.append("path").attr("class","line").datum(data);



// Render visualization
function updateVisualization() {

	var currentdata = data.filter(function(d) {
		return formatDate(d.YEAR) <= d3.select("#enddate").property("value") && formatDate(d.YEAR) >= d3.select("#startdate").property("value");
	});

	var minx = d3.select("#startdate").property("value");
	var maxx = d3.select("#enddate").property("value");
	x.domain([minx,maxx]);

	var miny = d3.min(currentdata,function(d) {
		return getProperYValue(d);
	});
	var maxy = d3.max(currentdata,function(d) {
		return getProperYValue(d);
	});
	y.domain([0,maxy]);

	var line = d3.svg.line()
		.x(function(d) { return x( formatDate(d.YEAR)); })
		.y(function(d) { return y( getProperYValue(d)); })
		.interpolate("linear");


	svg.selectAll(".line").datum(currentdata).transition().duration(800)
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke-width","3");

	svg.selectAll(".line").transition().duration(800).attr("d",line);

	var datapoints = svg.selectAll("circle")
		.data(currentdata);

	/* Initialize tooltip */
	var tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
		return d.LOCATION + " " + formatDate(d.YEAR).toString() + ": " + getProperYValue(d);
	});

	/* Invoke the tip in the context of your visualization */
	svg.call(tip)

	datapoints.enter().append("circle")
		.attr("class", "circles")
		.attr("r", 3)
		.attr("fill","white")
		.attr("stroke", "green")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.on('click', function(d) { return showEdition(d)});

	// Update (set the dynamic properties of the elements)
	datapoints.transition().duration(800)
		.attr("cx", function(d) { return x(formatDate(d.YEAR)); })
		.attr("cy", function(d) { return y(getProperYValue(d))});

	// Exit
	datapoints.exit().remove();

	xAxis = d3.svg.axis().scale(x).orient("bottom");
	yAxis = d3.svg.axis().scale(y).orient("left");

	svg.selectAll(".y-axis").transition().duration(800)
		.call(yAxis);

	svg.selectAll(".x-axis").transition().duration(800)
		.call(xAxis);

	svg.selectAll(".label").transition().duration(800)
		.text(function() {
			if (d3.select(".form-control").property("value") == "goals") {
				return "Number of Goals";
			} else if (d3.select(".form-control").property("value") == "averagegoals") {
				return "Average Goals";
			} else if (d3.select(".form-control").property("value") == "matches") {
				return "Number of Matches";
			} else if (d3.select(".form-control").property("value") == "teams") {
				return "Number of Teams";
			} else {
				return "Average Attendance";
			}
		});

	console.log(data);
}


// Show details for a specific FIFA World Cup
function showEdition(d){
	document.getElementById("title").innerHTML = d.EDITION;
	document.getElementById("winner").innerHTML = d.WINNER.toString();
	document.getElementById("goals").innerHTML = d.GOALS.toString();
	document.getElementById("averagegoals").innerHTML = d.AVERAGE_GOALS.toString();
	document.getElementById("matches").innerHTML = d.MATCHES.toString();
	document.getElementById("teams").innerHTML = d.TEAMS.toString();
	document.getElementById("averageattendance").innerHTML = d.AVERAGE_ATTENDANCE.toString();
}

function getProperYValue(d) {
	if (d3.select(".form-control").property("value") == "goals") {
		return d.GOALS;
	} else if (d3.select(".form-control").property("value") == "averagegoals") {
		return d.AVERAGE_GOALS;
	} else if (d3.select(".form-control").property("value") == "matches") {
		return d.MATCHES;
	} else if (d3.select(".form-control").property("value") == "teams") {
		return d.TEAMS;
	} else {
		return d.AVERAGE_ATTENDANCE;
	}
}


d3.select("#ranking-type")
	.on("change", function() {
		updateVisualization();
	});

d3.select("#startdate")
	.on("input", function() {
		updateVisualization();
	});

d3.select("#enddate")
	.on("input", function() {
		updateVisualization();
	});
