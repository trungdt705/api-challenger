var express=require('express');
var playlistModel=require('../models/modelPlaylist');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var number = require('./randomNumber');
var passport = require("passport");
var apiRoutesPlaylist = express.Router();


apiRoutesPlaylist.post("/playlist", passport.authenticate('jwt', {session:false}), (req,res)=>{
	if(req.body.attributes.thumbnail==""){
		var thumbnail ="https://tophinhanhdep.net/wp-content/uploads/2015/12/anh-dep-mua-xuan-3.jpg"
	}else{
		thumbnail=req.body.attributes.thumbnail
	}
	var userId=req.user.attributes.userId;
	var playlist={
			types:"Playlist",
			attributes:{
				playlistId:number.random(10000000,99999999),
				name:req.body.attributes.name,
				description:req.body.attributes.description,
				thumbnail:thumbnail,
				userId:userId,
				createdAt:Date.now(),
				updatedAt:Date.now(),
				status:1
			}
	};
	if(req.body.attributes.name==null||req.body.attributes.name==undefined||req.body.attributes.name.length<7||req.body.attributes.name.length==0){
		res.status(401).json({
			message:"Playlist name must be larger than 7 character"
		})
		return false;
	}
	playlistModel.create(playlist, (err,result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			})
		}else{
			res.status(200).json(result);
		}
	})
})

apiRoutesPlaylist.get("/playlist", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var limit=req.query.maxResult;
	var page=req.query.page;
	var userId=req.user.attributes.userId;
	if(limit==undefined||limit==null){
		limit=10;
	}
	if(page==undefined||page==null){
		page=1;
	}
	var totalPlaylist=0;
	playlistModel.count({'attributes.userId':userId}, function(err, count){
		totalPlaylist=count;
	});
	playlistModel.find({'attributes.userId':userId})
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
				"totalItem":totalPlaylist,
				"totalPage":parseInt(totalPlaylist/limit)+1
			}});
		}
	});
});

apiRoutesPlaylist.get("/playlist/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var userId=req.user.attributes.userId;
	playlistModel.findOne({'attributes.userId':userId,'attributes.playlistId':req.params.id},
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

apiRoutesPlaylist.put("/playlist/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	if(req.body.attributes.thumbnail==""){
		var thumbnail ="https://tophinhanhdep.net/wp-content/uploads/2015/12/anh-dep-mua-xuan-3.jpg"
	}else{
		thumbnail=req.body.attributes.thumbnail
	}
	var userId=req.user.attributes.userId;
	if(req.body.attributes.name==null||req.body.attributes.name==undefined||req.body.attributes.name.length<7||req.body.attributes.name.length==0){
		res.status(401).json({
			message:"Playlist name must be larger than 7 character"
		})
		return false;
	}

	playlistModel.update({
		'attributes.userId':userId, 
		'attributes.playlistId':req.params.id},
		{$set:{
			'attributes.name':req.body.attributes.name, 
			'attributes.description':req.body.attributes.description,
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

apiRoutesPlaylist.delete("/playlist/:id", passport.authenticate('jwt', {session:false}), (req,res)=>{
	var userId=req.user.attributes.userId;
	playlistModel.remove({'attributes.userId':userId, 'attributes.playlistId':req.params.id}, function(err, result){
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

module.exports = apiRoutesPlaylist;