/*
 *  Vis10 - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

Vis10 = function(_parentElement, _formElement) {
  this.parentElement = _parentElement;
  this.formElement = _formElement;

  this.countryDataCSV;
  this.countries;

  this.initVis();
};

Vis10.prototype.initVis = function() {
  var vis = this;

  queue()
  .defer(d3.json, "data/vis-10/africa.topo.json")
  .defer(d3.csv, "data/vis-10/global-water-sanitation-2015.csv")
  .await(wrangleData(error, mapTopJson, fullCountryDataCSV));

};

Vis10.prototype.wrangleData = function(error, mapTopJson, fullCountryDataCSV) {
  var vis = this;

  vis.countryDataCSV = fullCountryDataCSV.filter(function(d){ return d.WHO_region == "African" || d.WHO_region == "Eastern Mediterranean"; });
  vis.countries = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;

  for (var i = 0; i < vis.countryDataCSV.length; i++) {

    var dataCountry = vis.countryDataCSV[i].Code;
    var dataWat = 100 - parseFloat(vis.countryDataCSV[i].Improved_Water_2015);
    var dataSan = 100 - parseFloat(vis.countryDataCSV[i].Improved_Sanitation_2015);
    var dataPop = parseFloat(vis.countryDataCSV[i].UN_Population);

    //Find the corresponding state inside the GeoJSON
    for (var j = 0; j < countries.length; j++) {

      var jsonCountry = countries[j].properties.adm0_a3_is;

      if (dataCountry == jsonCountry) {

        //Copy the data value into the JSON
        if (dataWat) {
          vis.countries[j].properties.Improved_Water_2015 = dataWat;
        }
        if (dataSan) {
          vis.countries[j].properties.Improved_Sanitation_2015 = dataSan;
        }
        if (dataPop) {
          vis.countries[j].properties.UN_Population = dataPop;
        }
        break;
      }
    }
  }

  vis.createVis();

};

Vis10.prototype.createVis = function() {
  var vis = this;

  vis.margin = { top: 0, right: 60, bottom: 30, left: 0 };

  vis.width = 500 - vis.margin.left - vis.margin.right;
  vis.height = 500 - vis.margin.top - vis.margin.bottom;

  // SVG drawing area
  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .append("g")
  .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.colorWat = d3.scale.quantize()
  .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);
  vis.colorSan = d3.scale.quantize()
  .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);

  vis.pop = d3.scale.quantize()
  .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);

  vis.projection = d3.geo.mercator()
  .scale([300])
  .translate([width / 2, height / 2]);

  vis.path = d3.geo.path()
  .projection(vis.projection);

  d3.select(vis.formElement)
  .on("change", function() {
    updateChoropleth();
  });

  vis.updateVis();
};

Vis10.prototype.updateVis = function() {
  var vis = this;


  vis.colorSan.domain([0,100]);
  if (d3.select(vis.formElement).property("value") == "water") {
    vis.colorWat.domain([0,100]);
  } else if (d3.select(vis.formElement).property("value") == "water2") {
    vis.colorWat.domain([0,55]);
  }
  vis.pop.domain([180000,190000000]);

  if (d3.select(vis.formElement).property("value") == "water") {
    document.getElementById("africa-title").innerHTML = "Population without Improved Drinking Water Sources (%)";
  } else if (d3.select(vis.formElement).property("value") == "water2") {
    document.getElementById("africa-title").innerHTML = "Population without Improved Drinking Water Sources (% scaled to worst)";
  } else if (d3.select(vis.formElement).property("value") == "sanitation") {
    document.getElementById("africa-title").innerHTML = "Population without Improved Sanitation Facilities (%)";
  } else {
    document.getElementById("africa-title").innerHTML = "Population";
  }


  vis.tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
    var value;
    if (d3.select(vis.formElement).property("value") == "water" || d3.select(vis.formElement).property("value") == "water2") {
      if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
        value = "No Data";
      } else {
        value = d.properties.Improved_Water_2015.toFixed(1) + "%";
      }
    } else if (d3.select(vis.formElement).property("value") == "sanitation") {
      value = "% population:";
      if (d.properties.Improved_Sanitation_2015 == undefined || d.properties.Improved_Sanitation_2015 == NaN) {
        value = "No Data";
      } else {
        value = d.properties.Improved_Sanitation_2015.toFixed(1) + "%";
      }
    } else {
      value = "Population:";
      if (d.properties.UN_Population == undefined || d.properties.UN_Population == NaN) {
        value = "No Data";
      } else {
        value = d.properties.UN_Population.toLocaleString();
      }
    }
    return d.properties.name + "<br>" + value;
  });

  /* Invoke the tip in the context of your visualization */
  vis.svg.call(tip);

  vis.map = vis.svg.selectAll("path")
  .data(vis.countries);

  vis.map.enter().append("path")
  .attr("d", vis.path)
  .attr("fill", function(d) {
    if (d3.select(vis.formElement).property("value") == "water" || d3.select(vis.formElement).property("value") == "water2") {
      if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
        return "#bdbdbd";
      } else {
        return vis.colorWat(d.properties.Improved_Water_2015);
      }
    } else if (d3.select(vis.formElement).property("value") == "sanitation") {
      if (d.properties.Improved_Sanitation_2015 == undefined || d.properties.Improved_Sanitation_2015 == NaN) {
        return "#bdbdbd";
      } else {
        return vis.colorSan(d.properties.Improved_Sanitation_2015);
      }
    } else {
      if (d.properties.UN_Population == undefined || d.properties.UN_Population == NaN) {
        return "#bdbdbd";
      } else {
        return vis.pop(d.properties.UN_Population);
      }
    }
  })
  .attr("class","country")
  .on('mouseover', vis.tip.show)
  .on('mouseout', vis.tip.hide);

  vis.map.transition().duration(200)
  .attr("fill", function(d) {
    if (d3.select(vis.formElement).property("value") == "water" || d3.select(vis.formElement).property("value") == "water2") {
      if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
        return "#bdbdbd";
      } else {
        return vis.colorWat(d.properties.Improved_Water_2015);
      }
    } else if (d3.select(vis.formElement).property("value") == "sanitation") {
      if (d.properties.Improved_Sanitation_2015 == undefined || d.properties.Improved_Sanitation_2015 == NaN) {
        return "#bdbdbd";
      } else {
        return vis.colorSan(d.properties.Improved_Sanitation_2015);
      }
    } else {
      if (d.properties.UN_Population == undefined || d.properties.UN_Population == NaN) {
        return "#bdbdbd";
      } else {
        return vis.pop(d.properties.UN_Population);
      }
    }
  });

  vis.map.exit().remove();

  vis.legendScale;
  if (d3.select(vis.formElement).property("value") == "water" || d3.select(vis.formElement).property("value") == "water2"){
    vis.legendScale = vis.colorWat;
  } else if (d3.select(vis.formElement).property("value") == "sanitation") {
    vis.legendScale = vis.colorSan;
  } else {
    vis.legendScale = vis.pop;
  }

  vis.svg.select(".choroLegend").remove();

  vis.svg.append("g")
  .attr("class", "choroLegend")
  .attr("transform", "translate(100,300)");

  vis.choroLegend = d3.legend.color()
  .shapeWidth(30)
  .orient('vertical')
  .scale(vis.legendScale);

  vis.svg.select(".choroLegend")
  .call(vis.choroLegend);
}