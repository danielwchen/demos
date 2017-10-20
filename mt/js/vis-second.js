var regions = ["African","Eastern Mediterranean","European","Region of the Americas","South-East Asia","Western Pacific"];
// Margin object with properties for the four directions
var margin2 = {top: 10, right: 10, bottom: 30, left: 30};
// Width and height as the inner dimensions of the chart area
var width2 = 790 - margin2.left - margin2.right,
    height2 = 565 - margin2.top - margin2.bottom;
// Define 'svg' as a child-element (g) from the drawing area and include spaces
var svg2 = d3.select("#visualization").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var watScale = d3.scale.linear()
    .range([height2 - margin2.top,0]);
var sanScale = d3.scale.linear()
    .range([margin2.left,width2-margin2.right]);
var popScale = d3.scale.linear()
    .range([6,40]);

var regScale=d3.scale.ordinal()
    .range(["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a","#b15928"]);
    // .range(["#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6","#ffff99"]);

// "#a6cee3","#1f78b4"

var data;

loadData();

regScale.domain(regions);
    // .domain(data.map(function(d) {
    //     return d.Region;
    // }));

function loadData() {

    d3.csv("mt/data/global-water-sanitation-2015.csv", function(error, csv) {

        csv = csv.filter(function(d) { return d.Improved_Sanitation_2015 != "NA" && d.Improved_Water_2015 != "NA" })

        csv.forEach(function(country) {
            country.Improved_Sanitation_2015 = 100 - country.Improved_Sanitation_2015;
            country.Improved_Water_2015 = 100 - country.Improved_Water_2015;
            country.UN_Population = +country.UN_Population;
        });

        csv.sort(function(a,b) {
            return b.UN_Population - a.UN_Population;
        });

        data = csv;
        updateVisualization();
    });
}

function updateVisualization() {

    watScale.domain([0,60]);
    sanScale.domain([0,100]);
    popScale.domain([180000,1400000000]);


    var tip2 = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
        var value;
        return d.Country + ", " + d.WHO_region + "<br> Population: " + d.UN_Population.toLocaleString() + "<br>Population without improved sanitation facilities: " + d.Improved_Sanitation_2015.toFixed(1) + "%<br>Population without improved drinking water: " + d.Improved_Water_2015.toFixed(1) + "%";
    });

    /* Invoke the tip in the context of your visualization */
    svg2.call(tip2);

    svg2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "country-circ")
        .attr("fill", function(d) {
            return regScale(d.WHO_region);
        })
        .attr("stroke", "white")
        .attr("cy", function(d) {
            return watScale(d.Improved_Water_2015);
        }) // Life Expectancy
        .attr("cx", function(d) {
            return sanScale(d.Improved_Sanitation_2015);
        }) // Income per Person
        .attr("r", function(d) {
            return popScale(d.UN_Population);
        })
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide); // Population;

    // .on("click", function(d) {
    // 	updateDisplay(d);
    // })

    var sanScale2 = d3.scale.linear()
        .domain([0,1])
        .range([margin2.left,width2-margin2.right]);
    var xAxis = d3.svg.axis()
        .scale(sanScale2)
        .tickFormat(d3.format("%"))
        .orient("bottom");

    var watScale2 = d3.scale.linear()
        .domain([0,.6])
        .range([height2 - margin2.top,0]);
    var yAxis = d3.svg.axis()
        .tickFormat(d3.format("%")).scale(watScale2).orient("left");


    svg2.append("g")
        .attr("transform","translate(0," + height2 + ")")
        .attr("class","axis x-axis")
        .call(xAxis);

    svg2.append("g")
        .attr("transform","translate(" + (margin2.left/2) + ",0)")
        .attr("class","axis y-axis")
        .call(yAxis);

    svg2.append("text")
        .attr("class", "x-label")
        .text( "% Population without Improved Sanitation Facilities" )
        .attr("text-anchor","end")
        .attr("y", height2 - 5)
        .attr("x", width2 - margin2.right);

    var ytextx = margin2.left/2+5;
    var ytexty = 0;
    var string = "rotate(90,"+ytextx.toString()+","+ytexty.toString()+")";

    svg2.append("text")
        .attr("class", "y-label")
        .text( "% Population without Improved Drinking Water Sources" )
        .attr("transform",string)
        .attr("y", ytexty)
        .attr("x", ytextx);

}


