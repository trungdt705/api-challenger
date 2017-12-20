var mongoose=require('mongoose');

var Schema= mongoose.Schema;


var userSchema = new Schema({
	data:{
		types:String,
		attributes:{
			username:String,
			password:String,
			repassword:String,
			birthday:String,
			email:String,
			userId:String,
			createTime:String
		}
	}	
})


var userModel=mongoose.model('userModel',userSchema);
module.exports=userModel;