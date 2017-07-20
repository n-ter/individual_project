var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	favicon = require('serve-favicon'),
	fs = require('fs'),
	app = express(),
	server;

app.disable('x-powered-by');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(function(req, res, next){
	console.log('%s %s', req.method, req.url);
	res.setHeader('Access-Control-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
	next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(reg, res){
		res.render('main', {page: 'Управление счетами'});
});

app.get('/myactions', function(reg, res){
		res.render('new', {page: 'Журнал операций'});
});

app.get('/rate', function(reg, res){
		res.render('rate', {page: 'Расход'});
});

app.get('/rent', function(reg, res){
		res.render('rent', {page: 'Доход'});
});

app.get('/statistic', function(reg, res){
		res.render('statistic', {page: 'Доступные средства'});
});

app.post('/json/myAcc.json', function(req,res){
  var data_acc=req.body;
  var data = JSON.stringify(data_acc);
  var check1 = data.replace('":""}', ']')
  var check2 = check1.replace('{"', '[')
  var check3 = check2.replace(/\\/g, '')
  var check = check3.replace('[0]', '[]')
  fs.writeFile('public/json/myAcc.json', check, 'utf8'); 
});
app.post('/json/myRate.json', function(req,res){
  var data_acc=req.body;
  var data = JSON.stringify(data_acc);
  var check1 = data.replace('":""}', ']')
  var check2 = check1.replace('{"', '[')
  var check3 = check2.replace(/\\/g, '')
  var check = check3.replace('[0]', '[]')
  fs.writeFile('public/json/myRate.json', check, 'utf8'); 
});
app.post('/json/myRent.json', function(req,res){
  var data_acc=req.body;
  var data = JSON.stringify(data_acc);
  var check1 = data.replace('":""}', ']')
  var check2 = check1.replace('{"', '[')
  var check3 = check2.replace(/\\/g, '')
  var check = check3.replace('[0]', '[]')
  fs.writeFile('public/json/myRent.json', check, 'utf8'); 
});
app.post('/json/myjurnal.json', function(req,res){
  var data_acc=req.body;
  var data = JSON.stringify(data_acc);
  var check1 = data.replace('":""}', ']')
  var check2 = check1.replace('{"', '[')
  var check3 = check2.replace(/\\/g, '')
  var check = check3.replace('[0]', '[]')
  fs.writeFile('public/json/myjurnal.json', check, 'utf8'); 
});

var server = app.listen(3000, function(){
	console.log('Listening on port 3000');
});