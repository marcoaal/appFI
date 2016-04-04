/*
* Copyright 2016. PROTECO FI UNAM
*/

var http = require('http');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

var app = express();

AWS.config.loadFromPath('./config.json');

app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname+'/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var config = fs.readFileSync('./app_config.json','utf8');
config = JSON.parse(config);

var db = new AWS.DynamoDB({region: config.AWS_REGION});

app.get('/',function(req,res){
	res.sendFile('index.html');
});

app.post('/registro', function(req, res){
	var correoCampo = req.body.correo,
		usernameCampo = req.body.username,
		nocuentaCampo = req.body.nocuenta,
		passwordCampo = req.body.password,
		carreraCampo = req.body.carrera;
		res.send(200);
		registro(correoCampo,usernameCampo,nocuentaCampo,passwordCampo,carreraCampo);
});

//Sigin de usuarios
/*
app.post('/sigin',function(req,res){
	var correoCampo = req.body.correo,
		passwordCampo = req.body.password;
		res.send(200);
		sigin(correoCampo,passwordCampo);
});
*/

var registro = function(correoR, usernameR, nocuentaR, passwordR, carreraR) {
	var datos = {
		TableName: config.REGISTRO_APPFI,
		Item: {
			correo: {'S': correoR},
			username: {'S': usernameR},
			nocuenta: {'S': nocuentaR},
			password: {'S': passwordR},
			carrera: {'S': carreraR}
		}
	};
	db.putItem(datos, function(err,data){
		if(err){
			console.log('Error al añadir tupla a la base de datos: ', err);
		}
		else{
			console.log("Datos agregados a la base de datos");
		}
	});
};

//Sigin de usuarios
/*
var sigin = function(correoR,passwordR){
	var datos = {
		TableName: config.REGISTRO_APPFI,
		Item:{
			correo: {'S': correoR},
			password: {'S': passwordR}
		}
	};
	db.query(datos,function(err,data){
		if(err){
			console.log("Error al realizar la consulta: ", err);
		}
		else{
			console.log("Consulta hecha satisfactoriamente");
		}
	});
};
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Servidor express escuchando en el puerto ' + app.get('port'));
});