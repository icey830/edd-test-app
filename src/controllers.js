eddTestApp.controller("eddTestHomeController", ['$scope','$http', '$routeParams', '$popup', '$window', function ($scope, $http, $routeParams, $popup, $window) {
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
                // Confirm activation
                // $popup.confirm({
                //     title: 'Confirm',
                //     template: 'Do you want to active this license of ' + response.data.item_name,
                //     okText: 'OK',
                //     cancelText: 'Cancel',
                //     okTap: function(e) {
                //         // perform activate license
                //         e.preventDefault();
                //     }
                // });
                $http({
                    method: 'GET',
                    url: 'http://tgosoftware.localwhois.biz',
                    params: { edd_action: "activate_license", item_name: edd.item_name, license: edd.license }
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.result = response.data;
                    window.alert("Activated license successfully!");         
                    // Perfrom checking version after activation
                    if (response.data.success == true && response.data.license == "valid") {
                        $http({
                            method: 'GET',
                            url: 'http://tgosoftware.localwhois.biz',
                            params: { edd_action: "get_version", item_name: edd.item_name, license: edd.license }
                        }).then(function successCallback(response) {
                            $scope.result = response.data;
                            console.log("Links for download packages: " + response.data.download_link);
                            window.alert("Download click: " + response.data.download_link);
                            // $http({method: 'GET', url: response.data.download_link})
                            // .success(function(data, status, headers, config) {
                            //     var anchor = angular.element('<a/>');
                            //     anchor.attr({
                            //         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                            //         target: '_blank',
                            //         download: 'filename.csv'
                            //     })[0].click();

                            // }).error(function(data, status, headers, config) {
                            //     // if there's an error you should see it here
                            //     console.log("Links for download packages: " + data);
                            // });
                            // $popup.confirm({
                            //     title: "Get version",
                            //     template: 'Version of ' + response.data.item_name,
                            //     okText: 'OK',
                            //     cancelText: 'Cancel',
                            //     okTap: function (e) {
                            //         console.log("Links for download packages: " + response.data.download_link);
                            //     }
                            // });
                        }, function errorCallback(response) {
                            $scope.result = response.data;
                        });

                    }
                    // $http.get('http://tgosoftware.localwhois.biz', )
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.result = response.data;
                    // console.log("Activated license details: " + JSON.stringify(response));
                });
                   
            }
            else if(response.data.license === "expired"){
                alert("Your license is expired!");
            }
            else if(response.data.license === "site_inactive"){
                alert("Your license is activated already!");
            }
            else if(response.data.license === "item_name_mismatch"){
                window.alert("Your license is invalid!");
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
                            // console.log("Deactivated license details: " + JSON.stringify(response));
                        }, function errorCallback(response) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            $scope.result = response.data;
                            // console.log("Deactivated license details: " + JSON.stringify(response));
                        });
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.result = response;
            // console.log("Get license details: " + JSON.stringify(response));
        });
    };
    
    $scope.reset = function() {
        $scope.edd = angular.copy($scope.master);
    };

    $scope.reset();
    
    // checking connection
    $window.addEventListener("offline", function(){
        console.log("Offline");
      }, false);
    
    $window.addEventListener("online", function () {
        console.log("Online");
      }, false);
}]);

eddTestApp.controller("eddTestAboutController", ['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
    console.log("In about!");
}]);