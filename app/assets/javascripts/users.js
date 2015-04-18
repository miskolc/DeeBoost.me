//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree ./application/core
//= require_tree ./application/addons
//= require_tree ./users_pages

$(document).on('ready page:change', function () {
  (function(){
    var $noLocation = $(".no-location"),
        $form = $("#new_location"),
        gpsLocation;
    if($noLocation.length === 1) {
      console.log("No Location");
      LocationGetter.init();
      console.log("Here1");
      setTimeout(function(){
        gpsLocation = LocationGetter.location();
        console.log("Here2");
        console.log(gpsLocation);
        $form.find("#location_longitude").val(gpsLocation.longitude);
        console.log("Here3");
        $form.find("input#location_latitude").val(gpsLocation.latitude);
        console.log("Here4");
        $form.submit();
      },5000);
    } else {
      console.log("Has Location");
    }
  })();
});