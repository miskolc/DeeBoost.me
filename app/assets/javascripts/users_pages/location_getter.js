var LocationGetter = (function() {
  var locationJSON,
      $form;

  var _saveLocation = function(position) {
    var locationString = '{"latitude": "' + position.coords.latitude + 
    '", "longitude": "' + position.coords.longitude + '"}';
    locationJSON = $.parseJSON(locationString);
    $form.find("#location_longitude").val(locationJSON.longitude);
    $form.find("input#location_latitude").val(locationJSON.latitude);
    console.log("Done");
    console.log(locationJSON);
    console.log($form.find("#location_longitude").val());
    $form.submit();
  }

  var _getLocation = function(callback) {
    if(navigator) {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
      }
    }
  }

  var init = function (form) {
    $form = form;
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