import jwt from "jsonwebtoken";


export const tokenChecker = async(req,res,next)=>{
    const token = req.cookies.access_token;    

    if(!token){
        return res.status(403).json({message:"Token is required"});
    }

    //Here user can be written as decodedinfo which we will recieved from token which was id
    jwt.verify(token, process.env.JWT_KEY,(err,user)=>{
        if(err){
            return res.status(201).json({message:"token is invalid"});
        }
        req.user = user;
        next();
    });
}