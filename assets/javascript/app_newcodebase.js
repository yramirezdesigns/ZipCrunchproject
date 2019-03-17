var restaurantMapsurl;
var restaurantName;
var restaurantRating;
var restaurantPhonenumber;
var restaurantLatitude;
var restaurantLongitude;
var restaurantAddress;
var ID;
var map;
var newUrl = "search.html"; 
var place;
var defaultID="ChIJe4OMvj72wokRoVLJ42Dlle8";
$(document).ready(function () {

  function initmap(){
session_storage("get");
displayData();
     }

 var result = {
        Address: "",
        PhoneNumber: "",
        Rating: "5",
        Url: "",
        Longitude: 0.00,
        Latitude: 0.00,
        Place_ID: ""
    };

    //Functions

    var searchIndex = new google.maps.places.Autocomplete(document.getElementById('restaurant'), {
        types: ['establishment'] //establishmentsrestaurant
    });
    var search = new google.maps.places.Autocomplete(document.getElementById('restaurantSearch'), {
        types: ['establishment'] //establishmentsrestaurant
    });

    google.maps.event.addListener(search, 'place_changed', function () {
        place = search.getPlace();
        result.Latitude = place.geometry.location.lat();
        restaurantLatitude = result.lat;
        console.log("Latitude: " + result.Latitude);
        result.Longitude = place.geometry.location.lng();
        restaurantLongitude = result.Longitude;
        console.log("Longitude " + result.Longitude);
        restaurantAddress = place.formatted_address;
        restaurantMapsurl = place.url;
        restaurantName = place.name;
        restaurantRating = place.rating;
        restaurantPhonenumber = place.formatted_phone_number;
        ID = place.place_id;
            session_storage("set");
    });

    google.maps.event.addListener(searchIndex, 'place_changed', function () {
        place = searchIndex.getPlace();
        result.Latitude = place.geometry.location.lat();
        restaurantLatitude = result.lat;
        console.log("Latitude: " + result.Latitude);
        result.Longitude = place.geometry.location.lng();
        restaurantLongitude = result.Longitude;
        console.log("Longitude " + result.Longitude);
        restaurantAddress = place.formatted_address;
        restaurantMapsurl = place.url;
        restaurantName = place.name;
        restaurantRating = place.rating;
        restaurantPhonenumber = place.formatted_phone_number;
        ID = place.place_id;
            session_storage("set");
    });

    function session_storage(get_set) {
        if (get_set === "get") {
            restaurantAddress = sessionStorage.getItem('Address');
            restaurantMapsurl = sessionStorage.getItem('Mapsurl');
            restaurantName = sessionStorage.getItem('Name');
            restaurantPhonenumber = sessionStorage.getItem('Phonenumber');
            restaurantLongitude = sessionStorage.getItem('Long');
            restaurantLatitude = sessionStorage.getItem('Lat');
            ID = sessionStorage.getItem('ID');
            console.log("Session Retrieved");
            $("#iframemap").attr('src', "https://www.google.com/maps/embed/v1/place?q=" + "place_id:" + ID + "&key=AIzaSyD6YVIuEd-kLyPvEHqlevxoet8_Bk5TIQE");
            $("#iframemap2").attr('src', "https://www.google.com/maps/embed/v1/place?q=" + "place_id:" + ID + "&key=AIzaSyD6YVIuEd-kLyPvEHqlevxoet8_Bk5TIQE");

            console.log("Map src set to " + "https:www.google.com/maps/embed/v1/place?q=" + "place_id:" + ID + "&key=AIzaSyD6YVIuEd-kLyPvEHqlevxoet8_Bk5TIQE");
            displayData();

        }
        if (get_set === "set") {

            sessionStorage.clear();
            sessionStorage.setItem('Address', place.formatted_address);
            sessionStorage.setItem('Mapsurl', place.url);
            sessionStorage.setItem('Name', place.name);
            sessionStorage.setItem('Rating', place.rating);
            sessionStorage.setItem('Phonenumber', place.formatted_phone_number);
            sessionStorage.setItem('Long', place.geometry.location.lat());
            sessionStorage.setItem('Lat', place.geometry.location.lng());
            sessionStorage.setItem('ID', place.place_id);
            console.log("session saved");
        }
        if (get_set === "Clear") {
            sessionStorage.clear();
        }
    }
    function updateDisplay() {
        session_storage("get");
        console.log("retrieving session_storage");
        displayData();
        console.log("DisplayData()");

        healthGrade();

        console.log("healthgrade()");

    }
    function displayData(){
        $("#mapModalLabel").text(sessionStorage.getItem('Name'));
        $("#restaurantNameH3").text(sessionStorage.getItem('Name'));
        $("#restaurantInfoH5").text("Address: " + sessionStorage.getItem('Address'));
        $("#restaurantInfoP").text("Address: " + sessionStorage.getItem('Address') + "Phone Number: " + sessionStorage.getItem('Phonenumber'));
        $("#rating").text("Rating: " + sessionStorage.getItem('Rating'));
        $("#ratingPM").text("Rating: " + sessionStorage.getItem('Rating'));
    }

    function healthGrade() {
        var uncutAddress = restaurantAddress;
        var commaCutAddress = uncutAddress.split(",");
        var numberStreet = commaCutAddress[0];
        console.log(numberStreet);
        var spaceCut = numberStreet.split(" ");
        console.log(spaceCut);
        var addressNumber = spaceCut[0];
        console.log(addressNumber);
        var addressStreetArray = [];
        for(i=1; i < spaceCut.length; i++){
            addressStreetArray.push(spaceCut[i]);
        }
        console.log(addressStreetArray);
        var addressStreet = addressStreetArray.join();
        var newchar = '%20';
        addressStreet = addressStreet.split(',').join(newchar);
        addressStreet = addressStreet.toUpperCase();
        console.log(addressStreet);
        var getUrl = "https://data.cityofnewyork.us/resource/9w7m-hzhe.json?building=" + addressNumber + "&street=" + addressStreet + "&$$app_token=xdKYWuDFFFA53i7KV8ZYa4AtS";
        console.log(getUrl);
        $.ajax({
            url: getUrl,
            type: "GET",
        }).done(function (data) {
            console.log(data);
            var gradeDate = [];
            for(i=0; i < data.length; i++){
                if(data[i].grade_date != null){
                    gradeDate.push(new Date(data[i].grade_date));
                } else {
                    gradeDate.push(new Date("1970-01-01T00:00:00"));
                }
            console.log(gradeDate);
            }
            var maxDate=new Date(Math.max.apply(null,gradeDate));
            console.log(maxDate);
            var maxDateIndex;
            for (var i=0; i<gradeDate.length; i++){
                    console.log(maxDate);
                    console.log(gradeDate[i]);
                    if (gradeDate[i].getTime() === maxDate.getTime()){
                        maxDateIndex = i;
                        console.log(maxDateIndex);
                    }
            }
            console.log(maxDateIndex);
            var grade = data[maxDateIndex].grade;
            if (grade === "A") {
                $("#gradeId").attr("src", "assets/images/a.png");
                console.log(grade);
            } else if (grade === "B") {
                $("#gradeId").attr("src", "assets/images/b.png");
                console.log(grade);
            } else if (grade === "C") {
                $("#gradeId").attr("src", "assets/images/c.png");
                console.log(grade);
            } else if (grade === "Not Yet Graded") {
                $("#gradeId").attr("src", "assets/images/pending.png");
                console.log(grade);
            } else if  (grade === "Closed"){
                $("#gradeId").attr("src", "assets/images/pending.png");
                console.log(grade);
            }
      
        });
         }

    //CALLS
    $("#search_btnSearch").on("click", function () {
        session_storage("set");
        session_storage("get");
        $("#mapModalLabel").text(sessionStorage.getItem('Name'));
        $("#restaurantNameH3").text(sessionStorage.getItem('Name'));
        $("#restaurantInfoH5").text("Address: " + sessionStorage.getItem('Address'));
        $("#restaurantInfoP").text("Address: " + sessionStorage.getItem('Address') + "Phone Number: " + sessionStorage.getItem('Phonenumber'));
        $("#rating").text("Rating: " + sessionStorage.getItem('Rating'));
        $("#ratingPM").text("Rating: " + sessionStorage.getItem('Rating'));

    });

    $("#index_button_search").on("click", function () {
         session_storage("clear");
        session_storage("set");
        document.location.href = newUrl;
        session_storage("get");



     });

initmap();
//Document ready

});