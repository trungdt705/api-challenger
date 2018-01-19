var modelComment=require('../models/modelComment');
var express = require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
var passport = require("passport");
apiRoutesComment = express.Router();


apiRoutesComment.get('/comment', function(req,res){
	var videoWebsiteId=req.query.videoId;
	console.log('videoWebsiteId='+videoWebsiteId)
	var limit=req.query.maxResult;
	var page=req.query.page;
	console.log(page=="")
	if(limit==undefined||limit==null){
		limit=10;
	}
	if(page==undefined||page==null||page==""){
		console.log(1)
		page=1;
	}
	console.log('page='+page)
	var totalComment=0;
	modelComment.count({videoWebsiteId:videoWebsiteId}, function(err, count){
		totalComment=count;
		console.log(totalComment)
	});
	modelComment.find({videoWebsiteId:videoWebsiteId})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({createdAt:1}).exec(function(err,result){
		if(err){
			res.status(500).send({
				message:"Server error"
			})
		}
		res.status(200).send({data:result, meta:{
			"limit":limit,
			"page":page,
			"totalItem":totalComment,
			"totalPage":parseInt(totalComment/limit)+1
		}})
	});
})

apiRoutesComment.post('/comment/:id', passport.authenticate('jwt', {session:false}), function(req,res){
	var userId=req.user.attributes.userId;
	console.log(req.body.comment)
	var comment= {
		types:'Comment',
		commentId:number.random(1000000000, 9999999999),
		userId:userId,
		thumbnail:req.user.attributes.thumbnail,
		videoWebsiteId:req.params.id,
		comment:req.body.comment,
		numberOfLike:0,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		status:1
	}

	modelComment.create(comment, function(err, result){
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

apiRoutesComment.put('/comment/:id', passport.authenticate('jwt', {session:false}), function(req,res){
	var userId=req.user.attributes.userId;
	modelComment.update({userId:userId, videoWebsiteId:req.params.id, commentId:req.query.commentId}, 
		{$set:{comment:req.body.comment, numberoflike:req.body.numberoflike}}, function(err, result){
		if(err){
			res.status(500).send({
				message:"Server error"
			})
		}
		res.status(200).send({
			message:"Edit comment successfull"
		})
	})
})

apiRoutesComment.delete('/comment/:id', passport.authenticate('jwt', {session:false}), function(req,res){
	var userId=req.user.userId;

	modelComment.remove({userId:userId, videoWebsiteId:req.params.id, commentId:req.query.commentId}, function(err, result){
		if(err){
			res.status(500).send({
				message:"Server error"
			})
		}
		res.status(200).send({
			message:"Delete comment successfull"
		})
	})
})

module.exports=apiRoutesComment;