var restaurantAddress;
var restaurantMapsurl;
var restaurantName;
var restaurantRating;
var restaurantPhonenumber;
var restaurantLatitude;
var ID;
var restaurantLongitude;
var lat;
var lng;
var place;
var map;

$(document).ready(function (){

    geomaps();

    function geomaps() {
        $("#search_btnSearch").click(function () {
            set_Restaurant_Variables();
            set_session_storage();
/*             var newUrl = "search.html";
            document.location.href = newUrl;  */
            healthGrade();
        });

        $("#index_button_search").click(function () {
            set_Restaurant_Variables();

            var newUrl = "search.html";
            document.location.href = newUrl;
            healthGrade();
            initMap();
        });


function initMap() {
    var myLatlng = { lat: -25.363, lng: 131.044 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng
    });
    var mylocation = new google.maps.LatLng(37.865025, -119.538308);
    var radius = 20;
    var requestObj = {
        radius: 80
    };
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.nearbySearch(requestObj, function (results, status) {
        console.log('Retrieved data:');
        console.log(results);
    });
}
        var search = new google.maps.places.Autocomplete(document.getElementById('restaurant'), {
            types: ['establishment']
        });
             google.maps.event.addListener(search, 'place_changed', function (){
           place = search.getPlace();
           var lat = place.geometry.location.lat();
           console.log(lat);
           var lng = place.geometry.location.lng();
           console.log(lng);
           //document.getElementById("output").innerHTML = "Lat: "+lat+"<br />Lng: "+lng
           set_Restaurant_Variables();
           set_session_storage();
           healthGrade();
       });

        function healthGrade() {
            var uncutAddress = sessionStorage.Address;
            var commaCutAddress = uncutAddress.split(",");
            var numberStreet = commaCutAddress[0];
            console.log(numberStreet);
            var spaceCut = numberStreet.split(" ");
            console.log(spaceCut);
            var addressNumber = spaceCut[0];
            console.log(addressNumber);
            var addressStreetArray = [];
            for (i = 1; i < spaceCut.length; i++) {
                addressStreetArray.push(spaceCut[i]);
            }
            console.log(addressStreetArray);
            var addressStreet = addressStreetArray.join();
            var newchar = '%20'
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
                var gradeDate = []
                for (i = 0; i < data.length; i++) {
                    if (data[i].grade_date != null) {
                        gradeDate.push(new Date(data[i].grade_date));
                    } else {
                        gradeDate.push(new Date("1970-01-01T00:00:00"));
                    }
                    console.log(gradeDate);
                }
                var maxDate = new Date(Math.max.apply(null, gradeDate));
                console.log(maxDate);
                var maxDateIndex;
                for (var i = 0; i < gradeDate.length; i++) {
                    console.log(maxDate);
                    console.log(gradeDate[i]);
                    if (gradeDate[i].getTime() === maxDate.getTime()) {
                        maxDateIndex = i;
                        console.log(maxDateIndex);
                    }
                }
                console.log(maxDateIndex);
                try {
                          var grade = data[maxDateIndex].grade;
                } catch (e) {
                  console.log("fail");
                } finally {
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
                } else if (grade === "Closed") {
                    $("#gradeId").attr("src", "assets/images/pending.png");
                    console.log(grade);
                }
                else {
                    console.log("Error in gradeId detection");
                }
              }
              $("#mapModalLabel").text(sessionStorage.getItem('Name'));
              $("#restaurantNameH3").text(sessionStorage.getItem('Name'));
              $("#restaurantInfoH5").text("Address: "+sessionStorage.getItem('Address'));
              $("#restaurantInfoP").text("Address: "+sessionStorage.getItem('Address')+"Phone Number: "+ sessionStorage.getItem('Phonenumber'));
              $("#rating").text("Rating: "+sessionStorage.getItem('Rating'));
              $("#ratingPM").text("Rating: "+sessionStorage.getItem('Rating'));
            $("iframe").attr('src', "https://www.google.com/maps/embed/v1/place?q=" +"place_id:" + ID + "&key=AIzaSyD6YVIuEd-kLyPvEHqlevxoet8_Bk5TIQE");
            });
        };
        function set_Restaurant_Variables() {
            sessionStorage.clear();
            restaurantAddress = place.formatted_address;
            restaurantMapsurl = place.url;
            restaurantName = place.name;
            restaurantRating = place.rating;
            restaurantPhonenumber = place.formatted_phone_number;
            ID = place.place_id;
            set_session_storage();
        }
        function set_session_storage() {
            sessionStorage.clear();
            sessionStorage.setItem('Address', restaurantAddress);
            sessionStorage.setItem('Mapsurl', restaurantMapsurl);
            sessionStorage.setItem('Name', restaurantName);
            sessionStorage.setItem('Rating', restaurantRating);
            sessionStorage.setItem('Phonenumber', restaurantPhonenumber);
            sessionStorage.setItem('Long', restaurantLongitude);
            sessionStorage.setItem('Lat', restaurantLatitude);
            sessionStorage.setItem('ID', ID);
        }
        function get_session_storage() {
            restaurantAddress = sessionStorage.getItem('Address');
            restaurantMapsurl = sssionStorage.getItem('Mapsurl');
            restaurantName = sessionStorage.getItem('Name');
            restaurantPhonenumber = sessionStorage.getItem('Phonenumber');
            restaurantLongitude = sessionStorage.getItem('Long');
            restaurantLatitude = sessionStorage.getItem('Lat');
            restaurantLatitude = sessionStorage.getItem('ID');
          
        }
healthGrade();
    }
});
