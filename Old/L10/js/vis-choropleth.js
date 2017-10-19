var margin = { top: 0, right: 60, bottom: 30, left: 0 };

var width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// SVG drawing area
var svg = d3.select("#chloropleth").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colorWat = d3.scale.quantize()
    .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);
var colorSan = d3.scale.quantize()
    .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);


// .range(["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]);
// var colorSan = d3.scale.quantize()
//     .domain([0,100])
//     .range(["#e5f5e0"
// #c7e9c0
// #a1d99b
// #74c476
// #41ab5d
// #238b45
// #006d2c
// #00441b"])
var pop = d3.scale.quantize()
    .range(["#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);
    // .range(["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]);

var projection = d3.geo.mercator()
    .scale([300])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var countryDataCSV;
var countries;

queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, fullCountryDataCSV){
    
    // --> PROCESS DATA
      countryDataCSV = fullCountryDataCSV.filter(function(d){ return d.WHO_region == "African" || d.WHO_region == "Eastern Mediterranean"; });
      countries = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;
      // var max = 0;
      // var min = Infinity;


      for (var i = 0; i < countryDataCSV.length; i++) {

          var dataCountry = countryDataCSV[i].Code;
          var dataWat = 100 - parseFloat(countryDataCSV[i].Improved_Water_2015);
          var dataSan = 100 - parseFloat(countryDataCSV[i].Improved_Sanitation_2015);
          var dataPop = parseFloat(countryDataCSV[i].UN_Population);
          // if (dataPop > max) {
          //     max = dataPop;
          // }
          // if (dataPop < min) {
          //     min = dataPop;
          // }

          //Find the corresponding state inside the GeoJSON
          for (var j = 0; j < countries.length; j++) {

              var jsonCountry = countries[j].properties.adm0_a3_is;

              if (dataCountry == jsonCountry) {

                  //Copy the data value into the JSON
                  if (dataWat) {
                      countries[j].properties.Improved_Water_2015 = dataWat;
                  }
                  if (dataSan) {
                      countries[j].properties.Improved_Sanitation_2015 = dataSan;
                  }
                  if (dataPop) {
                      countries[j].properties.UN_Population = dataPop;
                  }
                  break;
              }
          }
      }
      // console.log(min);
      // console.log(max);

      updateChoropleth();
  });
    

function updateChoropleth() {
    colorSan.domain([0,100]);
    if (d3.select(".form-control").property("value") == "water") {
        colorWat.domain([0,100]);
    } else if (d3.select(".form-control").property("value") == "water2") {
        colorWat.domain([0,55]);
    }
    pop.domain([180000,190000000]);

    if (d3.select(".form-control").property("value") == "water") {
        document.getElementById("africa-title").innerHTML = "Population without Improved Drinking Water Sources (%)";
    } else if (d3.select(".form-control").property("value") == "water2") {
        document.getElementById("africa-title").innerHTML = "Population without Improved Drinking Water Sources (% scaled to worst)";
    } else if (d3.select(".form-control").property("value") == "sanitation") {
        document.getElementById("africa-title").innerHTML = "Population without Improved Sanitation Facilities (%)";
    } else {
        document.getElementById("africa-title").innerHTML = "Population";
    }


    var tip = d3.tip().attr('class', 'd3-tip').offset([-10,0]).html(function(d) {
        var value;
        if (d3.select(".form-control").property("value") == "water" || d3.select(".form-control").property("value") == "water2") {
            if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
                value = "No Data";
            } else {
                value = d.properties.Improved_Water_2015.toFixed(1) + "%";
            }
        } else if (d3.select(".form-control").property("value") == "sanitation") {
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
    svg.call(tip);

    var map = svg.selectAll("path")
        .data(countries);

    map.enter().append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            if (d3.select(".form-control").property("value") == "water" || d3.select(".form-control").property("value") == "water2") {
                if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
                    return "#bdbdbd";
                } else {
                    return colorWat(d.properties.Improved_Water_2015);
                }
            } else if (d3.select(".form-control").property("value") == "sanitation") {
                if (d.properties.Improved_Sanitation_2015 == undefined || d.properties.Improved_Sanitation_2015 == NaN) {
                    return "#bdbdbd";
                } else {
                    return colorSan(d.properties.Improved_Sanitation_2015);
                }
            } else {
                if (d.properties.UN_Population == undefined || d.properties.UN_Population == NaN) {
                    return "#bdbdbd";
                } else {
                    return pop(d.properties.UN_Population);
                }
            }
        })
        .attr("class","country")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    map.transition()
        .attr("fill", function(d) {
            if (d3.select(".form-control").property("value") == "water" || d3.select(".form-control").property("value") == "water2") {
                if (d.properties.Improved_Water_2015 == undefined || d.properties.Improved_Water_2015 == NaN) {
                    return "#bdbdbd";
                } else {
                    return colorWat(d.properties.Improved_Water_2015);
                }
            } else if (d3.select(".form-control").property("value") == "sanitation") {
                if (d.properties.Improved_Sanitation_2015 == undefined || d.properties.Improved_Sanitation_2015 == NaN) {
                    return "#bdbdbd";
                } else {
                    return colorSan(d.properties.Improved_Sanitation_2015);
                }
            } else {
                if (d.properties.UN_Population == undefined || d.properties.UN_Population == NaN) {
                    return "#bdbdbd";
                } else {
                    return pop(d.properties.UN_Population);
                }
            }
        });

    map.exit().remove();

    var legendScale;
    if (d3.select(".form-control").property("value") == "water" || d3.select(".form-control").property("value") == "water2"){
        legendScale = colorWat;
    } else if (d3.select(".form-control").property("value") == "sanitation") {
        legendScale = colorSan;
    } else {
        legendScale = pop;
    }

    svg.select(".choroLegend").remove();

    svg.append("g")
        .attr("class", "choroLegend")
        .attr("transform", "translate(100,300)");

    var choroLegend = d3.legend.color()
        .shapeWidth(30)
        .orient('vertical')
        .scale(legendScale);

    svg.select(".choroLegend")
        .call(choroLegend);

}

d3.select(".form-control")
    .on("change", function() {
        updateChoropleth();
    });
