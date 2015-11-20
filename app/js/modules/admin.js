/**
 * Created by juan on 19/11/15.
 */
'use strict';

(function () {
        var admin = angular.module('adminmodule', []);

        admin.controller('AdminController', function ($scope, adminService, $location) {
                adminService.getUser().then(function (result) {
                        if(!result.data.is_staff){
                                $location.path('/');
                                Materialize.toast('No tienes permiso para acceder a este sitio.', 4000, 'rounded')
                        }
                        $scope.user = result.data;
                });

        });

        admin.service('adminService', function ($http, getServerName) {

                var requestSvc = {};

                requestSvc.getUser = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/user/"
                        })
                };

                return requestSvc;
        });

})();