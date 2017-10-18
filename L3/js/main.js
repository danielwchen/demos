/**
 * Created by Daniel on 9/20/16.
 */
// d3.select("div")
//     .append("p")
//     .text("Dynamic Content");
//
// var sandwiches = [
//     { name: "Thesis", price: 7.95, size: "large" },
//     { name: "Dissertation", price: 8.95, size: "large" },
//     { name: "Highlander", price: 6.50, size: "small" },
//     { name: "Just Tuna", price: 6.50, size: "small" },
//     { name: "So-La", price: 7.95, size: "large" },
//     { name: "Special", price: 12.50, size: "small" }
// ];
//
// var svg = d3.select("body").append("svg")
//     .attr("width", 500)
//     .attr("height", 500);
//
// svg.selectAll("circle")
//     .data(sandwiches)
//     .enter()
//     .append("circle")
//     .attr("fill", function(d) {
//         if (d.price < 7) {
//             return "green";
//         } else {
//             return "red";
//         }
//     })
//     .attr("r", function(d) {
//         if (d.size == "small") {
//             return 10;
//         } else {
//             return 20;
//         }
//     })
//     .attr("cy", 60)
//     .attr("cx", function(d, index) {
//         return (index * 45 + 20);
//     })
//     .attr("stroke", "black");
//
// d3.csv("data/sandwiches.csv", function(data) {
//     // console.log(data);
// });

d3.csv("data/cities.csv", function(data) {
    var EUcities = data.filter( function (value, index) {
        return value.eu == "true";
    });

    document.getElementById("eucountries").innerHTML = EUcities.length.toString();
    EUcities.forEach(function(city) {
        city.x = +city.x;
        city.y = +city.y;
        city.population = +city.population;
    });

    var eusvg = d3.select("body").append("svg")
    .attr("width", 700)
    .attr("height", 550);

    eusvg.selectAll("circle")
        .data(EUcities)
        .enter()
        .append("circle")
        .attr("fill", "black")
        .attr("r", function(d) {
            if (d.population < 1000000) {
                return 4;
            } else {
                return 8;
            }
        })
        .attr("cy", function(d) {
            return d.x;
        })
        .attr("cx", function(d) {
            return d.y;
        })
        .attr("stroke", "blue");

    eusvg.selectAll("text")
        .data(EUcities)
        .enter()
        .append("text")
        .classed("city-label", true)
        .text( function (d) {
            return d.city
        })
        .attr("opacity", function(d) {
            if (d.population < 1000000) {
                return 0;
            } else {
                return 1;
            }
        })
        .attr("y", function(d) {
            return d.x;
        })
        .attr("x", function(d) {
            return d.y;
        })
        .attr("fill","red");


});