var express = require('express');
var videoModel = require('../models/modelVideo');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var number = require('./randomNumber');
var passport = require("passport");
var apiRoutesVideo = express.Router();

apiRoutesVideo.post("/member-video", passport.authenticate('jwt', {session:false}), (req,res)=>{
	if(req.body.attributes.thumbnail==""){
		var thumbnail ="https://tophinhanhdep.net/wp-content/uploads/2015/12/anh-dep-mua-xuan-3.jpg"
	}else{
		thumbnail=req.body.attributes.thumbnail
	}
	var userId=req.user.attributes.userId;
	var video =
		{
			types:'individualVideo',
			attributes:{
				videoId:number.random(100000,999999),
				videoWebsiteId:req.body.attributes.videoWebsiteId,
				name: req.body.attributes.name,
				description: req.body.attributes.description,
				keywords: req.body.attributes.keywords,
				url: req.body.attributes.url,
				playlistId: req.body.attributes.playlistId,
				thumbnail: thumbnail,
				userId:userId,
				createdAt:Date.now(),
				updatedAt:Date.now(),
				status:1
			}
		}

	if(req.body.attributes.name==null
		||req.body.attributes.name==undefined
		||req.body.attributes.name.length<7
		||req.body.attributes.name.length==0){
		res.status(401).json({
			message:"Video name must be larger than 7 character"
		})
		return false;
	}

	if(req.body.attributes.playlistId==null
		||req.body.attributes.playlistId==undefined
		||req.body.attributes.playlistId.length==0){
		res.status(401).json({
			message:"playlistId can not empty"
		})
		return false;
	}
	videoModel.create(video, (err,result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			})
		}else{
			res.status(200).json(result);
		}
	})
})

apiRoutesVideo.get("/member-video", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var limit=req.query.maxResult;
	var page=req.query.page;
	var userId=req.user.attributes.userId;
	if(limit==undefined||limit==null){
		limit=10;
	}
	if(page==undefined||page==null){
		page=1;
	}
	var totalVideo=0;
	videoModel.count({'attributes.userId':userId,'attributes.playlistId':req.query.playlistId}, function(err, count){
		totalVideo = count;
	});
	videoModel.find({'attributes.userId':userId,'attributes.playlistId':req.query.playlistId})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err, result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
});

apiRoutesVideo.get("/member-video/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var userId=req.user.attributes.userId;
	console.log(req.params.id)
	videoModel.findOne({'attributes.userId':userId,'attributes.videoId':req.params.id},
		function(err, result){
		console.log(result)
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json(result);
		}
	})
})


apiRoutesVideo.put("/member-video/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	if(req.body.attributes.thumbnail==""){
		var thumbnail ="https://tophinhanhdep.net/wp-content/uploads/2015/12/anh-dep-mua-xuan-3.jpg"
	}else{
		thumbnail=req.body.attributes.thumbnail
	}
	var userId=req.user.attributes.userId;
	videoModel.update({
		'attributes.userId':userId, 
		'attributes.videoId':req.params.id},
		{$set:{
			'attributes.name':req.body.attributes.name, 
			'attributes.description':req.body.attributes.description,
			'attributes.keywords':req.body.attributes.keywords,
			'attributes.playlistId':req.body.attributes.playlistId,
			'attributes.thumbnail':thumbnail,
			'attributes.updatedAt':Date.now()}}, 
		function(err, result){
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json(result);
		}
	})
})

apiRoutesVideo.delete("/member-video/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var userId=req.user.attributes.userId;
	videoModel.remove({'attributes.userId':userId, 'attributes.videoId':req.params.id}, function(err, result){
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json({
				message:"Delete successfully"
			});
		}
	})
})

module.exports=apiRoutesVideo;