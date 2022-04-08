const Channel = require ("../model/channelModel");
const bcrypt = require("bcrypt");


module.exports.createChannel = async (req, res, next) =>{
    try{
        const {channel}= req.body;
        const theChannel = await Channel.create({
            channel
        }); 
        return res.json({status:true, theChannel})
    } catch (ex){
        next(ex);
    }
}

module.exports.getAllChannels = async (req, res, next) => {
    try {
      const users = await Channel.find().select([
        "channel",
        "_id"
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };