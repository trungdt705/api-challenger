var modelVideoWebsite=require('../models/modelVideoWebsite');
var express=require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
apiRoutesVideoUpload=express.Router();
var passport = require("passport");

apiRoutesVideoUpload.get('/upload-video', passport.authenticate('jwt', {session:false}), function(req,res){
	console.log(req.user)
	var search=req.query.search;
	var fromDate=req.query.fromDate;
	var toDate=req.query.toDate;
	var userId=req.user.attributes.userId;
	var limit=req.query.maxResult;
	var page=req.query.page;
	console.log(page)
	console.log(limit)
	console.log(search)
	if(limit==undefined||limit==null){
		limit=10;
	}
	if(page==undefined||page==null||page==""){
		page=1;
	}

	if((search == "" || search==undefined) && fromDate != ""){
		findVideoNoSearch(userId, fromDate, toDate, limit, page, res);
	}else if(search !="" && fromDate != "" && toDate != ""){
		if(fromDate > toDate){
			return res.status(401).json({
				message:"Ngày đến phải lớn hơn ngày từ"
			})
		}	
		findVideoSearch(search, userId, fromDate, toDate, limit, page, res);
	}else if(search != "" && fromDate == "" && toDate == ""){
		findVideoNoDate(search, userId, limit, page, res)
	}else if(search != "" && (fromDate == "" || toDate == "")){
		findVideoSearchOnlyFromDateOrToDate(search,userId, fromDate, toDate, limit, page, res);
	}
});

function findVideoNoSearch(userId, fromDate, toDate, limit, page, res){
	console.log('findVideoNoSearch')
	var totalVideo=0;
	if(fromDate!="" && toDate!="" && fromDate!=undefined && toDate !=undefined){
		findVideoNoSearchandFullDate(userId, fromDate, toDate, limit, page, res);
	}else{
		findVideoNoSearchAndNotFullDate(userId, fromDate, toDate, limit, page, res);
	}
}

function findVideoNoSearchandFullDate(userId, fromDate, toDate, limit, page, res){
	console.log('findVideoNoSearchandFullDate')
	console.log(toDate)
	modelVideoWebsite.count({$and:[{'attributes.userId': userId},
		{'attributes.createdAt':{$gte:fromDate}},
		{'attributes.createdAt':{$lte:toDate}}]}, function(err, count){
			totalVideo = count;
		});
	modelVideoWebsite.find({$and:[{'attributes.userId': userId},
		{'attributes.createdAt':{$gte:fromDate}},
		{'attributes.createdAt':{$lte:toDate}}]})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err,result)=>{
		if(err) {
			return res.status(500).send({message:"Server error"});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
}

function findVideoNoSearchAndNotFullDate(userId, fromDate, toDate, limit, page, res){
	console.log('Not full date')
	modelVideoWebsite.count({$and:[{'attributes.userId': userId}]}, function(err, count){
			totalVideo = count;
			console.log(totalVideo)
		});
	modelVideoWebsite.find({$and:[{'attributes.userId': userId}]})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err,result)=>{
		if(err) {
			return res.status(500).send({message:"Server error"});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
}

function findVideoSearch(search, userId, fromDate, toDate, limit, page, res){
	console.log('findVideoSearch')
	var totalVideo=0;
	modelVideoWebsite.count({$and:[{$text:{$search:search}},{'attributes.userId': userId},
		{'attributes.updatedAt':{$gte:fromDate}},
		{'attributes.updatedAt':{$lte:toDate}}]}, function(err, count){
			totalVideo=count;
			console.log(totalVideo);
		});
	modelVideoWebsite.find({$and:[{$text:{$search:search}},
		{'attributes.userId': userId},
		{'attributes.updatedAt':{$gte:fromDate}},
		{'attributes.updatedAt':{$lte:toDate}}]})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err,result)=>{
		if(err) {
			return res.status(500).send({message:"Server error"});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
}

function findVideoNoDate(search, userId, limit, page, res){
	console.log('findVideoNoDate')
	var totalVideo=0;
	modelVideoWebsite.count({$and:[{$text:{$search:search}},
		{'attributes.userId': userId}]}, function(err, count){
			totalVideo=count;
			console.log(totalVideo);
		});
	modelVideoWebsite.find({$and:[{$text:{$search:search}},
		{'attributes.userId': userId}]})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err,result)=>{
		if(err) {
			return res.status(500).send({message:"Server error"});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
}

function findVideoSearchOnlyFromDateOrToDate(search,userId, fromDate, toDate, limit, page, res){
	console.log('findVideoSearchOnlyFromDateOrToDate')
	var totalVideo=0;
	modelVideoWebsite.count({$and:[{$text:{$search:search}},{'attributes.userId': userId},
		{$or:[{'attributes.updatedAt':{$gte:fromDate}},
		{'attributes.updatedAt':{$gte:toDate}}]}]}, function(err, count){
			totalVideo = count;
			console.log(totalVideo)
		});
	modelVideoWebsite.find({$and:[{$text:{$search:search}},{'attributes.userId': userId},
		{$or:[{'attributes.updatedAt':{$gte:fromDate}},
		{'attributes.updatedAt':{$gte:toDate}}]}]})
	.limit(parseInt(limit))
	.skip(parseInt((page-1)*limit))
	.sort({"attributes.createdAt":1}).exec((err,result)=>{
		if(err) {
			return res.status(500).send({message:"Server error"});
		}else{
			res.status(200).json({data:result, meta:{
				"limit":limit,
				"page":page,
				"totalItem":totalVideo,
				"totalPage":parseInt(totalVideo/limit)+1
			}});
		}
	})
}

//=======================================Xóa video=================================//
apiRoutesVideoUpload.delete("/video/:id", (req,res)=>{
	var userId=req.user.userId;
	modelVideoWebsite.remove({"attributes.videoWebsiteId": req.params.id}, (err,result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			})
		}else{
			res.status(200).json({
				message:"Delete successful"
			});
		}
	});

})
//==================================Kết thúc Xóa video===============================//

module.exports=apiRoutesVideoUpload;
