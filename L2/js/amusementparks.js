/**
 * Created by Daniel on 9/13/16.
 */
var amusementRides = [
    {
        id: "0",
        name: "Bowler Coater",
        price: 30,
        openingdays: ["Monday","Tuesday","Wednesday"],
        limitedaccess: true
    },
    {
        id: "1",
        name: "Jumper Carbs",
        price: 20,
        openingdays: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        limitedaccess: false
    },
    {
        id: "2",
        name: "Jerry Go Bound",
        price: 50,
        openingdays: ["Sunday","Saturday"],
        limitedaccess: true
    }
];

// Implementation of the function
function doublePrices(rides) {
    var temp = rides;
    temp.forEach(function(ride) {
        if (ride.id != "1") {
            ride.price = ride.price * 2;
            // console.log(amusementRides[0].price);
            // console.log(amusementRides[1].price);
            // console.log(amusementRides[2].price)
            // console.log(ride.price)
        }

    });
    return temp;
}


var amusementRidesDouble = doublePrices(amusementRides);

function debugAmusementRides(rides) {
    rides.forEach(function(ride) {
       console.log(ride.name + ", $" + ride.price);
    });
}

function stringAmusementRides(rides) {
    var string = "";
    rides.forEach(function(ride) {
        string += ride.name + ", $" + ride.price + "<br/>";
    });
    return string;
}

document.getElementById("ridesPrices").innerHTML = stringAmusementRides(amusementRidesDouble);
