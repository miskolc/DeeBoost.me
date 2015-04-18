var LocationGetter = (function() {

  this.saveLocation = function(location) {
    locationString = '{"latitude": "' + location.coords.latitude + 
    '", "longitude": "' + location.coords.longitude + '"}';
    locationJSON = $.parseJSON(locationString);
    console.log(locationJSON);
  }

  this.getLocation = function(callback) {
    if(navigator) {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
      }
    }
  }

  return this;
}());