var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var userSchema = new Schema({
		types:String,
		attributes:{
			username:String,
			password:String,
			repassword:String,
			gender:String,
			birthday:String,
			email:String,
			fullname:String,
			userId:String,
			tokenFb:String,
			thumbnail:String,
			role:String,
			createdAt:String,
			updatedAt:String,
			status:String 
		}
});
var userModel=mongoose.model('userModel',userSchema);
module.exports=userModel;