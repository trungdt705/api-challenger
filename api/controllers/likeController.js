var modelLike=require('../models/modelLikeVideo');
var modelVideoWebsite=require('../models/modelVideoWebsite')
var express = require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
var passport = require("passport");
apiRoutesLike = express.Router();

apiRoutesLike.post('/like-video', passport.authenticate('jwt', {session:false}), function(req,res) {
	var numberOfFavourited = parseInt(req.body.numberOfFavourited)
	var userId = req.user.attributes.userId;
	var query = {videoWebsiteId:req.body.videoWebsiteId, userId:userId};
	var data = {
		videoWebsiteId:req.body.videoWebsiteId,
		userId:userId,
		favourited:1,
		numberOfFavourited:numberOfFavourited,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		status:1
	};
	modelLike.findOneAndUpdate(query, data, {upsert:true}, function(err,result){
		if(err) return res.status(500).json({
			message:"Server error"
		})
			modelVideoWebsite.update({'attributes.videoWebsiteId':req.body.videoWebsiteId},{$set:{'play.favourited':numberOfFavourited}}, function(err,result){
				if(err) throw err
					res.status(200).json({data:result});
			})		
		})
})

apiRoutesLike.put('/like-video/:id', passport.authenticate('jwt', {session:false}), function(req,res) {
	console.log(req.body)
	var numberOfFavourited = parseInt(req.body.numberOfFavourited)
	var userId = req.user.attributes.userId;
	var query = {videoWebsiteId:req.params.id, userId:userId};
	var data = {
		videoWebsiteId:req.params.id,
		userId:userId,
		favourited:0,
		numberOfFavourited:numberOfFavourited,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		status:1
	};
	modelLike.findOneAndUpdate(query, data, {upsert:true}, function(err,result){
		if(err) return res.status(500).json({
			message:"Server error"
		})
			modelVideoWebsite.update({'attributes.videoWebsiteId':req.body.videoWebsiteId},{$set:{'play.favourited':numberOfFavourited}}, function(err,result){
				if(err) throw err
					res.status(200).json({data:result});
			})	
		})		
})

apiRoutesLike.get('/like-video', passport.authenticate('jwt',{session:false}), function(req,res) {
	var userId=req.user.attributes.userId;
	modelLike.find({userId:userId}, function(err,result){
		if(err) return res.status(500).json({
			message:"Server error"
		})
			return res.status(200).json({
				message:"Successfully",
				data:result
			})
		})		
})

apiRoutesLike.get('/like-video/:id', passport.authenticate('jwt',{session:false}), function(req,res) {
	var userId=req.user.attributes.userId;
	modelLike.findOne({userId:userId,videoWebsiteId:req.params.id}, function(err,result){
		console.log(result)
		if(err) return res.status(500).json({
			message:"Server error"
		})
		if(result==null){
			return res.status(200).json({
				message:"Data not found",
				data:{
					favourited:0
				}
			})
		}else{
				return res.status(200).json({
				message:"Successfully",
				data:result
			})
		}		
	})		
})


module.exports=apiRoutesLike;