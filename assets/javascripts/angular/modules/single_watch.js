shareWatch.config(function ($stateProvider) {
  $stateProvider.state('index', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'singleWatchController'
  })
}).run(function($state){
   $state.go('index');
});
