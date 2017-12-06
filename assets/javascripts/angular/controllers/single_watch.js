shareWatch.controller("singleWatchController", function ($scope, $http, $timeout) {
  var timer;
  $scope.scrip = {
    name: null,
    market: "NSE"
  };
  $scope.marketDepthData = null;
  $scope.search_scrip = function(){
    if ($scope.scrip.name != undefined){
      $scope.scrip.name = $scope.scrip.name.toUpperCase();
      triggerSingleWatch();
    } 
  }

  $scope.stop_scrip = function(){
    $timeout.cancel(timer);
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
      timer = $timeout(triggerSingleWatch, 2500);
    }, function errorCallback(response) {
      console.log(response);
    });
  };
});
