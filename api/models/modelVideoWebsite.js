var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var videoSchema=new Schema({
	types:String,
	attributes:{
		videoWebsiteId:String,
		name:String,
		description:String,
		thumbnail:String,
		keywords:Array,
		url:String,
		userId:String,
		createdAt:String,
		updatedAt:String,
		status:String
	},
	play:{
		listened:Number,
		downloaded:Number,
		favourited:Number
	}
});

var modelVideoWebsite=mongoose.model('modelVideoWebsite', videoSchema);

module.exports=modelVideoWebsite;