var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var likeCommentSchema = new Schema({
		commentId:String,
		videoWebsiteId:String,
		userId:String,
		liked:Number,
		numberOfLike:Number,
		createdAt:String,
		updatedAt:String,
		status:Number
})

var likeComment=mongoose.model('likecomment', likeCommentSchema)

module.exports=likeComment;