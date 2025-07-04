const userModel = require('../models/user.model.js');
const userService = require('../services/user.service.js');
const { validationResult } = require('express-validator');
 const blackListTokenModel = require('../models/blackListToken.model.js');

module.exports.registerUser = async (req, res) => 
{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const doesUserExist = await userModel.findOne({ email });

    if (doesUserExist) 
    {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser(
        {
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        }
    );

    const token = user.generateAuthToken();

    console.log("register token");
    console.log(token);

    res.status(201).json({ token, user });
}


module.exports.loginUser = async (req, res) => 
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');// '+' --> overrides 'select:false' which now includes the password field  

    if (!user) // if user not present
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const didPasswordMatch = await user.comparePassword(password); // compare pwd

    if (!didPasswordMatch) 
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    console.log("login token");
    console.log(token);

    res.status(200).json({ token, user });
}


module.exports.getUserProfile = async (req, res, next) => 
{

    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => 
{
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    console.log("user token in logout:");
    console.log(token);
    res.clearCookie('token');
    
    
    const didBlackList = await blackListTokenModel.create({ token });

    console.log("user-logout");
    console.log(didBlackList);
    
    res.status(200).json({ message: 'Logged out' });
}




