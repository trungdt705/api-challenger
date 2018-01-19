var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var notiCheckVideoSchema = new Schema({
		notiId:String,
		videoWebsiteId:String,
		userId:String,
		adminId:String,
		contentNoti:String,
		createdAt:String,
		updatedAt:String,
		status:Number
})

var notiCheckVideo = mongoose.model('notivideomodel', notiCheckVideoSchema)

module.exports=notiCheckVideo;