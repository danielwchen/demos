

// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART
createVisualization();

function createVisualization() {
	var delivery = deliveryData;
	var feedback = feedbackData;

	var filteredDeliv = filterDeliveries(delivery);
	var filteredFeedb = filterFeedback(filteredDeliv,feedback);

	document.getElementById("summary").innerHTML = getSummary(filteredDeliv,filteredFeedb);
	renderBarChart(filteredDeliv);
}

function filterDeliveries(deliv) {
	var areaBox = document.getElementById("area-category");
	var selectedArea = areaBox.options[areaBox.selectedIndex].value;
	var orderBox = document.getElementById("order-category");
	var selectedOrder = orderBox.options[orderBox.selectedIndex].value;

	if (selectedOrder == "All") {
		if (selectedArea == "All") {
			return deliv;
		} else {
			return deliv.filter(function (value, index) {
				return value.area == selectedArea;
			});
		}
	} else {
		var filteredDeliveriesByOrder = deliv.filter(function (value, index) {
			return value.order_type == selectedOrder;
		});

		if (selectedArea == "All") {
			return filteredDeliveriesByOrder;
		} else {
			return filteredDeliveriesByOrder.filter(function (value, index) {
				return value.area == selectedArea;
			});
		}
	}
}

function filterFeedback(deliv,feedb) {
	var filtered = [];
	deliv.forEach(function(del) {
		// for (var i = 0; i < feedb.length; ++i) {
		// 	if (feedb[i].delivery_id == del.delivery_id) {
		// 		filtered.push(feedb[i]);
		// 	}
		// }
		filtered.push(feedb.find(function(fee) {
			return fee.delivery_id == del.delivery_id;
		}));
	});

	return filtered.filter(function(del) { return del != undefined });
}

function getSummary(deliv, feedb) {
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

function countPizzas(deliv) {
	var counter = 0;
	deliv.forEach(function(del) {
		counter += del.count;
	});
	return counter;
}

function getAvgTime(deliv) {
	var totaltime = 0;
	deliv.forEach(function(del) {
		totaltime += del.delivery_time;
	});
	return totaltime/deliv.length;
}

function getTotalPrice(deliv) {
	var totalPrice = 0;
	deliv.forEach(function(del) {
		totalPrice += del.price;
	});
	return totalPrice;
}

// returns number of low, medium, and high feedback entries as an array
function splitFeedback(feedb) {
	var sums = [0,0,0];
	feedb.forEach(function(fee) {

		if (fee.quality == "low") {
			sums[0] += 1;
		} else if (fee.quality == "medium") {
			sums[1] += 1;
		} else {
			sums[2] += 1;
		}
	});
	return sums;
}
