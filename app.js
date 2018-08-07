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

var best_scores = {};
var ranks = [];
var scores = {};
var logs = {};
var test_time = '';

app.get('/', function (req, res) {
    res.render('graph_input');
});

app.post('/', uploads.array('graphFiles', 2), function (req, res) {
    var graphData = fs.readFileSync(req.files[0].path,'utf8');
    var logData = fs.readFileSync(req.files[1].path,'utf8');
    fs.unlink(req.files[0].path, function (err){
      if (err){
        console.log(err);
      }
      console.log('successfully deleted ' + req.files[0].path);
    });
    fs.unlink(req.files[1].path, function (err){
      if (err){
        console.log(err);
      }
      console.log('successfully deleted ' + req.files[1].path);
    });
    console.log(util.inspect(req.files[0], false, false));
    console.log(util.inspect(req.files[1], false, false));
    res.render('result', {"graphRaw" : graphData, "logRaw" : logData});
});

app.get('/best', function (req, res) {
    res.render('index', {"ranks" : ranks, "test_time" : test_time});
    //res.send(best_scores);
});

app.get('/best/:repo', function (req, res) {
    repo = req.params.repo;
    if (repo in best_scores)
        res.send(best_scores[repo]);
    else
        res.send("Not passed yet or failed or wrong student id");
});

app.get('/result/:repo', function (req, res) {
    repo = req.params.repo;
    if (repo in scores)
        res.send(scores[repo]);
    else if (repo in logs)
        res.send(logs[repo]);
    else
        res.send("Not evaluated yet or wrong student id");
});

app.post('/update_score', function (req, res) {
    best_scores = req.body.best_scores;
    scores = req.body.scores;
    logs = req.body.logs;
    test_time = req.body.test_time;
    var new_ranks = [];
    for (var repo in best_scores){
        v = JSON.parse(JSON.stringify(best_scores[repo]))
        v["student"] = repo;
        new_ranks.push(v);
    }
    new_ranks.sort(function(a,b){
        return a["total"] - b["total"];
    });
    ranks = new_ranks;
    console.log(req.body);
    res.send("");
});

module.exports = app;
