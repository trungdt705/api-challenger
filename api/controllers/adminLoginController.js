var modelVideoWebsite=require('../models/modelVideoWebsite');
var express=require('express');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var modelUser = require("../models/modelUser");
apiRoutesAdminLogin=express.Router();
var passport = require("passport");

apiRoutesAdminLogin.post("/admin/authenticate",(req,res)=>{
	//Form đăng nhập
	var userLogin = {
		username:req.body.username,
		password:req.body.password,
	};
	console.log(req.body.role)
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
			} else if(user.attributes.role != 1){
				res.status(401).json({
					success:false,
					message:"Account is not administrator"
				})
			}else{
				console.log(1)
				//Tạo ra token trả về cho client
				var token = jwt.sign({userId:user.attributes.userId}, req.app.get("superSecret"));
				res.status(200).json({
					success:true, 
					message:"login successfully",
					token:'JWT '+token,
					username:user.attributes.fullname
				});
			}
		}
	});
});

module.exports=apiRoutesAdminLogin