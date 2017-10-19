// Margin object with properties for the four directions
var margin = {top: 20, right: 20, bottom: 20, left: 20};
// Width and height as the inner dimensions of the chart area
var width = 1000 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;
// Define 'svg' as a child-element (g) from the drawing area and include spaces
var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
	.attr("class", "queuecounter")
	.text( "Orders: 0" )
	.attr("y", height/2)
	.attr("x", 0);

// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

function updateVisualization(orders) {
	svg.select(".queuecounter")
		.text( "Orders: " + orders.length.toString() );

	var circle = svg.selectAll("circle")
		.data(orders);

	// Enter (initialize the newly added elements)
	circle.enter().append("circle")
		.attr("class", "dot")
		.attr("fill", "#707086");

	// Update (set the dynamic properties of the elements)
	circle
		.attr("r", 30)
		.attr("cx", function(d, index) {
			return (index * 80) + 150
		})
		.attr("cy", height/2)
		.attr("fill", function(d) {
			if (d.product == "coffee") {
				return "brown";
			} else {
				return "darkgreen";
			}
		});

	// Exit
	circle.exit().remove();

}

