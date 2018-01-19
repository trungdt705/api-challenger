var modelVideoWebsite=require('../models/modelVideoWebsite');
var express=require('express');
var jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var modelUser = require("../models/modelUser");
apiRoutesAdminVideo=express.Router();
var passport = require("passport");
//middleware xác thực admin
var roleAdmin = function roleAdmin(req, res, next){
	if(req.user.attributes.role == '1'){
		next();
	}else{
		return res.status(401).json({
			message:"Unauthorizated"
		})
	}
}

apiRoutesAdminVideo.get('/admin/video', passport.authenticate('jwt', {session:false}), roleAdmin, function(req,res){
	var limit=req.query.maxResult;
	var page=req.query.page;
	var search=req.query.search;
	var fromDate=req.query.fromDate;
	var toDate=req.query.toDate;
	var status=req.query.status;
	if(limit==undefined||limit==null){
		limit=5;
	}
	if(page==undefined||page==null||page==""){
		page=1;
	}
	var totalVideo=0;
	if(search != "" && fromDate == "" && toDate == ""){
		//Có tìm kiếm, không có ngày tháng, có status, có limit
		console.log('Có tìm kiếm, không có ngày tháng, có status, có limit')
		loadVideoSearchNoDate(search, limit, page, res, totalVideo, status);
	}else if(search =="" && fromDate  == "" && toDate == ""){
		console.log('Không tìm kiếm, không có ngày tháng, có status, có limit')
		loadVideoNoSearchNoDate(limit, page, res, totalVideo, status)
	}else if(search != "" && fromDate != "" && toDate != ""){
			//Có search, chọn ngày tháng, có status, có limit
			console.log('Có search, chọn ngày tháng, có status, có limit')
			loadVideoSearchHaveDate(search, fromDate, toDate, limit, page, res, totalVideo, status)
	}else if(search =="" && fromDate != "" && toDate != ""){
			//Không search, có chọn ngày tháng
			console.log('Không search, có chọn ngày tháng')
			loadVideoNoSearchHaveDate(fromDate, toDate,limit, page, res, totalVideo, status)
	}
});

function loadVideoSearchNoDate(search, limit, page, res, totalVideo, status){
	//Có tìm kiếm, không có ngày tháng, có status, có limit
	modelVideoWebsite.count({'attributes.status':status, $text:{$search:search}}, function(err, count){
		totalVideo=count;
	});
	modelVideoWebsite.find({'attributes.status':status, $text:{$search:search}})
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

function loadVideoNoSearchNoDate(limit, page, res, totalVideo, status){
	modelVideoWebsite.count({'attributes.status':status}, function(err, count){
		totalVideo=count;
	});
	modelVideoWebsite.find({'attributes.status':status})
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

function loadVideoSearchHaveDate(search, fromDate, toDate, limit, page, res, totalVideo, status){
	modelVideoWebsite.count({'attributes.status':status, 
		$text:{$search:search}, 
		'attributes.createdAt':{$gte:fromDate},
		'attributes.createdAt':{$lte:toDate}}, function(err, count){
			totalVideo=count
		})

	modelVideoWebsite.find({'attributes.status':status, 
		$text:{$search:search}, 
		'attributes.createdAt':{$gte:fromDate},
		'attributes.createdAt':{$lte:toDate}})
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

function loadVideoNoSearchHaveDate(fromDate, toDate,limit, page, res, totalVideo, status){
	modelVideoWebsite.count({'attributes.status':status, 
		'attributes.createdAt':{$gte:fromDate},
		'attributes.createdAt':{$lte:toDate}}, function(err, count){
			totalVideo=count
		})

	modelVideoWebsite.find({'attributes.status':status, 
		'attributes.createdAt':{$gte:fromDate},
		'attributes.createdAt':{$lte:toDate}})
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

//===============================Đếm lượt nghe=====================================//
apiRoutesAdminVideo.get("/admin/video/:id", passport.authenticate('jwt', {session:false}),roleAdmin, (req,res)=>{
	var userId=req.user.attributes.userId;
	modelVideoWebsite.findOne({"attributes.videoWebsiteId": req.params.id}, function(err,result){
		if(err) return res.json({
			message:"Server error"
		})
			return res.json({
				message:"successful",
				data:result
			})
		});	
})

apiRoutesAdminVideo.put("/admin/video/verify/:id", passport.authenticate('jwt', {session:false}),roleAdmin, (req,res)=>{
	var userId=req.user.attributes.userId;
	var status=req.body.attributes.status;
	modelVideoWebsite.findOne({"attributes.videoWebsiteId": req.params.id}, function(err,result){
		if(err) return res.status(500).send({message:"Server error"});
		modelVideoWebsite.update({"attributes.videoWebsiteId": req.params.id},{$set:{"attributes.status": status}}, 
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

apiRoutesAdminVideo.put("/admin/video/:id", passport.authenticate('jwt', {session:false}),roleAdmin, (req,res)=>{
	modelVideoWebsite.findOne({"attributes.videoWebsiteId": req.params.id}, function(err,result){
		if(err) return res.status(500).send({message:"Server error"});
		modelVideoWebsite.update({
			'attributes.videoWebsiteId':req.params.id},
			{$set:{
				'attributes.name':req.body.attributes.name, 
				'attributes.description':req.body.attributes.description,
				'attributes.keywords':req.body.attributes.keywords,
				'attributes.thumbnail':req.body.attributes.thumbnail,
				'attributes.updatedAt':Date.now(),
				'attributes.status':req.body.attributes.status}}, 
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
// //===============================Đếm lượt nghe=====================================//
// //=======================================Xóa video=================================//
apiRoutesAdminVideo.delete("/admin/video/:id", passport.authenticate('jwt',{session:false}),roleAdmin, (req,res)=>{
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

module.exports=apiRoutesAdminVideo;
