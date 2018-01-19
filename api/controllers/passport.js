var passport = require("passport");
var mongoose=require('mongoose');
var passportJWT = require("passport-jwt");
var modelUser = require("../models/modelUser");
var config = require('../../config/configApp.js');
var ExtractJwt=passportJWT.ExtractJwt;
var JwtStrategy=passportJWT.Strategy;

var options={};
options.jwtFromRequest=ExtractJwt.fromAuthHeaderWithScheme('JWT');
options.secretOrKey=config.secretToken;

var strategy=new JwtStrategy(options,  function(payload, done){
  modelUser.findOne({'attributes.userId': payload.userId}, function (err, user) {
    if(err) throw err;
    if(user)  return done(null, user);
    else{
      return done(null, false);
    }
  })
})

var FacebookStrategy=require('passport-facebook').Strategy;

var fbStrategy= new FacebookStrategy({
    clientID:'1419251764853470',
    clientSecret:'4f110b1ddacb4498f54e631b89d08598',
    callbackURL:'http://localhost:3000/auth/facebook/callback',
    profileFields:['email', 'name', 'gender', 'displayName', 'profileUrl', 'photos','birthday']
}, function (accessToken, refreshToken, profile, done) {
  modelUser.findOne({'attributes.userId':profile.id}, function (err, user) {
    if(err) return done(err);
    if(user) return done(null, user)
      else{
        var date= new Date(profile._json.birthday);
        var birthday= date.getTime();
        modelUser.create({'attributes.userId':profile.id,
                          'attributes.username':profile._json.name,
                          'attributes.tokenFb': accessToken,
                          'attributes.gender':profile._json.gender,
                          'attributes.email':profile._json.email,
                          'attributes.thumbnail':profile.photos[0].value,
                          'attributes.birthday':birthday,
                          'attributes.role':1,
                          'attributes.createdAt':Date.now(),
                          'attributes.updatedAt':Date.now(),
                          'attributes.status':'1'}, function (err, user) {
          if(err) throw err;
          if(user){
            return done(null, user); 
          } 
        })
      }
    })
})

module.exports={
  strategy:strategy,
  fbStrategy:fbStrategy
}