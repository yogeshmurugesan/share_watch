shareWatch.controller("singleWatchController", function ($scope, $http, $timeout) {
  var timer;
  $scope.scrip = {
    name: null,
    market: "NSE"
  };
  $scope.marketDepthData = null;
  $scope.invalidScripName = false;
  $scope.marketWatchStop = false;

  $scope.search_scrip = function(){
    if ($scope.scrip.name != undefined){
      $scope.scrip.name = $scope.scrip.name.toUpperCase();
      triggerSingleWatch();
    } 
  }

  $scope.stop_scrip = function(){
    $timeout.cancel(timer);
    $scope.marketWatchStop = true;
  };

  function triggerSingleWatch(){
    $http({
      method: 'GET',
      url: '/singleWatch',
      params: { 
        market: $scope.scrip.market,
        name: $scope.scrip.name
      }
    })
    .then(function successCallback(response) {
      responseData = response.data;
      $scope.marketDepthData = responseData[$scope.scrip.name + "-" + $scope.scrip.market];
      if ($scope.marketDepthData["error"]){
        $scope.marketDepthData = null;
        $scope.invalidScripName = true;
        $timeout.cancel(timer);
      } else {
        timer = $timeout(triggerSingleWatch, 2500);
      }
    }, function errorCallback(response) {
      console.log(response);
    });
  };
});

