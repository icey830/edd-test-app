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
                           // window.alert("Download click: " + response.data.download_link);
                            $.fileDownload('' + response.data.download_link, {
                               successCallback: function(url) {
                                    window.alert('You just got a file download dialog or ribbon for this URL :' + url);
                               },
                               failCallback: function(html, url) {
                                    window.alert('Your file download just failed for this URL:' + url + '\r\n' +
                                        'Here was the resulting error HTML: \r\n' + html);
                               }
                            });
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
    
    $scope.edd_license_info = {
        "license_server": "tgosoftware.com",
        "customer_name": "[who bought the license]",
        "email": "user@xyz.com",
        "license": "[]",
        "mac": "[Mac address of PC that using our application (is unique to license)]",
        "license_type": "[PAID or SUBSCRIPTION]",
        "license_period": "[INFINITY, ANNUAL or MONTHLY]",
        "license_validity": "[END DATE]",
        "order": 0,
        "installed": "[The date user active license key]",
        "quantity_server": "[The number of keys/licences for STANDALONE applications]",
        "version_name": "[Version name of current license]",
        "type": "[Registered or Trial]",
        "activated": "[Yes if the license is installed, No if not installed yet]",
        "license_status": "[CURRENT/EXPIRED]",
        "last_date_check": "[YYY-MM-DD]",
        "current_date": "[YYY-MM-DD]",
        "date_reversal_flag": "[YES/NO]",
        "reversal_date": "[YYYY-MM-DD]",
        "network_users": "[Qty and only used if application is networked, not for standalone]"
    };
    $scope.savedLicenseJSON = '';
    
    $scope.writeFile = function(){
        console.log("Here we are!");
        $scope.savedJSON = angular.toJson($scope.edd_license_info);
        var blob = new Blob([$scope.savedJSON],{
            type: "application/json;charset=utf-8;"
        }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

        a.download = "license_export.tgo";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
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