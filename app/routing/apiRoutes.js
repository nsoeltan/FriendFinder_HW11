var friendMatch = require('../data/friends.js');

//ROUTING
// Two Routes with express parameters
module.exports = function(app) {

    // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)

   // A GET json route to display all possible friends
  app.get('/api/friends', function (req, res) {
    res.json(friendMatch);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // A POST route to handle incoming survey results
  app.post('/api/friends', function (req, res) {

    //req.body is available since we're using body-parser middleware
    var newFriend = req.body;
    //score loop
    for(var i = 0; i < newFriend.scores.length; i++) {
      if(newFriend.scores[i] == "1 (Strongly Disagree)") {

        newFriend.scores[i] = 1;
      } else if(newFriend.scores[i] == "5 (Strongly Agree)") {

        newFriend.scores[i] = 5;
      } else {

        newFriend.scores[i] = parseInt(newFriend.scores[i]);
      }
    }
    
    //array for the comparison
    var comparisonArray = [];

    for(var i = 0; i < friendMatch.length; i++) {
      //Determine the users most compatible friend
      var comparedFriend = friendMatch[i];
      //calculate the totaldifference between friends
      var totalDifference = 0;
      
      for(var k = 0; k < comparedFriend.scores.length; k++) {
        //return the absolute value of a number *use abs()method
        var differenceOneScore = Math.abs(comparedFriend.scores[k] - newFriend.scores[k]);
        totalDifference += differenceOneScore;
      }

      comparisonArray[i] = totalDifference;
    }

    var bestFriendNum = comparisonArray[0];
    var bestFriend = 0;

    for(var i = 1; i < comparisonArray.length; i++) {
      if(comparisonArray[i] < bestFriendNum) {
        bestFriendNum = comparisonArray[i];
        bestFriend = i;
      }
    }
    //push new friend
    friendMatch.push(newFriend);
    //json bf to the current friend match array
    res.json(friendMatch[bestFriend]);
  });
};