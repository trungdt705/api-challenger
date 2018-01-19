var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var likeSchema=new Schema({
		videoWebsiteId:String,
		userId:String,
		favourited:String,
		numberOfFavourited:Number,
		createdAt:String,
		updatedAt:String,
		status:String
})

var likeModel=mongoose.model('likemodel', likeSchema)

module.exports=likeModel;