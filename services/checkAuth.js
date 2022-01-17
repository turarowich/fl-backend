const jwt = require('jsonwebtoken')
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const Users = require('../models/Users')
const accesTokenTime = 60 * 30
async function authonticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]
    if(token == null){
        console.log(req.cookies.REFRESH_TOKEN);
        const refresh = req.cookies.REFRESH_TOKEN 
        const user =refresh && await Users.findOne({refreshToken:refresh})
        console.log(user);
        if(!user) return res.sendStatus(403)
        const accessToken = jwt.sign({password:user.password,email:user.email},ACCESS_TOKEN,{expiresIn: accesTokenTime + 's'})
        res.json({accessToken})
        next()
    }
    jwt.verify(token,ACCESS_TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
};

module.exports = authonticateToken