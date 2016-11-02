angular.module('grid', [])

.controller('mainController', function($scope, $interval) {
  $scope.message = 'Welcome';

  $scope.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  $scope.updateTime = function() {
    if($scope.timeLimit > 0) {
      $scope.timeLimit--;
    } else {
      $scope.endGame();
    }
  };

  $scope.prepare = function() {
    // Define basic colors.
    $scope.colors = ['red', 'blue', 'green', 'orange', 'yellow', 'brown', 'pink', 'purple'];
    // Initiate defaults
    $scope.buttonText = 'Start';
    $scope.old = {color: null};
    $scope.status = 'noMatch';
    $scope.matched = 0;
    $scope.timeLimit = 60;

    // Duplicate colors.
    var array = $scope.colors.concat($scope.colors);
    // Shuffle color array.
    array = $scope.shuffle(array);
    // create array of objects.
    var i = 0;
    var prepared = [];
    while (i < array.length) {
      prepared.push({color: array[i], open: false});
      i++;
    }
    return prepared;
  };

  $scope.click = function(card) {
    if (card.freeze) {
      return;
    }
    card.open = true;
    if ($scope.status == 'waiting' && $scope.old.color == card.color) {
      // Freeze
      $scope.old.freeze = true;
      card.freeze = true;
      $scope.matched++;
      if ($scope.matched == 8) {
        $scope.endGame();
      }
    } else {
      if ($scope.status == 'waiting') {
        $scope.misMatch = card;
        $scope.status = 'noMatch';
      } else if($scope.status == 'noMatch') {
        if ($scope.misMatch) {
          $scope.misMatch.open = false;
          if (! $scope.old.freeze) $scope.old.open = false;
        }
        $scope.old = card;
        $scope.status = 'waiting'
      }
    }
  };

  $scope.endGame = function() {
    $interval.cancel($scope.timer);
    $scope.score = 'Your Score: ' + ($scope.timeLimit + ($scope.matched * 2));
    if ($scope.matched == 8) {
      $scope.message = 'Bingo !!';
    } else {
      $scope.message = 'Timeout !!';
    }
    $scope.buttonText = 'Restart';
  };

  $scope.cards = $scope.prepare($scope.colors);

  $scope.restart = function() {
    $scope.message = false;
    $scope.cards = $scope.prepare($scope.colors);
    $scope.timer = $interval($scope.updateTime, 1000);
  }
});
