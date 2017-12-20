var express = require('express');
var videoModel = require('../models/modelVideo');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var number = require('./randomNumber');
var apiRoutesVideo = express.Router();

apiRoutesVideo.use( (req,res, next)=> {
	var token = req.headers['authorization'];
	if(token){
		jwt.verify(token, req.app.get('superSecret'), (err, decoded)=>{
			if(err){
				return res.json({
					success:false,
					message:"Token is invalid"
				})
			}else{
				req.decoded=decoded;
				next();
			}
		});
	}else{
		res.status(403).json({
			message:"Not exist Token"
		})
	}
})

apiRoutesVideo.post("/video", (req,res)=>{
	var token = req.headers['authorization'];
	var tokenDecode = jwt.decode(token);
	var userId = tokenDecode.user.data.attributes.userId;
	var video = {
		data:{
			types:'Video',
			attributes:{
				videoId:number.random(100000,999999),
				youtubeId: req.body.youtubeId,
				name: req.body.name,
				description: req.body.description,
				keywords: req.body.keywords,
				playlistId: req.body.playlistId,
				thumbnail: req.body.thumbnail,
				userId:userId
			}
		}
	}
	if(req.body.name==null||req.body.name==undefined||req.body.name.length<7||req.body.name.length==0){
		res.status(401).json({
			message:"Video name must be larger than 7 character"
		})
		return false;
	}

	if(req.body.youtubeId==null||req.body.name==undefined||req.body.name.length==0){
		res.status(401).json({
			message:"YoutubeID can not empty"
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

apiRoutesVideo.get("/video", (req,res)=>{
	var token = req.headers['authorization'];
	var tokenDecode = jwt.decode(token);
	var userId = tokenDecode.user.data.attributes.userId;

	videoModel.find({'data.attributes.userId':userId,'data.attributes.playlistId':req.query.playlistId}, function(err, result){
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json(result);
		}
	})
});

apiRoutesVideo.put("/video/:id", (req,res)=>{
	var token = req.headers['authorization'];
	var tokenDecode = jwt.decode(token);
	var userId = tokenDecode.user.data.attributes.userId;

	videoModel.update({'data.attributes.userId':userId, 'data.attributes.videoId':req.params.id},
		{$set:{'data.attributes.name':req.body.name, 'data.attributes.description':req.body.description,'data.attributes.keywords':req.body.keywords,
		'data.attributes.playlistId':req.body.playlistId,'data.attributes.thumbnail':req.body.thumbnail}}, 
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

apiRoutesVideo.delete("/video/:id", (req,res)=>{
	var token = req.headers['authorization'];
	var tokenDecode = jwt.decode(token);
	var userId = tokenDecode.user.data.attributes.userId;

	videoModel.remove({'data.attributes.userId':userId, 'data.attributes.videoId':req.params.id}, function(err, result){
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