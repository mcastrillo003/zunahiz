'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ImageSchema=Schema({
  picture: String,
  user:String
});

module.exports=mongoose.model('Image',ImageSchema);
