/*
 *  Vis5Legend - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

Vis5Legend = function(_parentElement) {
  this.parentElement = _parentElement;

  this.initVis();
};

Vis5Legend.prototype.initVis = function() {
  var vis = this;

  vis.popScale = d3.scale.linear()
  .domain([180000,1400000000])
  .range([6,40]);

  vis.colors = [
  { region: "African", color: "#1f78b4" },
  { region: "E. Mediterranean", color: "#33a02c" },
  { region: "European", color: "#e31a1c" },
  { region: "Region of Americas", color: "#ff7f00" },
  { region: "SE. Asia", color: "#6a3d9a" },
  { region: "W. Pacific", color: "#b15928" }
  ];
  vis.sizes = [
  { population: "180,000", size: vis.popScale(180000) },
  { population: "200,000,000", size: vis.popScale(200000000) },
  { population: "800,000,000", size: vis.popScale(800000000) },
  { population: "1,400,000,000", size: vis.popScale(1400000000) }
  ];

  vis.createVis();
}

Vis5Legend.prototype.createVis = function() {
  var vis = this;

  // Margin object with properties for the four directions
  vis.margin = {top: 20, right: 10, bottom: 30, left: 10};
    // Width and height as the inner dimensions of the chart area
    vis.width = 200 - vis.margin.left - vis.margin.right;
    vis.height = 565 - vis.margin.top - vis.margin.bottom;
    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    vis.svg = d3.select(vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg.append("text").text("Legend")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",vis.width/2)
    .attr("y",5)
    .attr("font-size","large");

    vis.svg.append("text").text("Population")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",vis.width/2)
    .attr("y",30);

    var answer = 0;
    var prev = 0;
    var answers = [];
    vis.svg.selectAll(".legend-circ")
    .data(vis.sizes)
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
    .attr("cx", vis.width/2);


    vis.svg.selectAll(".legend-circ-labels")
    .data(vis.sizes)
    .enter()
    .append("text")
    .attr("class","legend-circ-labels")
    .attr("y", function(d, index) {
      return answers[index] + 5;
    } )
    .attr("x", vis.width/2)
    .attr("text-anchor","middle")
    .text(function(d) {
      return d.population;
    });

    vis.svg.append("text").text("Region")
    .attr("class","legend-title")
    .attr("text-decoration","underline")
    .attr("text-anchor","middle")
    .attr("x",vis.width/2)
    .attr("y",260);

    vis.svg.selectAll(".legend-rect")
    .data(vis.colors)
    .enter()
    .append("rect")
    .attr("class","legend-rect")
    .attr("height",40)
    .attr("width",vis.width+20)
    .attr("y", function(d, index) {
      return index * 41 + 270;
    })
    .attr("x", -10)
    .attr("fill",function(d) {
      return d.color;
    });

    vis.svg.selectAll(".legend-rect-labels")
    .data(vis.colors)
    .enter()
    .append("text")
    .attr("class","legend-rect-labels")
    .attr("y", function(d, index) {
      return index * 41 + 295;
    } )
    .attr("x", vis.width/2)
    .attr("text-anchor","middle")
    .text(function(d) {
      return d.region;
    });
  }