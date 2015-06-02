var LocationGetter = (function() {
  var locationJSON,
      $form;
 
  var _saveLocation = function(position) {
    var locationString = '{"latitude": "' + position.coords.latitude + 
    '", "longitude": "' + position.coords.longitude + '"}';
    locationJSON = $.parseJSON(locationString);
    $form.find("#location_longitude").val(locationJSON.longitude);
    $form.find("input#location_latitude").val(locationJSON.latitude);
    console.log("Mascarade");  
    console.log("heresS");
    //$("body").addClass("loading");
    console.log("Mascarade");  
    /*$("#new_location").find(".js-submit").on('click', function(e) {
         //e.preventDefault();
         //$form.find(".js-submit").unbind('click');
         console.log("Root2");
         $body.addClass("loading");
         DateTimeGetter.init($form);

         LocationGetter.init($form);
      });*/
    console.log("Mascarade");
    $form.find(".js-submit").unbind('click');
    $form.find(".js-submit").click();
    console.log("Root21-revol");
    setTimeout(function(){
      //$("#new_location").find(".js-submit").on('click', function(e) {
      $form.find(".js-submit").on('click', function(e) {
         e.preventDefault();
         $form.find(".js-submit").unbind('click');
         console.log("Root2-inside");
         $body.addClass("loading");
         DateTimeGetter.init($form);

         LocationGetter.init($form);
      });},1000);

  }

  var _getLocation = function(callback) {
    console.log("hereGetLoc");
    if(navigator) {
      if(navigator.geolocation) {
        navigator.geolocation.distanceFilter = 10;
        console.log("Hereif");
        navigator.geolocation.getCurrentPosition(callback, function(obj) {
          console.log("Failure");
          console.log(obj);
        }, {timeout:1000});
      }
    }
  }

  var init = function (form) {
    $form = form;
    console.log("here");
    _getLocation(_saveLocation);
  }

  var location = function () {
    return locationJSON;
  }

  return {
    init: init,
    location: location
  };
}());