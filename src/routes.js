eddTestApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'tmpl/home.html',
            controller: 'eddTestController'
        }).otherwise({
            redirectTo: '/'
        });
});