var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var playlistSchema=new Schema({
	types:String,
	attributes:{
		playlistId:String,
		name:String,
		description:String,
		thumbnail:String,
		userId:String,
		createdAt:String,
		updatedAt:String,
		status:String
	}
})

var playlistmodel=mongoose.model('playlistmodel', playlistSchema)

module.exports=playlistmodel;