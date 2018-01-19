var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var videoSchema= new Schema({
		types:String,
		attributes: {
			videoWebsiteId:String,
			videoId:String,
			name: String,
			description: String,
			keywords: [{
				type: String,
				default:[]
			}],
			url:String,
			playlistId: String,
			thumbnail: String,
			userId:String,
			createdAt:String,
			updatedAt:String,
			status:String
		}
});

var modelVideo=mongoose.model('videomodel', videoSchema);
module.exports=modelVideo;