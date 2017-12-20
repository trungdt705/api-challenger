var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var playlistSchema=new Schema({
	data:{
		types:String,
		attributes:{
			playlistId:String,
			name:String,
			description:String,
			thumbnail:String,
			userId:String
		}
	}
})

var playlistmodel=mongoose.model('playlistmodel', playlistSchema)

module.exports=playlistmodel;