
// Bar chart configurations: data keys and chart titles
var configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];


// Initialize variables to save the charts later
var barcharts = [];
var areachart;
var data;


// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%d").parse;


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new are chart object

d3.csv("data/household_characteristics.csv", function(allData){
	// console.log(allData);

	// Store csv data in global variable
	data = allData;

	// Draw the visualization for the first time
	updateVisualization();
});


function updateVisualization() {

	barcharts[0] = new BarChart("ownrent", data, "ownrent");

	barcharts[1] = new BarChart("electricity", data, "electricity");

	barcharts[2] = new BarChart("latrine", data, "latrine");

	barcharts[3] = new BarChart("hohreligion", data, "hohreligion");

	areachart = new AreaChart("area",data);
}


// React to 'brushed' event and update all bar charts
function brushed() {

	// * TO-DO *
	var time = areachart.brush.empty() ? areachart.x.domain() : areachart.brush.extent()
	for (var i=0; i < 4; i++) {
		barcharts[i].selectionChanged(time);
	}

	// console.log(time);
	// Update focus chart (detailed information)
	areachart.wrangleData();
}
