var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Image=require('../models/image');

//var Image=require('../models/image');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//Register

module.exports.register = function(req, res) {
  if(!req.body.firstName || !req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "Eremu guztiak bete behar dituzu"
    });
    return;
  }

  User.find({'username':req.body.username},(err,user)=>{
    if(err){
      res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user|| user==false){//array hutsa = false delako. Hau da, []=false da
        var userN = new User();
        userN.firstName = req.body.firstName;
        userN.username = req.body.username;
        userN.lastName=req.body.lastName;
        userN.lastName2=req.body.lastName2;
        userN.description=req.body.description;

        console.log(req.body.password)
        userN.setPassword(req.body.password);
        console.log(userN)

          //erabiltzailearen argazkia sortu
          var image=new Image();
          image.picture="profileDefault.jpg";
          image.user=userN._id;

          image.save((err,imageStored)=>{
            if(err){
              res.status(500).send({message: 'Errorea irudia gordetzean'});
            }else{
              if(!imageStored){
                res.status(404).send({message: 'Ez da irudia gorde'});
              }else{
                console.log('sortutako argazkiaren id: '+imageStored._id);
                userN.argazkia=imageStored._id;
                //erabiltzailearen portada sortu
                var image2=new Image();
                image2.picture="portadaDefault.jpg";
                image2.user=userN._id;

                image2.save((err,imageStored2)=>{
                  if(err){
                    res.status(500).send({message: 'Errorea portada gordetzean'});
                  }else{
                    if(!imageStored2){
                      res.status(404).send({message: 'Ez da portada gorde'});
                    }else{
                      userN.portada=imageStored2._id;
                      console.log('sortutako portadaren id: '+imageStored2._id);
                      userN.save(function(err) {
                        console.log("===userBerria===");
                        console.log(userN);



                  });
                  var token;
                  token = userN.generateJwt();
                  res.status(200);
                  res.json({
                    "token" : token
                  });
                }
              }

            });
          }
        }

          });

      }else{
        res.status(404);
        res.json(err);
      }
    }
  });
};



//Login
module.exports.login = function(req, res) {


  //Authenticate
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
