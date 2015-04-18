var LocationGetter = (function() {
  var locationJSON;

  var _saveLocation = function(position) {
    var locationString = '{"latitude": "' + position.coords.latitude + 
    '", "longitude": "' + position.coords.longitude + '"}';
    locationJSON = $.parseJSON(locationString);
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