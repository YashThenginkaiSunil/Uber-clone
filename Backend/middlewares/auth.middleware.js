const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => 
{
    // 'Authorization: Bearer <token>' 
    // .split(' ')[1] grabs the second part — the actual token — after splitting the string on the space.
    // The optional chaining (?.) ensures that if the header doesn't exist, it won't throw an error.
    // “Get the token from cookies if it's there; otherwise, check the Authorization header.”
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // checks if the token is present in blackList Collection, token is put there when we logout
    const isBlacklisted = await userModel.findOne({ token: token });
    
    if (isBlacklisted) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try 
    {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;
        next();
    } 
    catch (err) 
    {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}