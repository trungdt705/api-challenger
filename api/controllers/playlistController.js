var express=require('express');
var playlistModel=require('../models/modelPlaylist');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var number = require('./randomNumber');
var apiRoutesPlaylist = express.Router();

apiRoutesPlaylist.use((req,res, next)=> {
	var token=req.headers['authorization'];
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
			message:"Not exist token"
		})
	}
})

apiRoutesPlaylist.post("/playlist", (req,res)=>{
	var token=req.headers['authorization'];
	var tokenDecode=jwt.decode(token);
	var userId=tokenDecode.user.data.attributes.userId;
	var playlist={
		data:{
			types:'Playlist',
			attributes:{
				playlistId:number.random(100000,999999),
				name:req.body.name,
				description:req.body.description,
				thumbnail:req.body.thumbnail,
				userId:userId
			}
		}
	};
	if(req.body.name==null||req.body.name==undefined||req.body.name.length<7||req.body.name==0){
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

apiRoutesPlaylist.get("/playlist", (req,res)=>{
	var token=req.headers['authorization'];
	var tokenDecode=jwt.decode(token);
	var userId=tokenDecode.user.data.attributes.userId;
	playlistModel.find({'data.attributes.userId':userId}, (err, result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			});
		}else{
			res.status(200).json(result);
		}
	})
});

apiRoutesPlaylist.put("/playlist/:id", (req,res)=>{
	var token=req.headers['authorization'];
	var tokenDecode=jwt.decode(token);
	var userId=tokenDecode.user.data.attributes.userId;

	playlistModel.update({'data.attributes.userId':userId, 'data.attributes.playlistId':req.params.id},
		{$set:{'data.attributes.name':req.body.name, 'data.attributes.description':req.body.description}}, 
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

apiRoutesPlaylist.delete("/playlist/:id", (req,res)=>{
	var token=req.headers['authorization'];
	var tokenDecode=jwt.decode(token);
	var userId=tokenDecode.user.data.attributes.userId;

	playlistModel.remove({'data.attributes.userId':userId, 'data.attributes.playlistId':req.params.id}, function(err, result){
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

module.exports=apiRoutesPlaylist;