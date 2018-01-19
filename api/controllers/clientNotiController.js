var modelVideoWebsite=require('../models/modelVideoWebsite');
var modelNotiVideo=require('../models/modelNotificationCheckVideo');
var express=require('express');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var apiRoutesNoti = express.Router();
var passport = require("passport");

apiRoutesNoti.put('/admin/noti_video/:id', passport.authenticate('jwt', {session:true}), function (req,res) {
	var adminId=req.user.attributes.userId;
	modelNotiVideo.update({notiId:req.params.id},{$set:{req.body.status}}, function(err, result){
		if(err){
			res.status(500).send({
				message:"Server error"
			})
		}
		res.status(200).send({
			message:"successful",
			info:result
		})
	})
})

module.exports=apiRoutesAdminNotifi;