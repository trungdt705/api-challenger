var express=require('express');
var Storage=require('@google-cloud/storage');
var configFile= require('./configStorage');
var modelVideoWebsite=require('../models/modelVideoWebsite');
var fs=require('fs');
var multer=require('multer');
var passport = require("passport");

//Lấy id của bucket
var CLOUD_BUCKET=configFile.CLOUD_BUCKET;
//Tạo 1 thể hiện Storage
var storage = Storage({
	projectId : configFile.GCLOUD_PROJECT
});
//Tạo 1 bucket
var bucket=storage.bucket(CLOUD_BUCKET);

var upload= multer({
	storage:multer.memoryStorage(),
	limit:{
		fileSize:50 * 1024 * 1024
	}
});
var routeFile=express.Router();

routeFile.use((req, res, next) => {
	res.set('Content-Type', 'text/html');
	next();
});

routeFile.post('/upload', upload.single("file"), function (req,res) {
	if(req.file){
		var blob= bucket.file(req.file.originalname);
		var blobStream= blob.createWriteStream({
			metadata: {
				contentType: req.file.mimetype
			}
		});
		blobStream.on('error', (err)=>{
			res.status(500).send({
				success:'false',
				message:'Lỗi upload File'
			});
		});
		blobStream.on('finish',()=>{
			var publicUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${blob.name}`;
			blob.makePublic().then(() => {
				res.status(200).json({
					message:'Upload Successfull',
					url:publicUrl
				});
			});
		});

		blobStream.end(req.file.buffer);
	}
	else{
		res.status(409).json({
			success:false,
			message:'Kiểm tra lại file, file không tồn tại hoặc bị lỗi'
		})
	}
	
})
// Download 1 file vào thư mục trong máy tính local
routeFile.get('/download/:id', function(req,res){
	modelVideoWebsite.findOne({'attributes.videoWebsiteId':req.params.id}, function(err,result){
		if(err) {
			res.status(500).send({message:"Server error"});
		}
		var url=result.attributes.url;
		var urlSplit=url.split("/");
		var songName=urlSplit[urlSplit.length-1];
		var remoteFile = bucket.file(songName);
		remoteFile.download({
		  destination: 'E:/NodeJs/1234.mp4'
		}, function(err) {});
	})
})

routeFile.get('/music/:id', function(req,res){	
	var fileId = req.params.id; 
	modelVideoWebsite.findOne({"attributes.videoId" : fileId}, function(err,result){
		if(err){
			res.status(500).send({
				message:"Server errors"
			})
		}
		var url=result.attributes.url;
		res.status(200).send({
			success:true,
			url:url
		})
	})
});
module.exports=routeFile;

