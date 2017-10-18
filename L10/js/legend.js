var popScale = d3.scale.linear()
    .domain([180000,1400000000])
    .range([6,40]);

var colors = [
    { region: "African", color: "#1f78b4" },
    { region: "E. Mediterranean", color: "#33a02c" },
    { region: "European", color: "#e31a1c" },
    { region: "Region of Americas", color: "#ff7f00" },
    { region: "SE. Asia", color: "#6a3d9a" },
    { region: "W. Pacific", color: "#b15928" }
];
var sizes = [
    { population: "180,000", size: popScale(180000) },
    { population: "200,000,000", size: popScale(200000000) },
    { population: "800,000,000", size: popScale(800000000) },
    { population: "1,400,000,000", size: popScale(1400000000) }
];



// Margin object with properties for the four directions
var margin3 = {top: 20, right: 10, bottom: 20, left: 10};
// Width and height as the inner dimensions of the chart area
var width3 = 200 - margin2.left - margin2.right,
    height3 = 565 - margin2.top - margin2.bottom;
// Define 'svg' as a child-element (g) from the drawing area and include spaces
var svg3 = d3.select("#legend").append("svg")
    .attr("width", width3 + margin3.left + margin2.right)
    .attr("height", height3 + margin3.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

svg3.append("text").text("Legend")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",width3/2)
    .attr("y",5)
    .attr("font-size","large");

svg3.append("text").text("Population")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",width3/2)
    .attr("y",30);

var answer = 0;
var prev = 0;
var answers = [];
svg3.selectAll(".legend-circ")
    .data(sizes)
    .enter()
    .append("circle")
    .attr("class","legend-circ")
    .attr("fill", "#bdbdbd")
    .attr("r", function(d) {
        return d.size;
    })
    .attr("cy", function(d, index) {
        answer = (d.size + answer + prev + 5);
        prev = d.size;
        answers[index] = answer + 40;
        return answer + 40;
    } )
    .attr("cx", width3/2);


svg3.selectAll(".legend-circ-labels")
    .data(sizes)
    .enter()
    .append("text")
    .attr("class","legend-circ-labels")
    .attr("y", function(d, index) {
        return answers[index] + 5;
    } )
    .attr("x", width3/2)
    .attr("text-anchor","middle")
    .text(function(d) {
        return d.population;
    });

svg3.append("text").text("Region")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",width3/2)
    .attr("y",260);

svg3.selectAll(".legend-rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("class","legend-rect")
    .attr("height",40)
    .attr("width",width3+20)
    .attr("y", function(d, index) {
        return index * 41 + 270;
    })
    .attr("x", -10)
    .attr("fill",function(d) {
        return d.color;
    });

svg3.selectAll(".legend-rect-labels")
    .data(colors)
    .enter()
    .append("text")
    .attr("class","legend-rect-labels")
    .attr("y", function(d, index) {
        return index * 41 + 295;
    } )
    .attr("x", width3/2)
    .attr("text-anchor","middle")
    .text(function(d) {
        return d.region;
    });