google.load('visualization', '1', {packages: ['corechart', 'bar']});
google.setOnLoadCallback(drawAxisTickColors);

function drawAxisTickColors() {
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Bellow 50\xB0 (no vitamin D)' );
      data.addColumn('number', 'Above 50\xB0 (vitamin D)' );

      data.addRows([
        [{v: [1, 0, 0], f: '1 am'}, -30, 0],
        [{v: [2, 0, 0], f: '1 am'}, -25, 0],
        [{v: [3, 0, 0], f: '1 am'}, -20, 0],
        [{v: [4, 0, 0], f: '2 am'}, -10, 0],
        [{v: [5, 0, 0], f: '3 am'}, -4, 0],
        [{v: [6, 0, 0], f: '4 am'}, 0, 0],
        [{v: [7, 0, 0], f: '5 am'}, 10, 0],
        [{v: [8, 0, 0], f: '8 am'}, 20, 0],
        [{v: [9, 0, 0], f: '9 am'}, 30, 0],
        [{v: [10, 0, 0], f:'10 am'}, 40, 0],
        [{v: [11, 0, 0], f: '11 am'}, 50, 0],
        [{v: [12, 0, 0], f: '12 pm'}, 50, 5],
        [{v: [13, 0, 0], f: '1 pm'}, 50, 12],
        [{v: [14, 0, 0], f: '2 pm'}, 50, 19],
        [{v: [15, 0, 0], f: '3 pm'}, 50, 10],
        [{v: [16, 0, 0], f: '4 pm'}, 50, 5],
        [{v: [17, 0, 0], f: '5 pm'}, 50, 0],
        [{v: [18, 0, 0], f: '6 pm'}, 40, 0],
        [{v: [19, 0, 0], f: '7 pm'}, 30, 0],
        [{v: [20, 0, 0], f:'8 pm'}, 20, 0],
        [{v: [21, 0, 0], f: '9 pm'}, 10, 0],
        [{v: [22, 0, 0], f: '10 pm'}, 5, 0],
        [{v: [23, 0, 0], f: '11 pm'}, -8, 0],
        [{v: [24, 0, 0], f: '12 pm'}, -17, 0],
      ]);

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

      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
      $(window).resize(function(){
        chart.draw(data, options);;
      });
    }