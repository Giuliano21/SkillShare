const jwt= require('jsonwebtoken');
const user = require('../models/User')

function generateAccessToken(user){
    return jwt.sign(
        {userId: user._id , role: user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : '15m'} 
    );
}
