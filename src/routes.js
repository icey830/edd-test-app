eddTestApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'tmpl/home.html',
            controller: 'eddTestHomeController'
        }).otherwise({
            redirectTo: '/'
        });
});