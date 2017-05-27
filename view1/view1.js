'use strict';
var d3 = require('d3');

angular.module('myApp.view1', ['ngRoute', 'n3-line-chart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$interval', function($scope, $interval) {
  var windows = BrowserWindow.getAllWindows();
  var Size = windows[0].getSize();
  var linechart = document.getElementById("linechart");
  linechart.style.width = Size[0] - 50 + "px";
  linechart.style.height = Size[1] - 100 + "px";

  linechart.addEventListener("mousewheel", MouseWheelHandler, false);

  // Handle Zoom
  function MouseWheelHandler(e) {
     var delta = Math.max(-1, Math.min(1, (e.wheelDelta)));
     
     var max = $scope.options.axes.x.max;
     var min = $scope.options.axes.x.min;
     
     if(max + delta*10 <= min)
     {
        $scope.options.axes.x.max = min + 10;
     }
     else
     {
        //TODO: Update ratio to feel more smooth
        $scope.options.axes.x.max += delta*5;
        $scope.options.axes.x.min -= delta*5;
     }
     
     console.log($scope.options.axes.x.max);
     $scope.$apply();
  }

  // Update after a pan
  $scope.onDomainsChange = function(domain){
    $scope.options.axes.x.min = Math.floor(domain.x[0]);
    $scope.options.axes.x.max = Math.floor(domain.x[1]);
  }

  // Spoof data
  $scope.data = {
      dataset0: [
          {x: 0, y:0}
      ]
  }
  $interval(spoofData, 100);
  var frequency = 10;
  var amplitude = 1;
  var t = 0;
  function spoofData() {
      var point = {x: 0, y: 0}
      point.x = t;
      point.y = Math.sin(frequency*t)*amplitude;
      $scope.data.dataset0.push(point);
      t += .01;
  }

  $scope.options = {
      pan: {x: true, y: false},
      drawLegend: false,
      drawDots: false,
      margin: {
        top: 5
      },
      series: [
        {
          axis: "y",
          dataset: "dataset0",
          key: "y",
          label: "A line series",
          color: "hsla(88, 48%, 48%, 1)",
          type: [
            "line"
          ],
          id: "mySeries0"
        }
      ],
      axes: {
        x: {
          key: "x",
          min: 0,
          max: 10
        }
      }
    };
}]);