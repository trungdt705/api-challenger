var modelListen=require('../models/modelListenVideo');
var modelVideoWebsite=require('../models/modelVideoWebsite')
var express = require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
var passport = require("passport");
apiRoutesListen = express.Router();

apiRoutesListen.post('/listen-video', function(req,res) {
	var numberOfListened = parseInt(req.body.numberOfListened)
	var query = {videoWebsiteId:req.body.videoWebsiteId};
	var data = {
		videoWebsiteId:req.body.videoWebsiteId,
		numberOfFavourited:numberOfListened,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		status:1
	};
	modelListen.findOneAndUpdate(query, data, {upsert:true}, function(err,result){
		if(err) return res.status(500).json({
			message:"Server error"
		})
			modelVideoWebsite.update({'attributes.videoWebsiteId':req.body.videoWebsiteId},{$set:{'play.listened':numberOfListened}}, function(err,result){
				if(err) throw err
					res.status(200).json({data:result});
			})		
		})
})

// apiRoutesListen.put('/like-video/:id', passport.authenticate('jwt', {session:false}), function(req,res) {
// 	var numberOfListened = parseInt(req.body.numberOfListened)
// 	var userId = req.user.attributes.userId;
// 	var query = {videoWebsiteId:req.params.id, userId:userId};
// 	var data = {
// 		videoWebsiteId:req.params.id,
// 		userId:userId,
// 		favourited:0,
// 		numberOfFavourited:numberOfListened,
// 		createdAt:Date.now(),
// 		updatedAt:Date.now(),
// 		status:1
// 	};
// 	modelListen.findOneAndUpdate(query, data, {upsert:true}, function(err,result){
// 		if(err) return res.status(500).json({
// 			message:"Server error"
// 		})
// 			modelVideoWebsite.update({'attributes.videoWebsiteId':req.body.videoWebsiteId},{$set:{'play.favourited':numberOfListened}}, function(err,result){
// 				if(err) throw err
// 					res.status(200).json({data:result});
// 			})	
// 		})		
// })

// apiRoutesListen.get('/like-video', function(req,res) {
// 	var userId=req.user.attributes.userId;
// 	modelListen.find({userId:userId}, function(err,result){
// 		if(err) return res.status(500).json({
// 			message:"Server error"
// 		})
// 			return res.status(200).json({
// 				message:"Successfully",
// 				data:result
// 			})
// 		})		
// })

module.exports=apiRoutesListen;