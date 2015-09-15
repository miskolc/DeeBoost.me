var ChartDrawer = (function () {
  var anglesJSON,
      parsedAngles,
      sunbathingStart,
      sunbathingEnd,
      $elevationAngleKnob,
      $sunbathingTimeKnob,
      $sunbathingStartKnob,
      $sunbathingEndKnob;


  var _getKnobs = function() {
    $elevationAngleKnob = $(".js-knob-elevation-angle");
    $sunbathingTimeKnob = $(".js-knob-sunbathing-time");
    $sunbathingStartKnob = $(".js-knob-sunbathing-start");
    $sunbathingEndKnob = $(".js-knob-sunbathing-end");
  }

  var _currentTimeSeconds = function( ) {
    var date = new Date();
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  var _currentTime = function () {
    var date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()];
  }

  var _updateCurrentElevationAngle = function(knobElement) {
    knobElement.val(currentElevationAngle()).trigger("change");
    setTimeout(function() {
      _updateCurrentElevationAngle(knobElement)
    }, 1000);
  }

  var timeToSeconds = function (hour, minute, second) {
    second = (typeof second === 'undefined') ? 0 : second; //second is optional
    return hour * 3600 + minute * 60 + second;
  }

  var currentElevationAngle = function () {
    var currentTime = _currentTime(),
        currentAnglePosition;
    currentAnglePosition = currentTime[0] * 6 + Math.floor(currentTime[1]/10);
    return Math.floor(anglesJSON[currentAnglePosition]["elevation_angle"]);
  }

  var parseLocationAngles = function(locationAngles) {
    var angles = [], foundAngleAbove = false;
    sunbathingStart = {hour: 0, minute: 0, second: 0},
    sunbathingEnd = {hour: 0, minute: 0, second:0 },
    angles = locationAngles.angles.map(function(angle) {
      var parsed = []; coord = {}; 
      coord["v"]= [angle["hour"],angle["minute"],0]; 
      if(angle["minute"] === 0) {
        var hour = angle["hour"] == 12 ? 12 : (angle["hour"] % 12);
        coord["f"]= hour.toString()+" "+ (angle["hour"] < 12 ? "am": "pm"); 
      } else {
        coord["f"]= "";
      }
      parsed.push(coord);
      under = angle["elevation_angle"] > 50 ? 50 : angle["elevation_angle"];
      above = angle["elevation_angle"] > 50 ? angle["elevation_angle"] - 50 : 0;
      parsed.push(under);
      parsed.push(above);
      if(angle["elevation_angle"] >= 50) {
        sunbathingEnd = angle;
        if(!foundAngleAbove) {
          foundAngleAbove = true;
          sunbathingStart = angle;
        }
      }
      return parsed; 
    });
    parsedAngles = angles;
  }

  var _drawSunBathingTimeKnob = function(sunbathingStartTime, sunbathingEndTime) {
    var totalSunbathingTime = sunbathingEndTime - sunbathingStartTime;
    var remainingSunbathingTime = sunbathingEndTime - _currentTimeSeconds();

    if(totalSunbathingTime < remainingSunbathingTime) {
      remainingSunbathingTime = 0;
    }

    $sunbathingTimeKnob.attr("data-max", totalSunbathingTime);
    $sunbathingTimeKnob.val(remainingSunbathingTime).trigger("change");

    KnobDrawer.init($sunbathingTimeKnob);
    KnobUpdater.init($sunbathingTimeKnob,-1);
  }

  var _drawSunBathingTimeKnobCases = function(sunbathingStartTime, sunbathingEndTime) {
    if(sunbathingStartTime > _currentTimeSeconds()) {
      _drawSunBathingTimeKnob(sunbathingStartTime, sunbathingEndTime);
      setTimeout( function () {
        _drawSunBathingTimeKnob(sunbathingStartTime, sunbathingEndTime);
      } , (sunbathingStartTime - _currentTimeSeconds()) * 1000 );
    } else {
        _drawSunBathingTimeKnob(sunbathingStartTime, sunbathingEndTime);
    }
  }

  var drawKnobs = function () {
    var totalSunbathingTime, remainingSunbathingTime,
        sunbathingStartTime, sunbathingEndTime;
    
    $elevationAngleKnob.val(currentElevationAngle);

    KnobDrawer.init($elevationAngleKnob);
    _updateCurrentElevationAngle($elevationAngleKnob);

    sunbathingStartTime = timeToSeconds(sunbathingStart.hour,
                                        sunbathingStart.minute,
                                        sunbathingStart.second);
    
    sunbathingEndTime = timeToSeconds(sunbathingEnd.hour,
                                      sunbathingEnd.minute,
                                      sunbathingEnd.second);
    _drawSunBathingTimeKnobCases(sunbathingStartTime, sunbathingEndTime);
    
    $sunbathingStartKnob.val(sunbathingStartTime).trigger("change");
    KnobDrawer.init($sunbathingStartKnob);
    
    $sunbathingEndKnob.val(sunbathingEndTime).trigger("change");
    KnobDrawer.init($sunbathingEndKnob);
    // KnobDrawer.init($currentTimeKnob);
    // KnobUpdater.init($currentTimeKnob,1);
  }

  var getLocationAngles = function() {
    var locationAngles;
    $.getJSON('/users/1/locations/1/days/1', function(data) {
      parsedJSON = parseJSON(data);
      //drawAxisTickColors 
    });
  }

  var drawAxisTickColors = function() {
    var data = new google.visualization.DataTable();
    
    data.addColumn('timeofday', 'Time of Day');
    data.addColumn('number', 'Bellow 50\xB0 (no vitamin D)' );
    data.addColumn('number', 'Above 50\xB0 (vitamin D)' );

    data.addRows(parsedAngles);

    var options = {
      title: 'Solar Elevation angle values today',
      focusTarget: 'category',
      colors: ['#2e6da4','#FF7E00'],
      is3D:true,
      hAxis: {
        title: 'Time of Day',
        format: 'h:mm a',
        viewWindow: {
          min: [0, 90, 0],
          max: [24, 90, 90]
        },
        textStyle: {
          fontSize: 14,
          color: '#2e6da4',
          bold: true,
          italic: false
        },
        titleTextStyle: {
          fontSize: 18,
          color: '#2e6da4',
          bold: true,
          italic: false
        }
      },
      vAxis: {
        title: 'Elevation angle (degrees)',
        textStyle: {
          fontSize: 18,
          color: '#2e6da4',
          bold: false,
          italic: false
        },
        titleTextStyle: {
          fontSize: 18,
          color: '#2e6da4',
          bold: true,
          italic: false
        }
      },
      isStacked: true,
      legend: { position: 'top', maxLines: 20 },
      bar: { groupWidth: '90%' }
    };
    $("body").removeClass("loading");
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    $(window).resize(function(){
      chart.draw(data, options);;
    });
  }

  var init = function () {
    var options = {packages: ['corechart', 'bar'], callback: drawAxisTickColors},
        anglesURL = '/users/' + 
                    $("#chart_div").data('current-user') +
                    '/current_location/current_day';
    _getKnobs();
    $.getJSON( anglesURL, function(data) {
      anglesJSON = data.angles;
      parseLocationAngles(data);
      drawKnobs();
      // KnobDrawer.init($elevationAngleKnob);
      // KnobDrawer.init($sunbathingTimeKnob);
      // KnobUpdater.init($sunbathingTimeKnob,-1);
      // KnobDrawer.init($currentTimeKnob);
      // KnobUpdater.init($currentTimeKnob,1);
      google.load('visualization', '1.1', options );
      google.setOnLoadCallback(function () {        
        drawAxisTickColors();
      });
    });
  }

  return {
    init: init,
    getLocationAngles: getLocationAngles,
    currentElevationAngle: currentElevationAngle
  };

}());