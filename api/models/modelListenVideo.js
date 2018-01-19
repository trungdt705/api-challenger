var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var listenSchema=new Schema({
		videoWebsiteId:String,
		numberOfListened:Number,
		createdAt:String,
		updatedAt:String,
		status:String
})

var listenModel=mongoose.model('listenmodel', listenSchema)

module.exports=listenModel;