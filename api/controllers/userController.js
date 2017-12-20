var express = require('express');
var mongoose = require("mongoose");
var modelUser = require("../models/modelUser");
var jwt = require('jsonwebtoken');
var number = require('./randomNumber');
var apiRoutesUser = express.Router();
//Đăng kí thành viên
apiRoutesUser.post("/members", (req, res)=>{
	//Kiểu dữ liệu sẽ import vào mongoDB
	var user = {
		data:{
			types:'Member',
			attributes:{
				username:req.body.username,
				password:req.body.password,
				repassword:req.body.repassword,
				birthday:req.body.birthday,
				email:req.body.email,
				userId:number.random(100000,999999),
				createTime:Date.now()//Tạo user tự động
			}	
		}

	};
	//================================Validate info//================================//
	if(req.body.username.length <7 || req.body.username.length==0){
		res.status(409).json({message:"Username must be larger than 7 character"});
		return false;
	}	

	if(req.body.password.length < 7 || req.body.password.length==0){
		res.status(409).json({message:"Password must be larger than 7 character"});
		return false;
	}

	if(req.body.repassword.length<7||req.body.repassword.length==0||req.body.repassword!=req.body.password){
		res.status(409).json({message:"Re-Password is invalid"});
		return false;
	}

	if(req.body.birthday.length<7||req.body.birthday.length==0||req.body.birthday > Date.now()){
		res.status(409).json({message:"Birthday is invalid"});
		return false;
	} 

	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(req.body.email.toLowerCase())){
		res.status(409).json({message:"Email is invalid"});	
		return false;
	}
	//================================Validate info//================================//
	//Tìm username trong database
	modelUser.find({username: req.body.username}, (err, resUser)=>{
		//Trả ra lỗi nếu xảy ra lỗi của chương trình
		if(err) return res.status(500).json({message:"Server:error"});
		//Kiểm tra xem user có tồn tại hay không
		if(resUser==null||resUser==undefined||resUser.length==0){
			//Trường hợp user chưa được đăng kí==> im port vào database
			modelUser.create(user, (err, result)=>{
				if(err) throw  err;
				res.status(200).json(result);
			});
		}else if(resUser!=null || resUser.length != 0){
			//Lỗi trả về cho client
			res.status(409).json({message:"Username is existed"});
		}
	});
});
//Đăng nhập
apiRoutesUser.post("/authenticate",(req,res)=>{
	//Form đăng nhập
	var userLogin = {
		username:req.body.username,
		password:req.body.password
	};
	//Tìm kiếm username trong database
	modelUser.findOne({'data.attributes.username':req.body.username}, (err, user)=>{
		if(err) {return res.status(500).json({message:"Server:error"})};
		
		if(user==null|| user==undefined|| user.length == 0){
			//Nếu user chưa có, thông báo sai tên đăng nhập
			res.status(401).json({
				success:false,
				message:"Username is not correct"
			});
		}
		else if(user!=null||user.length!=0){
			if(user.data.attributes.password != req.body.password){
				//Nếu user có, password sai==>thông báo sai tên password
				res.status(401).json({
					success:false,
					message:"Password is not correct"
				})
			} else{
				//Tạo ra token trả về cho client
				var token = jwt.sign({user}, req.app.get("superSecret"));
				res.status(200).json({
					success:true, 
					message:"login successfully",
					token:token
				});
			}
		}
	});
});
//middleware đặt trước các method yêu cầu xác thực người dùng
apiRoutesUser.use(function(req,res,next){
	//Lấy token phía client, "authorization là qui ước"
	var token = req.headers['authorization'];
	if(token){
		//xác thực người dùng
		jwt.verify(token, req.app.get("superSecret"), (err, decoded)=>{
			if(err){
				return res.json({
					success:false,
					message:"Token is invalid"
				});
			}else{
				req.decode=decoded;
				next();
			}
		})
	}else{
		res.status(403).send({
			message:"Not exist Token"
		});
	}
});

apiRoutesUser.get("/members/:id", (req,res)=>{
	// var token = req.headers['authorization'];
	// var decoded = jwt.decode(token);
	modelUser.find({userId:req.params.id},(err, result)=>{
		if(err) throw err;
		res.json(result);
	});
})

module.exports=apiRoutesUser;