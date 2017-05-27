'use strict';
var chart = require('chart.js');
require('chartjs-plugin-zoom')

angular.module('myApp.view2', ['ngRoute'])

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
  ctx.style.height = Size[1] - 100 + "px";

  var linechart = new chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
      labels: [0], //[0, 1, 2, 3, 4, 5],
      datasets: [{
        label: 'series 1',
        data: [0], //[12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      animation:{
        duration: 0
      },
      pan: {
        enabled: true,
        mode: 'y'
      },
      zoom: {
        enabled: true,
        mode: 'y',
        rangeMin: {
          x: null,
          y: -1.5
        },
        rangeMax: {
          x: null,
          y: 1.5
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  // Spoof data
  $interval(spoofData, 100);
  var frequency = 10;
  var amplitude = 1;
  var t = 0;
  function spoofData() {
      linechart.data.labels.push(t);
      linechart.data.datasets[0].data.push(Math.sin(frequency*t)*amplitude);
      t += .01;
      linechart.update();
  }
}]);