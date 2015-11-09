// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('parker-pay', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('HomeCtrl', function($scope,$http,$cordovaSpinnerDialog,$cordovaDialogs){



  $scope.charge = {};
  $scope.createToken = function(){
    $cordovaSpinnerDialog.show("Processing Payment","Please wait....", true);
    Stripe.setPublishableKey('pk_test_QgdJSyRF8v7QJVM4mudy99XN');
    Stripe.card.createToken({
  number: $scope.charge.number,
  cvc: $scope.charge.cvc,
  exp_month: $scope.charge.exp_month,
  exp_year: $scope.charge.exp_year
}, $scope.stripeResponseHandler);

};
$scope.stripeResponseHandler = function(status, response){
  if (response.error) {
  // Show the errors on the form
  $cordovaSpinnerDialog.hide();
  $cordovaDialogs.alert('There was an error', 'Alert', 'OK')
    .then(function() {
      // callback success
    });


} else {
  // response contains id and card, which contains additional card details
  var token = response.id;
  //console.log()
  // Insert the token into the form so it gets submitted to the server
  var data = {token:token,amount:$scope.charge.amount,description:$scope.charge.description}
  // and submit

  $http.post('http://payment.jyroneparker.com/charge',data).success(function(dta){
    console.log(dta);
    $cordovaSpinnerDialog.hide();
    // beep 1 time
    $cordovaDialogs.beep(1);
    $cordovaDialogs.alert('Payment was a success.', 'Alert', 'OK')
      .then(function() {
        // callback success
      });


  }).error(function(dta){
    console.log(dta);
    $cordovaSpinnerDialog.hide();
    alert('There was an error.');
    $cordovaDialogs.alert('There was an error', 'Alert', 'OK')
      .then(function() {
        // callback success
      });
    //$cordovaSpinnerDialog.hide();
  });
}
}
})
