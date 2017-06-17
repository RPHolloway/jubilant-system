'use strict';
var chart = require('chart.js');
require('chartjs-plugin-zoom')

angular.module('myApp.view2', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller("View2Ctrl", ['$scope', '$interval', function ($scope, $interval) {
  var windows = BrowserWindow.getAllWindows();
  var Size = windows[0].getSize();
  var ctx = document.getElementById("linechart");
  ctx.style.width = Size[0] - 50 + "px";
  ctx.style.height = Size[1] - 150 + "px";

  $scope.click = function click() {
    linechart.resetZoom();
  };

  var linechart = new chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
      labels: [0],
      datasets: [{
        label: 'series 1',
        data: [0],
        borderWidth: 1
      }]
    },
    options: {
      animation:{
        duration: 0
      },
      pan: {
        enabled: false,
        mode: 'x'
      },
      zoom: {
        enabled: false,
        sensitivity: .01,
        mode: 'x',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }],
        xAxes: [{
           ticks: {
             autoSkip: true,
             maxTicksLimit: 25,
           }
        }]
      }
    }
  });

  // Spoof data
  $interval(spoofData, 10);
  var frequency = 10;
  var amplitude = 1;
  var t = 0;
  var idx = 0;
  var bufferSize = 100;
  function spoofData() {
      linechart.data.labels.push(t.toFixed(2));
      linechart.data.datasets[0].data.push(Math.sin(frequency*t)*amplitude);
      t += .01;

      if(idx > bufferSize)
      {
          linechart.options.scales.xAxes[0].ticks.min = linechart.data.labels[idx-bufferSize];
          linechart.options.scales.xAxes[0].ticks.max = linechart.data.labels[idx];
      }
      idx++;

      if(idx > 500)
      {
          linechart.data.labels.shift();
          linechart.data.datasets[0].data.shift();
          idx--;
      }

      linechart.update();
  }

  var xZoom = function(event) {
				if (event.deltaY < 0) {
					bufferSize = Math.floor(bufferSize * 1.1);
          if (bufferSize > linechart.data.labels.length)
            bufferSize = linechart.data.labels.length
				} else {
					bufferSize = Math.floor(bufferSize * 0.9);
          if (bufferSize < 10)
            bufferSize = 10
				}

        if(bufferSize < 10)
           bufferSize = 10;
        else if(bufferSize > linechart.data.labels.length)
        {
           bufferSize = linechart.data.labels.length;
        }    

				// Prevent the event from triggering the default behavior (eg. Content scrolling).
				event.preventDefault();
			};

  document.addEventListener('wheel', xZoom);
}]);