var ChartDrawer = (function () {
  var anglesJSON,
      parsedAngles,
      sunbathingStart,
      sunbathingEnd; 

  var _currentTimeSeconds = function( ) {
    var date = new Date();
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  var _currentTime = function () {
    var date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()];
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

  var drawKnobs = function () {
    $elevationAngleKnob.val(currentElevationAngle);
    KnobDrawer.init($elevationAngleKnob);
    KnobDrawer.init($sunbathingTimeKnob);
    KnobUpdater.init($sunbathingTimeKnob,-1);
    $sunbathingStartKnob.val(timeToSeconds(sunbathingStart.hour,
                                           sunbathingStart.minute,
                                           sunbathingStart.second));
    KnobDrawer.init($sunbathingStartKnob);
    $sunbathingEndKnob.val(timeToSeconds(sunbathingEnd.hour,
                                         sunbathingEnd.minute,
                                         sunbathingEnd.second));
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
      title: 'Time of Day when Vitamin D can be produced by human skin',
      focusTarget: 'category',
      hAxis: {
        title: 'Time of Day',
        format: 'h:mm a',
        viewWindow: {
          min: [0, 90, 0],
          max: [24, 90, 90]
        },
        textStyle: {
          fontSize: 14,
          color: '#053061',
          bold: true,
          italic: false
        },
        titleTextStyle: {
          fontSize: 18,
          color: '#053061',
          bold: true,
          italic: false
        }
      },
      vAxis: {
        title: 'Elevation angle (degrees)',
        textStyle: {
          fontSize: 18,
          color: '#67001f',
          bold: false,
          italic: false
        },
        titleTextStyle: {
          fontSize: 18,
          color: '#67001f',
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
    var options = {packages: ['corechart', 'bar'], callback: drawAxisTickColors};
    $.getJSON('/users/1/current_location/current_day', function(data) {
      anglesJSON = data.angles;
      parseLocationAngles(data);
      drawKnobs();
      // KnobDrawer.init($elevationAngleKnob);
      // KnobDrawer.init($sunbathingTimeKnob);
      // KnobUpdater.init($sunbathingTimeKnob,-1);
      // KnobDrawer.init($currentTimeKnob);
      // KnobUpdater.init($currentTimeKnob,1);
      google.load('visualization', '1', options );
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