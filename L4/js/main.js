
// SVG Size
var width = 700,
    height = 500;


// Load CSV file
d3.csv("L4/data/wealth-health-2014.csv", function(data){

    // Example data: Country:"Lesotho",Income:"2494",LifeExpectancy:"48.4",Population:"2109197",Region:"Sub-Saharan Africa"

    // Convert numeric values
    data.forEach(function(country) {
        country.Income = +country.Income;
        country.LifeExpectancy = +country.LifeExpectancy;
        country.Population = +country.Population;
    });

    data.sort(function(a,b) {
        return b.Population - a.Population;
    });

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", 1000)
        .attr("height", 1000);

    var padding = 40;

    var incomeScale = d3.scale.log()
        .domain(d3.extent(data, function(d) {
            return d.Income;
        }))
        .range([padding + 20, width - padding]);

    var lifeExpectancyScale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.LifeExpectancy;
        }))
        .range([height - padding, padding]);

    var populationScale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.Population;
        }))
        .range([4,30]);

    var regionColorScale=d3.scale.category20()
        .domain(data.map(function(d) {
            return d.Region;
        }));

    // var group = svg.append("g");

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "country-circ")
        .attr("fill", function(d) {
            return regionColorScale(d.Region);
        })
        .attr("stroke", "black")
        .attr("cy", function(d) {
            return lifeExpectancyScale(d.LifeExpectancy);
        }) // Life Expectancy
        .attr("cx", function(d) {
            return incomeScale(d.Income);
        }) // Income per Person
        .attr("r", function(d) {
            return populationScale(d.Population);
        }); // Population;

    // .on("click", function(d) {
    // 	updateDisplay(d);
    // })

    var xAxis = d3.svg.axis()
        .scale(incomeScale)
        .tickFormat(d3.format(",.0f"))
        .orient("bottom")
        .tickValues([1000, 2000, 4000, 10000, 30000, 100000]);

    var yAxis = d3.svg.axis();

    yAxis.scale(lifeExpectancyScale);

    yAxis.orient("left");

    svg.append("g")
        .attr("transform","translate(0,500)")
        .attr("class","axis x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform","translate(30,0)")
        .attr("class","axis y-axis")
        .call(yAxis);



    svg.append("text")
        .attr("class", "x-label")
        .text( "Income per Person" )
        .attr("text-anchor","end")
        .attr("y", 490)
        .attr("x", width - 40);

    var testx = 40;
    var testy = 40;
    var string = "rotate(90,"+testx.toString()+","+testy.toString()+")";

    svg.append("text")
        .attr("class", "y-label")
        .text( "Life Expectancy" )
        .attr("transform",string)
        .attr("y", 40)
        .attr("x", 40);

});


