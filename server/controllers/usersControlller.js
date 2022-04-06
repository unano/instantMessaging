const User = require ("../model/userModel");
const bcrypt = require("bcrypt");
const e = require("express");


module.exports.register = async (req, res, next) =>{
    try{
        const {username, email, password }= req.body;
        const usernameCkeck = await User.findOne({username});
        if(usernameCkeck)
        return res.json({msg:"Username alreafy used", status: false});
        const emailCheck = await User.findOne({email});
        if(emailCheck)
        return res.json({msg:"Email already used", status: false});

        const hashedPasword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            password:hashedPasword,
        }); 
        delete user.password;
        return res.json({status:true, user})
    } catch (ex){
        next(ex);
    }
}