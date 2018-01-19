var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var commentSchema=new Schema({
	types:String,
	commentId:String,
	userId:String,
	thumbnail:String,
	videoWebsiteId:String,
	comment:String,
	numberOfLike:Number,
	createdAt:String,
	updatedAt:String,
	status:Number
});

var modelComment=mongoose.model('modelComment', commentSchema);
module.exports=modelComment;