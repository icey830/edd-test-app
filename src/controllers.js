eddTestApp.controller("eddTestController", ['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
    // prepare serving header from template source
    $scope.headerSrc = "tmpl/header.html";
    $scope.master = {};
    $scope.result = {};
    
    $scope.submit = function(edd){
       console.log(edd);
       
       $http({
        method: 'GET',
        url: 'http://tgosoftware.localwhois.biz',
        params: {edd_action: "check_license", item_name: edd.item_name, license: edd.license}
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.result = response.data;
            console.log("Get license details: " + JSON.stringify(response));
            if(response.data.license === "inactive"){
                 $http({
                    method: 'GET',
                    url: 'http://tgosoftware.localwhois.biz',
                    params: {edd_action: "activate_license", item_name: edd.item_name, license: edd.license}
                    }).then(function successCallback(response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            $scope.result = response.data;
                            console.log("Activated license details: " + JSON.stringify(response));
                        }, function errorCallback(response) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log("Activated license details: " + JSON.stringify(response));
                        });
            }
            else if(response.data.license === "expired"){
                alert("Your license is expired!");
            }
            else if(response.data.license === "site_inactive"){
                alert("Your license is activated already!");
            }
            else{
                $http({
                    method: 'GET',
                    url: 'http://tgosoftware.localwhois.biz',
                    params: {edd_action: "deactivate_license", item_name: edd.item_name, license: edd.license}
                    }).then(function successCallback(response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            $scope.result = response.data;
                            console.log("Deactivated license details: " + JSON.stringify(response));
                        }, function errorCallback(response) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log("Deactivated license details: " + JSON.stringify(response));
                        });
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("Get license details: " + JSON.stringify(response));
        });
    };
    
    $scope.reset = function() {
        $scope.edd = angular.copy($scope.master);
    };

    $scope.reset();
}]);