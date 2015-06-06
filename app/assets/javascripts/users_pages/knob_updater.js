var KnobUpdater = (function() {
  
  var _overflow = function (newVal, oldVal) {
    return ( oldVal + updater != newVal );
  };

  var _update = function ($knobElement, updater) {
    var newTime = "",
        time = [];
    // get hours minutes and seconds as an array
    time = $knobElement.val().match(/\d+/g);
    second = parseInt(time[2]);
    minute = parseInt(time[1]);
    hour = parseInt(time[0]);
    
    newTime = hour * 3600 + minute * 60 + second + updater;
    $knobElement.val(newTime).trigger("change");
    if(newTime >= 0) {
      setTimeout(function() {
        _update($knobElement, updater)
      }, 1000);
    }
  };   

  // updater can take {-1, 1} as values
  var init = function ($knobElement, updater) {
    _update($knobElement, updater);
  };

  return {
    init : init
  };
}());