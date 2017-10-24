/*
 *  Vis5 - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

Vis5 = function(_parentElement) {
  this.parentElement = _parentElement;

  this.data;

  this.initVis();
};

Vis5.prototype.initVis = function() {
  var vis = this;

  vis.regions = ["African","Eastern Mediterranean","European","Region of the Americas","South-East Asia","Western Pacific"];
  // Margin object with properties for the four directions
  vis.margin = {top: 10, right: 10, bottom: 30, left: 30};
  // Width and height as the inner dimensions of the chart area
  vis.width = 790 - vis.margin.left - vis.margin.right;
  vis.height = 565 - vis.margin.top - vis.margin.bottom;

}

Vis5.prototype.wrangleData = function(mapTopJson, fullCountryDataCSV) {
  var vis = this;

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

    vis.data = csv;
  });

  vis.createVis();

}

Vis5.prototype.createVis = function() {
  var vis = this;


  // Define 'svg' as a child-element (g) from the drawing area and include spaces
  vis.svg = d3.select("#visualization").append("svg")
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .append("g")
  .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.watScale = d3.scale.linear().range([vis.height - vis.margin.top,0]);
  vis.sanScale = d3.scale.linear().range([vis.margin.left,vis.width-vis.margin.right]);
  vis.popScale = d3.scale.linear().range([6,40]);
  vis.regScale = d3.scale.ordinal().range(["#1f78b4","#33a02c","#e31a1c","#ff7f00","#6a3d9a","#b15928"]);


  vis.updateVis();
}

Vis5.prototype.updateVis = function() {
  var vis = this;

  vis.regScale.domain(vis.regions);
  vis.watScale.domain([0,60]);
  vis.sanScale.domain([0,100]);
  vis.popScale.domain([180000,1400000000]);


  vis.tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
    var value;
    return d.Country + ", " + d.WHO_region + "<br> Population: " + d.UN_Population.toLocaleString() + "<br>Population without improved sanitation facilities: " + d.Improved_Sanitation_2015.toFixed(1) + "%<br>Population without improved drinking water: " + d.Improved_Water_2015.toFixed(1) + "%";
  });

  /* Invoke the tip in the context of your visualization */
  vis.svg.call(vis.tip);

  vis.svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "country-circ")
  .attr("fill", function(d) {
    return vis.regScale(d.WHO_region);
  })
  .attr("stroke", "white")
  .attr("cy", function(d) {
    return vis.watScale(d.Improved_Water_2015);
      }) // Life Expectancy
  .attr("cx", function(d) {
    return vis.sanScale(d.Improved_Sanitation_2015);
      }) // Income per Person
  .attr("r", function(d) {
    return vis.popScale(d.UN_Population);
  })
  .on('mouseover', vis.tip.show)
  .on('mouseout', vis.tip.hide);

  vis.sanScale2 = d3.scale.linear()
  .domain([0,1])
  .range([vis.margin.left,vis.width-vis.margin.right]);
  
  vis.xAxis = d3.svg.axis()
  .scale(vis.sanScale2)
  .tickFormat(d3.format("%"))
  .orient("bottom");

  vis.watScale2 = d3.scale.linear()
  .domain([0,.6])
  .range([vis.height - vis.margin.top,0]);

  vis.yAxis = d3.svg.axis()
  .tickFormat(d3.format("%")).scale(vis.watScale2).orient("left");


  vis.svg.append("g")
  .attr("transform","translate(0," + vis.height + ")")
  .attr("class","axis x-axis")
  .call(vis.xAxis);

  vis.svg.append("g")
  .attr("transform","translate(" + (vis.margin.left/2) + ",0)")
  .attr("class","axis y-axis")
  .call(vis.yAxis);

  vis.svg.append("text")
  .attr("class", "x-label")
  .text( "% Population without Improved Sanitation Facilities" )
  .attr("text-anchor","end")
  .attr("y", vis.height - 5)
  .attr("x", vis.width - vis.margin.right);

  vis.ytextx = vis.margin.left/2+5;
  vis.ytexty = 0;
  var string = "rotate(90," + vis.ytextx.toString() + "," + vis.ytexty.toString() + ")";

  vis.svg.append("text")
  .attr("class", "y-label")
  .text( "% Population without Improved Drinking Water Sources" )
  .attr("transform",string)
  .attr("y", vis.ytexty)
  .attr("x", vis.ytextx);
}