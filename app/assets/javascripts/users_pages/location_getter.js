var LocationGetter = (function() {
  var locationJSON;

  var _saveLocation = function(location) {
    locationString = '{"latitude": "' + location.coords.latitude + 
    '", "longitude": "' + location.coords.longitude + '"}';
    locationJSON = $.parseJSON(locationString);
    //console.log(locationJSON);
  }

  var _getLocation = function(callback) {
    if(navigator) {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
      }
    }
  }

  var init = function () {
    _getLocation(_saveLocation)
  }

  var location = function () {
    return locationJSON;
  }

  return {
    init: init,
    location: location
  };
}());