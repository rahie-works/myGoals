const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../modals/userModel')

const protect = asyncHandler( async (req, res, next) => {
    let token
    //checking if the token and token starts with 'Bearer'
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get Token From Header , split and take the array[1]
            token = req.headers.authorization.split(" ")[1]
            //verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //get user from token without password
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if(!token) {
        res.status(401)
        throw new Error('Not Authorized - No token avaialable')
    }
})

module.exports = {protect}