var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var videoSchema= new Schema({
	data:{
		types:String,
		attributes: {
			videoId:String,
			youtubeId: String,
			name: String,
			description: String,
			keywords: String,
			playlistId: String,
			thumbnail: String,
			userId:String
		}
	}
});

var modelVideo=mongoose.model('videomodel',videoSchema);
module.exports=modelVideo;