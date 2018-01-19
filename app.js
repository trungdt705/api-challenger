var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var morgan= require('morgan');
var jwt= require('jsonwebtoken');
var config = require('./config/configApp');
var routesUser=require("./api/controllers/userController");
var routesPlaylist=require("./api/controllers/playlistController");
var routesVideo=require("./api/controllers/videoController");
var routeFile=require("./api/controllers/fileController");
var routeVideoWebsite=require("./api/controllers/videoWebsiteController");
var routeComment=require("./api/controllers/commentController");
var routeLikeComment=require("./api/controllers/likeCommentController");
var routeLogin=require("./api/controllers/loginController");
var routeLike=require("./api/controllers/likeController");
var routeListen=require("./api/controllers/listenController");
var routeUpload=require("./api/controllers/manageUploadController");
var routeAdminVideo=require("./api/controllers/adminVideoController");
var routeAdminLogin=require("./api/controllers/adminLoginController");
var routeAdminNoti=require("./api/controllers/adminNotiController");
var modelUser = require("./api/models/modelUser");
var Strategy=require('./api/controllers/passport.js')
var passport = require("passport");
var cors=require('cors');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./api/controllers/socketController')(io);
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

passport.use(Strategy.strategy);
passport.use(Strategy.fbStrategy)

app.use(passport.initialize());

passport.serializeUser(function(user, done){
	done(null, user.attributes.userId)
})

passport.deserializeUser(function(id, done){
	modelUser.findOne({'attributes.userId':id}, function(err, user){
		done(null, user);
	})
})

app.get('/auth/facebook', passport.authenticate('facebook', {scope:['email','user_birthday']}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect:'/playlist'}), function(req,res){
	var token = jwt.sign({userId:req.user.attributes.userId}, app.get("superSecret"));
	res.redirect(`/?token=${'JWT '+token}`)
})
mongoose.connect(config.url(), {useMongoClient: true});
mongoose.Promise = global.Promise


app.use(morgan('dev'));
app.set("view engine", "ejs");
app.set("superSecret", config.secretToken);

var port=process.env.PORT||3000;

app.get("/", (req,res)=> {
	res.render("test.ejs");
});

app.use("/", routeLogin);
//===================== Các route cần xác thực =====================//
app.use("/", routesUser);
app.use("/", routesPlaylist);
app.use("/", routesVideo);
app.use("/", routeFile);
app.use("/", routeVideoWebsite);
app.use("/", routeComment);
app.use("/", routeLikeComment);
app.use("/", routeLike);
app.use("/", routeListen);
app.use("/", routeUpload);
app.use("/", routeAdminVideo);
app.use("/", routeAdminLogin);
app.use("/", routeAdminNoti);
//===================== Các route cần xác thực =====================//
server.listen(port, ()=>{
	console.log("app is running..");
});