var modelLikeComment=require('../models/modelLikeComment');
var modelComment=require('../models/modelComment')
var express = require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
var passport = require("passport");
apiRoutesLikeComment = express.Router();

apiRoutesLikeComment.post('/like-comment/:id', passport.authenticate('jwt', {session:false}), function(req,res) {
	var numberOfLike = parseInt(req.body.numberOfLike)
	console.log(numberOfLike);
	var userId = req.user.attributes.userId;
	var query={commentId:req.body.commentId, videoWebsiteId:req.params.id, userId:userId};
	var data = {
		commentId:req.body.commentId,
		videoWebsiteId:req.params.id,
		userId:userId,
		liked:1,
		numberOfLike:numberOfLike,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		status:1
	};
	modelLikeComment.update(query,data,{upsert:true}, function(err,result){
		console.log(result)
		if(err) return res.status(500).json({
			message:"Server error"
		})
			modelComment.update({commentId:req.body.commentId},{$set:{numberOfLike:numberOfLike}}, function(err,result){
				if(err) throw err
					res.status(200).json({data:result});
			})		
		})
})

apiRoutesLikeComment.put('/like-comment/:id/:commentid', passport.authenticate('jwt', {session:false}), function(req,res) {
	console.log(req.params.commentId)
	console.log(req.body)
	var userId = req.user.attributes.userId;
	modelLikeComment.update({commentId: req.params.commentid, videoWebsiteId:req.params.id}, 
		{$set:{liked:0, 
			numberOfLike:req.body.numberOfLike,
			updatedAt:Date.now()}}, 
			function(err,result){
				if(err) return res.status(500).json({
					message:"Server error"
				})
			modelComment.update({commentId:req.params.commentid},{$set:{numberOfLike:0}}, function(err,result){
				if(err) throw err
					res.status(200).json({data:result});
			})	
		})		
})

apiRoutesLikeComment.get('/like-comment/:id', passport.authenticate('jwt',{session:false}), function(req,res) {
	var userId=req.user.attributes.userId;
	console.log(req.params.id)
	modelLikeComment.find({userId:userId, videoWebsiteId:req.params.id}, function(err,result){
		console.log(result)
		if(err) return res.status(500).json({
			message:"Server error"
		})
			return res.status(200).json({
				message:"Successfully",
				data:result
			})
		})		
})

// apiRoutesLikeComment.get('/like-video/:id', passport.authenticate('jwt',{session:false}), function(req,res) {
// 	var userId=req.user.attributes.userId;
// 	modelLike.findOne({userId:userId,videoWebsiteId:req.params.id}, function(err,result){
// 		if(err) return res.status(500).json({
// 			message:"Server error"
// 		})
// 		if(result==null){
// 			return res.status(200).json({
// 				message:"Data not found",
// 			})
// 		}else{
// 				return res.status(200).json({
// 				message:"Successfully",
// 				data:result
// 			})
// 		}		
// 	})		
// })

module.exports=apiRoutesLikeComment;