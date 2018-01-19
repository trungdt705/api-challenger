var modelVideoWebsite= require('../models/modelVideoWebsite')
var modelNoti = require('../models/modelNotificationCheckVideo');
var secret=require('../../config/configApp')
var jwt= require('jsonwebtoken');
module.exports=function (io) {
	//middleware xac thuc ket noi socket
	var decodedToken=""
	io.use(function(socket, next){
		if (socket.handshake.query && socket.handshake.query.token){
			var token = socket.handshake.query.token.split(' ')[1];
			jwt.verify(token, secret.secretToken, function(err, decoded) {
				if(err) return console.log('Co loi');
				decodedToken = decoded;
				next();
			});
		}
		next(new Error('Authentication error'));
	})
	//Bat su kien khi ng dung connect den server
	io.on('connection', function(socket){
		var userId=decodedToken.userId
		console.log('Co nguoi ket noi');
		socket.on('admin-send-noti', function(data){
			console.log(data)
			socket.broadcast.emit('server-response-noti', data)
		})

		function reconnect(){
			modelNoti.find({status:1,userId:userId}, function(err, result){
				if(err) return console.log(err);
				socket.emit('reconnect', result)		
			})
		}
		reconnect();	
	})
}