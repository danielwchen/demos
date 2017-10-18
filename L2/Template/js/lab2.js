
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

function dataFiltering() {
	var attractions = attractionData;

	attractions.sort( function (a,b) {
		return b.Visitors - a.Visitors;
	});

	var filteredAttractions = attractions.filter( function (value, index) {
		return index < 5;
	});


	renderBarChart(filteredAttractions);

}

function dataManipulation() {
	var selectBox = document.getElementById("attraction-category");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;

	if (selectedValue == "all") {
		dataFiltering();
	} else {
		var attractions = attractionData;

		var filteredAttractionsByCategory = attractions.filter( function (value, index) {
			return value.Category == selectedValue;
		});


		filteredAttractionsByCategory.sort( function (a,b) {
			return b.Visitors - a.Visitors;
		});

		var filteredAttractionsByCategory5 = filteredAttractionsByCategory.filter( function (value, index) {
			return index < 5;
		});

		renderBarChart(filteredAttractionsByCategory5);
	}

}

