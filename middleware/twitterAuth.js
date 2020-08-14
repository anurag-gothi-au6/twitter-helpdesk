const User = require('../models/Users')
module.exports = async function(req,res,next){
    try {
        const user = await User.findByEmailAndPassword(req.body.email,req.body.password)
        if(user){
            if(user.enterprise.accessToken===null){
                if(user.admin===true){
                    throw new Error('Add a twiiter account')
                }
                else{
                    throw new Error('Ask Your Enterprise Admin to add a twitter account')
                }
            }
            else{
                next()
            }
        }
        else{
            throw new Error('User not Found')
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
   
}