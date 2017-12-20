var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var morgan= require('morgan');
var jwt= require('jsonwebtoken');
var config=require('./config/configApp');
var apiRoutesUser=require("./api/controllers/userController");
var apiRoutesPlaylist=require("./api/controllers/playlistController");
var apiRoutesVideo=require("./api/controllers/videoController");
var app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.set("superSecret", config.secretToken);

var port=process.env.PORT||3000;

app.get("/", (req,res)=> {
	res.render("index.ejs");
});

mongoose.connect(config.url(), {useMongoClient: true});

app.use("/", apiRoutesUser);
app.use("/", apiRoutesPlaylist);
app.use("/", apiRoutesVideo);

app.listen(port, ()=>{
	console.log("app is running..");
});