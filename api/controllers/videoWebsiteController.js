var modelVideoWebsite=require('../models/modelVideoWebsite');
var express=require('express');
var jwt=require('jsonwebtoken');
var number = require('./randomNumber');
var mongoose=require('mongoose');
apiRoutesVideoWebsite=express.Router();
var passport = require("passport");

apiRoutesVideoWebsite.get('/video', function(req,res){
	var limit=req.query.maxResult;
	var page=req.query.page;
	var search=req.query.search;
	if(limit==undefined||limit==null){
		limit=10;
	}
	if(page==undefined||page==null||page==""){
		page=1;
	}
	var totalVideo=0;
	if(search!=undefined){
		loadVideoSearch(search, limit, page, res);
	}else{
		loadVideoNoSearch(limit, page, res);
	}	
});

function loadVideoSearch(search, limit, page, res){
	modelVideoWebsite.count({ $text: { $search: search } }, function(err, count){
		totalVideo=count;
	});
	modelVideoWebsite.find({ $text:{ $search:search }})
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

function loadVideoNoSearch(limit, page, res){
	modelVideoWebsite.count({'attributes.status':2}, function(err, count){
		totalVideo=count;
	});
	modelVideoWebsite.find({'attributes.status':2})
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

apiRoutesVideoWebsite.get("/video/:id", (req,res)=>{
	modelVideoWebsite.findOne({'attributes.videoWebsiteId':req.params.id}, (err, result)=>{
		if(err) return res.status(500).json({message:"Server error"})
			res.status(200).json(result);
	})
})

//===============================Tạo mới video=====================================//
apiRoutesVideoWebsite.post("/video", passport.authenticate('jwt', {session:false}), (req,res)=>{
	console.log(req.user)
	var userId=req.user.attributes.userId;
	var randomnumber=number.random(10000000,99999999);
	if(req.body.attributes.thumbnail==""){
		var avatar="https://phunudep.com/wp-content/uploads/2016/01/anh-thien-nhien-tuoi-dep-ngay-xuan-hinh-2.jpg"
	}else{
		var avatar=req.body.attributes.thumbnail
	}
	var videoWebsite =
	{
		types:'websiteVideo',
		attributes:{
			videoWebsiteId:randomnumber,
			name: req.body.attributes.name,
			description: req.body.attributes.description,
			thumbnail:avatar,
			keywords: req.body.attributes.keywords,
			url: req.body.attributes.url,			
			userId:userId,
			createdAt:Date.now(),
			updatedAt:Date.now(),
			status:1
		},
		play:{
			listened:req.body.play.listened,
			downloaded:req.body.play.downloaded,
			favourited:req.body.play.favourited
		}
	};

	if(req.body.attributes.name==null
		||req.body.attributes.name==undefined
		||req.body.attributes.name.length < 7
		||req.body.attributes.name.length==0){
		res.status(401).json({
			message:"Video name must be larger than 7 character"
		})
		return false;
	}
	modelVideoWebsite.create(videoWebsite, (err,result)=>{
		if(err){
			res.status(500).json({
				message:"Server error"
			})
		}
		res.status(200).json(result);
	});
})
//===============================Tạo mới video=====================================//

//===============================Đếm lượt nghe=====================================//
apiRoutesVideoWebsite.put("/video/:id", (req,res)=>{
	var userId=req.user.userId;

	if(req.body.name==null
		||req.body.name==undefined
		||req.body.name.length<7
		||req.body.name.length==0){
		res.status(401).json({
			message:"Video name must be larger than 7 character"
		})
		return false;
	}
	if(req.body.listened==undefined||req.body.listened==null){
		req.body.listened=0;
	}

	if(req.body.downloaded==undefined||req.body.downloaded==null){
		req.body.listened=0;
	}

	if(req.body.favourited==undefined||req.body.favourited==null){
		req.body.listened=0;
	}
	modelVideoWebsite.findOne({"attributes.videoWebsiteId": req.params.id}, function(err,result){
		if(err) return res.status(500).send({message:"Server error"});
		modelVideoWebsite.update({"attributes.videoWebsiteId": req.params.id},{$set:{
			"play.listened":parseInt(result.play.listened)+parseInt(req.body.listened),
			"play.downloaded":parseInt(result.play.downloaded)+parseInt(req.body.downloaded),
			"play.favourited":parseInt(result.play.favourited)+parseInt(req.body.downloaded),
			"attributes.name":req.body.name,
			"attributes.description":req.body.description,
			"attributes.thumbnail":req.body.thumbnail,
			"attributes.keywords":req.body.keywords}}, 
			(err,result)=>{
				if(err){
					res.status(500).json({
						message:"Server error"
					})
				}else{
					res.status(200).json(result);
				}
			});
		
	});	
})
//===============================Đếm lượt nghe=====================================//
//=======================================Xóa video=================================//
apiRoutesVideoWebsite.delete("/video/:id", passport.authenticate('jwt',{session:false}), (req,res)=>{
	var userId=req.user.attributes.userId;
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

module.exports=apiRoutesVideoWebsite;
