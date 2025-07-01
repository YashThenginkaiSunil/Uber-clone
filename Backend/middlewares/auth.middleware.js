const userModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model.js');
const captainModel = require('../models/captain.model.js')




module.exports.authUser = async (req, res, next) => 
{
    // 'Authorization: Bearer <token>' 
    // .split(' ')[1] grabs the second part — the actual token — after splitting the string on the space.
    // The optional chaining (?.) ensures that if the header doesn't exist, it won't throw an error.
    // “Get the token from cookies if it's there; otherwise, check the Authorization header.”
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    console.log("user auth middleware token");
    console.log(token);
    
    if (!token) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // checks if the token is present in blackList Collection, token is put there when we logout
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });
    
    console.log("is token blacklisted?");
    console.log(isBlacklisted);
    
    if (isBlacklisted) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try 
    {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await userModel.findById(decoded._id)
        console.log(user);
        req.user = user;
        return next();
    } 
    catch (err) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports.authCaptain = async (req, res, next) => 
{
    console.log("inside authCaptain");
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

     console.log("token in authCaptain");
     console.log(token);

    if (!token)
    {
        console.log("no token found");
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    console.log("blacklisted?");
    console.log(isBlacklisted);

    if (isBlacklisted) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded:");
        console.log(decoded);
        
        const captain = await captainModel.findById(decoded._id)

         console.log("captainData in authCaptain:");
        console.log(captain);
        req.captain = captain;

        return next()
    } 
    catch (err) 
    {
        console.log("inside catch of authCaptain:");
        console.log(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}