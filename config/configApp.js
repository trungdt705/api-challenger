var config = require('./configMongoose');
module.exports={
	secretToken: "my-secret",
	url: ()=> {
		return `mongodb://${config.username}:${config.password}@ds021694.mlab.com:21694/myapp`;
	}
}