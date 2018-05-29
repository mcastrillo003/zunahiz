'use strict'
var crypto = require('crypto');
var User=require('../models/user');
//var Plan=require('../models/plan');
//var Image=require('../models/image');

function getUser(req,res){
  var userId=req.params.id;

  User.findById(userId,(err,user)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user){
        res.status(404).send({message: 'Erabiltzaile hori ez da existitzen'});
      }else{
            res.status(200).send({user});
        }
    }
  });
}

function getUsers(req,res){
  var userId=req.params.id;

  User.find({},(err,users)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea erabiltzaileak eskuratzean'});
    }else{
      if(!users){
        res.status(404).send({message: 'Ez dago erabiltzailerik'});
      }else{
            res.status(200).send({users});
        }

    }
  });
}

function getAdmin(req,res){
  var username="admin";

  User.find({'username':username},(err,user)=>{
    if(err)
    {
       res.status(500).send({message: 'Errorea administraria eskuratzean'});
    }else{
      if(!user){
        res.status(404).send({message: 'Ez dago administraririk'});
      }else{
            res.status(200).send({user});
        }

    }
  });
}

function saveUser(req,res){
  var user=new User();
  //izena,email,hash eta salt register bitartez lortuko dira
  var params=req.body;
  user.username=params.username;//probarako soilik, parametro hau registerretik lortuko da
  user.firstName=params.firstName;
  user.lastName=params.lastName;
  user.lastName2=params.lastName2;
  user.description=params.description;

  user.save((err,userStored)=>{
    if(err)
    {
      console.log(err);
      res.status(500).send({message: 'Errorea erabiltzailea gordetzerakoan'});
    }else{
      if(!userStored){
        res.status(404).send({message: 'Ezin izan da erabiltzailea gorde'});
      }else{
          //
          var image=new Image();
          image.picture="profileDefault.png";
          image.user=userStored._id;

          image.save((err,imageStored)=>{
            if(err){
              res.status(500).send({message: 'Errorea irudia gordetzean'});
            }else{
              if(!imageStored){
                res.status(404).send({message: 'Ez da irudia gorde'});
              }else{
                console.log('sortutako argazkiaren id: '+imageStored._id);
                //res.status(200).send({user: userStored});
                var image2=new Image();
                image2.picture="portadaDefault.jpg";
                image2.user=userStored._id;

                image2.save((err,imageStored2)=>{
                  if(err){
                    res.status(500).send({message: 'Errorea portada gordetzean'});
                  }else{
                    if(!imageStored2){
                      res.status(404).send({message: 'Ez da portada gorde'});
                    }else{
                      //res.status(200).send({image: imageStored});
                      console.log('sortutako portadaren id: '+imageStored2._id);
                      res.status(200).send({user: userStored});
                    }
                  }

                });
              }
            }

          });
          //
          //res.status(200).send({user: userStored});
        }
    }
  });
}

function existsUser(req,res){
  var username=req.params.username;

  User.find({'username':username},(err,user)=>{
    if(err){
       res.status(500).send({message: 'Errorea erabiltzailea eskuratzean'});
    }else{
      if(!user|| user==false){//array hutsa = false delako. Hau da, []=false da
        res.status(404).send({message: 'Ez dago username hori erregistratuta'});
      }else{
          //argazkiaren informazioa agertzea beharrezkoa bada, populate egin hemen
          res.status(200).send({user: user});
        }

    }
  });
}

function updateUser(req,res){
  var userId=req.params.id;
  var update=req.body;

  User.findByIdAndUpdate(userId,update,(err,userUpdated)=>{
    if(err)
    {
      res.status(500).send({message: 'Errorea erabiltzailea gaurkotzean'});
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'Ezin izan da erabiltzailea gaurkotu'});
      }else{


        userUpdated.firstName=update.firstName;
        userUpdated.lastName=update.lastName;
        userUpdated.lastName2=update.lastName2;
        userUpdated.description=update.description;
        userUpdated.portada=update.portada;
        userUpdated.argazkia=update.argazkia;

        var token;
        token = userUpdated.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
      }
    }
  });
}

function deleteUser(req,res){
  var userId=req.params.id;
  console.log(userId)



/*  Plan.remove({'sortzailea':userId}).exec((err,plans)=>{
    if(err){
      console.log("errorea")
      res.status(500).send({message: 'Errorea erabiltzaileak sortutako planak eskuratzen'});
    }else{
      console.log("sartu naiz")*/
        User.findByIdAndRemove(userId,(err,userRemoved)=>{
          if(err)
          {
            res.status(500).send({message: 'Errorea erabiltzailea ezabatzean'});
          }else{
            console.log(userRemoved)
            if(!userRemoved){
              res.status(404).send({message: 'Ezin da erabiltzailea ezabatu'});
            }else{
              res.status(200).send({user: userRemoved});
            }
          }
        });
      //}
    //});

  }

module.exports={
  getUser,
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  existsUser,
  getAdmin
}
