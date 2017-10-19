var width = 1000,
    height = 600;

var data1, data2;

queue()
    .defer(d3.json, "L7/data/world-110m.json")
    .defer(d3.json, "L7/data/airports.json")
    .await(createVisualization);

function createVisualization(error,data1,data2) {
    console.log("here3")

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Visualize data1 and data2
    // var projection = d3.geo.mercator()
    var projection = d3.geo.orthographic()
        .scale([100])
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    console.log(data1);
    // Convert TopoJSON to GeoJSON (target object = 'states')
    var countries = topojson.feature(data1, data1.objects.countries).features

    // Render the U.S. by using the path generator
    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(data1, data1.objects.countries))
        .attr("d", path)
        .attr("class", "subunit-boundary");


    var nodes = svg.selectAll(".node")
        .data(data2.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", function(d) {
            if (d.country == "United States") {
                return "blue";
            } else {
                return "red";
            }
        })
        .attr("transform", function(d) {
        return "translate(" + projection([d.longitude, d.latitude]) + ")";
    });

}
