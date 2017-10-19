
// SVG Size
var width = 700,
	height = 500;


// Load CSV file
d3.csv("Template4/data/zaatari-refugee-camp-population.csv", function(data){

	var formatDate = d3.time.format("%b %Y");
	// Convert value types
	data.forEach(function(point) {
		var format = d3.time.format("%Y-%m-%d");
		point.date = format.parse(point.date);
		point.population = +point.population;
	});

	data.sort(function(a,b) {
		return a.date - b.date;
	});

	// Margin object with properties for the four directions
	var margin = {top: 20, right: 100, bottom: 20, left: 100};
	// Width and height as the inner dimensions of the chart area
	var width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	// Define 'svg' as a child-element (g) from the drawing area and include spaces
	var svg = d3.select("#area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// All subsequent functions/properties can ignore the margins:
	var x = d3.scale.linear()
		.range([0, width]);
	var y = d3.scale.linear()
		.range([height, 0]);

	var chartWidth = 500;
	var dateScale = d3.time.scale.utc()
		.domain([data[0].date,data[data.length-1].date])
		.range([0,chartWidth]);

	var populationScale = d3.scale.linear()
		.domain(d3.extent(data, function(d) {
			return d.population;
		}))
		.range([height, 0]);

	var area = d3.svg.area()
		.x(function(d) {
			return dateScale(d.date);
		})
		.y0(height)
		.y1(function(d) {
			return populationScale(d.population);
		});

	var areab = d3.svg.area()
		.x(function(d) {
			return dateScale(d.date);
		})
		.y0(height)
		.y1(function(d) {
			if (d.population > 100000) {
				return populationScale(100000);
			} else {
				return populationScale(d.population);
			}
		});

	var path = svg.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area);

	var path = svg.append("path")
		.datum(data)
		.attr("class", "areab")
		.attr("d", areab)
		.attr("fill","lightgray");
    //
	// var lineb = d3.svg.line()
	// 	.y(populationScale(100000));

	var linebpath = svg.append("line")
		.attr("class", "lineb")
		.attr("stroke","gray")
		.attr("x1", 0)
		.attr("x2", chartWidth)
		.attr("y1",populationScale(100000))
		.attr("y2",populationScale(100000))
		.attr("stroke-width","2")
		.attr("stroke-dasharray","3,3");

	svg.append("text")
		.attr("class", "note")
		.text( "Planned Camp Capacity" )
		.attr("text-anchor","end")
		.attr("y", populationScale(100000)-5)
		.attr("x", chartWidth-10);

	var line = d3.svg.line()
		.x(function(d) { return dateScale(d.date); })
		.y(function(d) { return populationScale(d.population); });

	var linepath = svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke","brown")
		.attr("stroke-width","3");

	var xAxis = d3.svg.axis()
		.scale(dateScale)
		.tickFormat(d3.time.format("%b %y"))
		.orient("bottom");

	var yAxis = d3.svg.axis();

	yAxis.scale(populationScale);

	yAxis.orient("left");

	var translate = "translate(0," + height.toString() + ")";
	svg.append("g")
		.attr("transform", translate)
		.attr("class","axis x-axis")
		.call(xAxis);

	svg.append("g")
		.attr("transform","translate(0,0)")
		.attr("class","axis y-axis")
		.call(yAxis);

	svg.append("text")
		.attr("class", "x-label")
		.text( "Income per Person" )
		.attr("text-anchor","end")
		.attr("y", height-5)
		.attr("x", chartWidth-10);

	var yaxisx = 5;
	var yaxisy = 10;
	var string = "rotate(90,"+yaxisx.toString()+","+yaxisy.toString()+")";

	svg.append("text")
		.attr("class", "y-label")
		.text( "Life Expectancy" )
		.attr("transform",string)
		.attr("y", yaxisy)
		.attr("x", yaxisx);

	svg.append("text")
		.attr("class", "chart-label")
		.text( "Camp Population" )
		.attr("text-anchor","middle")
		.attr("y", yaxisy)
		.attr("x", chartWidth/2);

	var bisectDate = d3.bisector(function(d) { return d.date; }).left;

	var focus = svg.append("g")                                // **********
		.style("display", "none");                             // **********

	// append the circle at the intersection               // **********
	focus.append("circle")                                 // **********
		.attr("class", "indicator")                                // **********
		.style("fill", "none")                             // **********
		.attr("r", 5);

	svg.append("rect")                                     // **********
		.attr("width", width)                              // **********
		.attr("height", height)                            // **********
		.style("fill", "none")                             // **********
		.style("pointer-events", "all")                    // **********
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

	function mousemove() {                                 // **********
		var x0 = dateScale.invert(d3.mouse(this)[0]),              // **********
			i = bisectDate(data, x0, 1),                   // **********
			d0 = data[i - 1],                              // **********
			d1 = data[i],                                  // **********
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;     // **********



		focus.select("circle.indicator")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")");

		focus.select("text.y3")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.text(d.population);

		focus.select("text.y4")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.text(d.population);

		focus.select("text.y1")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.text(formatDate(d.date));

		focus.select("text.y2")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.text(formatDate(d.date));

		focus.select(".x")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.attr("y2", height - populationScale(d.population));

		focus.select(".y")
			.attr("transform",
				"translate(" + width * -1 + "," +
				populationScale(d.population) + ")")
			.attr("x2", width + width);
	}

	// append the x line
	focus.append("line")
		.attr("class", "x")
		.style("stroke-dasharray", "3,3")
		.attr("y1", 0)
		.attr("y2", height);

	// append the y line
	focus.append("line")
		.attr("class", "y")
		.style("stroke-dasharray", "3,3")
		.attr("x1", width)
		.attr("x2", width);

	// place the value at the intersection
	focus.append("text")
		.attr("class", "y1")
		.style("stroke", "white")
		.style("stroke-width", "3.5px")
		.attr("dx", 8)
		.attr("dy", "-.3em");

	focus.append("text")
		.attr("class", "y2")
		.attr("dx", 8)
		.attr("dy", "-.3em");

	// place the date at the intersection
	focus.append("text")
		.attr("class", "y3")
		.style("stroke", "white")
		.style("stroke-width", "3.5px")
		.attr("dx", 8)
		.attr("dy", "1em");
	focus.append("text")
		.attr("class", "y4")
		.attr("dx", 8)
		.attr("dy", "1em");


});

