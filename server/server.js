// All Tomorrow's Parties -- server

path_sudoku_gen="generate_sudoku.py";

//Meteor.publish("directory", function () {
//return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
//});

//Meteor.publish("parties", function () {
//return Parties.find(
//{$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
//});

//if (Meteor.isServer) {
//Meteor.publish("puzzles", function () {
//return Puzzles.find(); // everything
//});

var addPuzzle = function (difficulty,clu, lo, hi) {
  var require = __meteor_bootstrap__.require;
  var sys = require('sys');
  var exec = require('child_process').exec;
  //var exec = require('execSync');

  //exec("php social.php", function(error, stdout, stderr) {
  //exec(path_sudoku_gen+" 36 0.4 0.5", function(error, stdout, stderr) {
  //var sudoku_str = exec.stdout(path_sudoku_gen+" "+clu+" "+lo+" "+hi);
  var lol = exec(path_sudoku_gen+" "+clu+" "+lo+" "+hi, function(error, stdout, stderr) {
    console.log(stdout);
    Fiber(function() {
      var sudoku_str=stdout;
      Puzzles.insert({diff:difficulty, str:sudoku_str, random : Math.random()})
      console.log(sudoku_str);
    //Games.insert(
    //{
    //result: stdout
    //}
    //);
    }).run();

    //return sudoku_str;
  });

  //var results = Games.find({}, {}).fetch();
  //return results['result'];
  //return sudoku_str; 
  //return lol; 
}

var populatePuzzles = function (difficulty,lo,hi,clu,desiredAmount) {
  var npuzzles = Puzzles.find({diff:difficulty}).count();
  if (npuzzles < desiredAmount) { addition = desiredAmount - npuzzles;
    for (var i=0; i < addition; i++) { addPuzzle(difficulty,clu,lo,hi); }}
};


Meteor.startup(function () {
  // define MAIL_STRING in a separate .js file in the form of:
  // 'smtp://USER:PASS@HOST:PORT
  //  e.g. MAIL_STRING = 'smtp://yavuzbingol02:lamepass@smtp.gmail.com:587/'
  process.env.MAIL_URL = MAIL_STRING;
  
  desiredAmount = 200;
  console.log("Number of puzzles: "+Puzzles.find().count());
  populatePuzzles(0,0  ,1.5 ,79,desiredAmount); // supereasy
  populatePuzzles(1,0.4,0.5 ,50,desiredAmount); // easy
  populatePuzzles(2,0  ,1.5 ,40,desiredAmount); // medium
  populatePuzzles(3,0  ,1.5 ,30,desiredAmount); // difficult
});

//}// is server