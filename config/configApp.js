var config = require('./configMongoose');
module.exports={
	secretToken: "my-secret",
	url: ()=> {
		return `mongodb://localhost/myapp`;
	},
}