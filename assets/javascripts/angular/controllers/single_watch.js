shareWatch.controller("singleWatchController", function ($scope) {

  $scope.scrip = {
    name: null,
    type: "NSE"
  };

  $scope.search_scrip = function(){
    alert(JSON.stringify($scope.scrip));
  }
  
});
