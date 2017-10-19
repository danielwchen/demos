d3.csv("Template3/data/buildings.csv", function(data) {
    console.log(data);

    data = data.sort( function(a,b) {
        return b.height_px - a.height_px;
    });

    data.forEach(function(building) {
        building.height_px = +building.height_px;
    });

    updateDisplay(data[0]);

    var buildings = d3.select("#bars").append("svg")
        .attr("width", 500)
        .attr("height", 500);



    buildings.selectAll(".building-labels")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "building-labels")
        .text( function (d) {
            return d.building;
        })
        .attr("text-anchor","end")
        .attr("y", function(d, index) {
            return index * 30 + 15;
        })
        .attr("x", 200)
        .attr("fill","white")
        .on("click", function(d) {
            updateDisplay(d);
        });


    buildings.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "building-bars")
        .attr("fill", "black")
        .attr("y", function(d, index) {
            return index * 30;
        })
        .attr("x", 205)
        .attr("height", 20)
        .attr("width", function(d) {
            return d.height_px;
        })
        .attr("fill", "white")
        .on("click", function(d) {
            updateDisplay(d);
        });

    buildings.selectAll(".height-labels")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "height-labels")
        .text( function (d) {
            return d.height_m;
        })
        // .attr("text-anchor","end")
        .attr("y", function(d, index) {
            return index * 30 + 15;
        })
        .attr("x", function(d) {
            return d.height_px + 175;
        })
        .attr("fill","navy")
        .on("click", function(d, index) {
            updateDisplay(d, index);
        });

    var labels = d3.select("#labels").append("svg")
        .attr("width", 500)
        .attr("height", 500);
});

function updateDisplay(d) {
    document.getElementById("building-image").innerHTML = "<img src=\"img/" + d.image + "\" width='80%'>";
    document.getElementById("building-name").innerHTML = d.building.toString();
    document.getElementById("height").innerHTML = d.height_m.toString();
    document.getElementById("city").innerHTML = d.city.toString();
    document.getElementById("country").innerHTML = d.country.toString();
    document.getElementById("floors").innerHTML = d.floors.toString();
    document.getElementById("completed").innerHTML = d.completed.toString();
    document.getElementById("link").innerHTML = "<a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/" + d.building.split(' ').join('_') + "\">Read More</a>";

}
function getSummary(d) {
    var string = "";

    string += "Number of pizza deliveries: " + deliv.length + "<br/>";
    string += "Number of all delivered pizzas: " + countPizzas(deliv) + "<br/>";
    string += "Average delivery time: " + getAvgTime(deliv).toFixed(2) + "<br/>";
    string += "Total sales in USD: " + getTotalPrice(deliv).toFixed(2) + "<br/>";
    string += "Number of all feedback entries: " + feedb.length + "<br/>";
    var feedbackLowMedHig = splitFeedback(feedb);
    string += "Number of feedback entries per quality category: " + feedbackLowMedHig[0] + " (low), " + feedbackLowMedHig[1] + " (medium), " + feedbackLowMedHig[2] + " (high)<br/>";
    return string;
}