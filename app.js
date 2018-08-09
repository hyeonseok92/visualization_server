var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');
var multer = require('multer');
var uploads = multer({ dest: 'uploads/' });
var fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '100mb'}));

//var best_scores = {};
//var ranks = [];
//var scores = {};
//var logs = {};
//var test_time = '';

app.get('/', function (req, res) {
    res.render('graph_input');
});

app.post('/', uploads.array('files', 3), function (req, res) {
    var vertexData = fs.readFileSync(req.files[0].path,'utf8');
    var edgeData = fs.readFileSync(req.files[1].path,'utf8');
    var logData = fs.readFileSync(req.files[2].path,'utf8');
    for (var i = 0; i < 3; i++){
      console.log(util.inspect(req.files[i], false, false));
    }
    for (var i = 0; i < 3; i++){
      fs.unlink(req.files[i].path, function (err){
        if (err){
          console.log(err);
        }
        //console.log('successfully deleted ' + req.files[i].path);
      });
    }
    res.render('result', {"vertexRaw" : vertexData , "edgeRaw" : edgeData, "logRaw" : logData});
});

//app.get('/best', function (req, res) {
//    res.render('index', {"ranks" : ranks, "test_time" : test_time});
//    //res.send(best_scores);
//});
//
//app.get('/best/:repo', function (req, res) {
//    repo = req.params.repo;
//    if (repo in best_scores)
//        res.send(best_scores[repo]);
//    else
//        res.send("Not passed yet or failed or wrong student id");
//});
//
//app.get('/result/:repo', function (req, res) {
//    repo = req.params.repo;
//    if (repo in scores)
//        res.send(scores[repo]);
//    else if (repo in logs)
//        res.send(logs[repo]);
//    else
//        res.send("Not evaluated yet or wrong student id");
//});
//
//app.post('/update_score', function (req, res) {
//    best_scores = req.body.best_scores;
//    scores = req.body.scores;
//    logs = req.body.logs;
//    test_time = req.body.test_time;
//    var new_ranks = [];
//    for (var repo in best_scores){
//        v = JSON.parse(JSON.stringify(best_scores[repo]))
//        v["student"] = repo;
//        new_ranks.push(v);
//    }
//    new_ranks.sort(function(a,b){
//        return a["total"] - b["total"];
//    });
//    ranks = new_ranks;
//    console.log(req.body);
//    res.send("");
//});

module.exports = app;