var typeData = [{
	shelterType: "caravan",
	percent: 79.68
}, {
	shelterType: "combination",
	percent: 10.81
}, {
	shelterType: "tent",
	percent: 9.51
}];

// Margin object with properties for the four directions
var margin = {top: 20, right: 100, bottom: 20, left: 100};
// Width and height as the inner dimensions of the chart area
var width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
// Define 'svg' as a child-element (g) from the drawing area and include spaces
var svgbar = d3.select("#bar").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// All subsequent functions/properties can ignore the margins:
var x = d3.scale.linear()
	.range([0, width]);
var y = d3.scale.linear()
	.range([height, 0]);

var chartWidth = 410;
var percentScale = d3.scale.linear()
	.domain([0,100])
	.range([height,0]);
var typeScale = d3.scale.ordinal()
	.domain(["caravan","combination","tent"])
	.range([70,160,250]);


svgbar.selectAll("rect")
	.data(typeData)
	.enter()
	.append("rect")
	.attr("class", "bars")
	.attr("fill", "black")
	.attr("y", function(d) {
		return percentScale(d.percent);
	})
	.attr("x", function(d){
		return typeScale(d.shelterType) - 45;
	})
	.attr("width", 80)
	.attr("height", function(d) {
		return height - percentScale(d.percent);
	})
	.attr("fill", "tan");

var xbarAxis = d3.svg.axis();

xbarAxis.orient("bottom");

xbarAxis.scale(typeScale);

var percentScale2 = d3.scale.linear()
	.domain([0,1])
	.range([height,0]);

var ybarAxis = d3.svg.axis()
	.scale(percentScale2)
	.tickFormat(d3.format("%"))
	.orient("left");

var translate = "translate(0," + height.toString() + ")";
svgbar.append("g")
	.attr("transform", translate)
	.attr("class","axis x-bar-axis")
	.call(xbarAxis);

svgbar.append("g")
	.attr("class","axis y-bar-axis")
	.call(ybarAxis);

svgbar.append("text")
	.attr("class", "x-bar-label")
	.text( "Type of Residence" )
	.attr("text-anchor","end")
	.attr("y", height-5)
	.attr("x", chartWidth-10);

var yaxisx = 5;
var yaxisy = 10;
var string = "rotate(90,"+yaxisx.toString()+","+yaxisy.toString()+")";

svgbar.append("text")
	.attr("class", "y-bar-label")
	.text( "Percent of Shelter Residents" )
	.attr("transform",string)
	.attr("y", yaxisy)
	.attr("x", yaxisx);

svgbar.append("text")
	.attr("class", "bar-chart-title")
	.text( "Camp Residence Types" )
	.attr("text-anchor","middle")
	.attr("y", 0)
	.attr("x", chartWidth/2);


svgbar.append("text")
	.attr("class", "bar-chart-label")
	.text("79.68%")
	.attr("text-anchor","middle")
	.attr("y", percentScale(79.68)-5)
	.attr("x", typeScale("caravan"));

svgbar.append("text")
	.attr("class", "bar-chart-label")
	.text("10.81%")
	.attr("text-anchor","middle")
	.attr("y", percentScale(10.81)-5)
	.attr("x", typeScale("combination"));

svgbar.append("text")
	.attr("class", "bar-chart-label")
	.text("9.51%")
	.attr("text-anchor","middle")
	.attr("y", percentScale(9.51)-5)
	.attr("x", typeScale("tent"));