
// SVG drawing area

var margin = {top: 60, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);


// Initialize data
// console.log("1");
loadData();

// Coffee chain data

// console.log(data);
// console.log("4");
var data;

// console.log("5");
// console.log(data);

// Load CSV file
function loadData() {
	// console.log("2");

	// data = "10";

	// console.log("3");

	d3.csv("L5_2/data/coffee-house-chains.csv", function(error, csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable

		// console.log("5")
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

// Render visualization
function updateVisualization() {

	data.sort(function(a,b) {
		if (d3.select(".form-control").property("value") == "stores") {
			return b.stores - a.stores;
		} else {
			return b.revenue - a.revenue;
		}
	});

	x.domain(data.map(function(d) { return d.company; }));

	var max = d3.max(data, function(d) {
		if (d3.select(".form-control").property("value") == "stores") {
			return d.stores;
		} else {
			return d.revenue
		}

	});
	y.domain([0,max]);


	var rectangles = svg.selectAll("rect")
		.data(data);

	rectangles.enter().append("rect")
		.attr("class", "bar");

	// Update (set the dynamic properties of the elements)
	rectangles.transition()
		.attr("x", function(d) { return x(d.company); })
		.attr("y", function(d) {
			if (d3.select(".form-control").property("value") == "stores") {
				return y(d.stores);
			} else {
				return y(d.revenue);
			}
		})
		.attr("width", x.rangeBand())
		.attr("height", function(d) {
			if (d3.select(".form-control").property("value") == "stores") {
				return height - y(d.stores);
			} else {
				return height - y(d.revenue);
			}
		})
		.attr("stroke", "black");

	// Exit
	rectangles.exit().remove();

	xAxis = d3.svg.axis().scale(x).orient("bottom");
	yAxis = d3.svg.axis().scale(y).orient("left");

	svg.selectAll(".y-axis").transition()
		.call(yAxis);

	svg.selectAll(".x-axis").transition()
		.call(xAxis);

	svg.selectAll(".label").transition()
		.text(function() {
			if (d3.select(".form-control").property("value") == "stores") {
				return "Number of Stores";
			} else {
				return "Revenue in Billion USD";
			}
		});
}


d3.select("#ranking-type")
	.on("change", function() {
		updateVisualization();
	});

