var express = require('express');
var mongoose = require("mongoose");
var modelUser = require("../models/modelUser");
var jwt = require('jsonwebtoken');
var number = require('./randomNumber');
var req=require('request');
var apiRoutesLogin = express.Router();


//====================Đăng kí======================//
apiRoutesLogin.post("/members", (req, res)=>{
	if(req.body.attributes.thumbnail==""){
		var avatar ="https://unghotoi.com/data/avatar/1498047608OBM_avatar_user.png"
	}else{
		avatar=req.body.attributes.thumbnail
	}
	
	var user = {
		types:req.body.types,
		attributes:{
			username:req.body.attributes.username,
			password:req.body.attributes.password,
			repassword:req.body.attributes.repassword,
			gender:req.body.attributes.gender,
			birthday:req.body.attributes.birthday,
			email:req.body.attributes.email,
			fullname:req.body.attributes.fullname,
			tokenFb:'',
			thumbnail:avatar,
			role:req.body.attributes.role,
			userId:number.random(10000000,99999999),
			createdAt:Date.now(),
			updatedAt:Date.now(),
			status:1
		}	
	};
	//================================Validate info//================================//
	if(req.body.attributes.username == null
		||req.body.attributes.username == undefined
		||req.body.attributes.username.length < 7 
		||req.body.attributes.username.length==0){
		res.status(409).json({message:"Username must be larger than 7 character"});
		return false;
	}	

	if(req.body.attributes.password == null
		||req.body.attributes.password == undefined
		||req.body.attributes.password.length < 7 
		||req.body.attributes.password.length==0){
		res.status(409).json({message:"Password must be larger than 7 character"});
		return false;
	}

	if(req.body.attributes.repassword == null
		||req.body.attributes.repassword == undefined
		||req.body.attributes.repassword.length<7
		||req.body.attributes.repassword.length==0
		||req.body.attributes.repassword!=req.body.attributes.password){
		res.status(409).json({message:"Re-Password is invalid"});
		return false;
	}
	console.log(req.body.attributes.birthday)
	if(req.body.attributes.birthday == null
		||req.body.attributes.birthday == undefined
		||req.body.attributes.birthday > Date.now()){
		res.status(409).json({message:"Birthday is invalid"});
		return false;
	} 

	if(req.body.attributes.fullname == null
		||req.body.attributes.fullname == undefined
		||req.body.attributes.fullname.length < 7
		||req.body.attributes.fullname.length == 0){
		res.status(409).json({message:"fullname is invalid"});
		return false;
	} 


	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(req.body.attributes.email.toLowerCase())
		||req.body.attributes.email==null
		||req.body.attributes.email==undefined
		||req.body.attributes.email.length==0){
		res.status(409).json({message:"Email is invalid"});	
		return false;
	}
	//================================Validate info//================================//
	//Tìm username trong database
	modelUser.find({"attributes.username": req.body.attributes.username}, (err, resUser)=>{
		//Trả ra lỗi nếu xảy ra lỗi của chương trình
		if(err) return res.status(500).json({message:"Server error"});
		//Kiểm tra xem user có tồn tại hay không
		if(resUser==null||resUser==undefined||resUser.length==0){
			//Trường hợp user chưa được đăng kí==> import vào database
			modelUser.create(user, (err, result)=>{
				if(err) throw  err;
				res.status(200).json(result);
			});
		}else if(resUser!=null || resUser.length != 0){
			//Lỗi trả về cho client
			res.status(409).json({
				message:"Username is existed"
			});
		}
	});
});
//====================Đăng nhập====================//
apiRoutesLogin.post("/authenticate",(req,res)=>{
	//Form đăng nhập
	var userLogin = {
		username:req.body.username,
		password:req.body.password,
	};
	//Tìm kiếm username trong database
	modelUser.findOne({'attributes.username':req.body.username}, (err, user)=>{
		if(err) {return res.status(500).json({message:"Server error"})};
		
		if(user == null|| user == undefined|| user.length == 0){
			//Nếu user chưa có, thông báo sai tên đăng nhập
			res.status(409).json({
				success:false,
				message:"Username is not correct"
			});
		}
		else if(user != null||user.length != 0){
			if(user.attributes.password != req.body.password){
				//Nếu user có, password sai==>thông báo sai tên password
				res.status(409).json({
					success:false,
					message:"Password is not correct"
				})
			} else{
				//Tạo ra token trả về cho client
				var token = jwt.sign({userId:user.attributes.userId, role:user.attributes.role}, req.app.get("superSecret"));
				res.status(200).json({
					success:true, 
					message:"login successfully",
					token:'JWT '+token,
					username:user.attributes.fullname,
					userId:user.attributes.userId
				});
			}
		}
	});
});
//====================Kết thúc Đăng nhập============//
module.exports=apiRoutesLogin;
