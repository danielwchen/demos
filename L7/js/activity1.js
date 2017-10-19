var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT
var force = d3.layout.force()
    .size([width, height])
    .linkStrength(1)
    .linkDistance(30)
    .charge(-50)
    .gravity(0.1)
    .theta(0.8)
    .alpha(0.1);

// Load data
d3.json("L7/data/airports.json", function(data) {

    console.log(data);


  // 2a) DEFINE 'NODES' AND 'EDGES'
    var nodes = svg.selectAll(".node")
        .data(data.nodes)
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
        .call(force.drag);

    nodes.append("title")
        .text(function(d) { return d.name; });

    var edges = svg.selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);


    force
        .nodes(data.nodes)
        .links(data.links);

  // 2b) START RUNNING THE SIMULATION
    force.start();

  // 3) DRAW THE LINKS (SVG LINE)

  // 4) DRAW THE NODES (SVG CIRCLE)

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    force.on("tick", function() {

        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

    });
});