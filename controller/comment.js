import DYvideo from "../models/Video.js";
import DYuser from "../models/userModel.js";
import DYcomments from "../models/Comment.js";
import { response } from "express";

export const getComments = async (req,res)=>{
    try{
        const comments = await DYcomments.find( {videoId: req.params.id} );
    
        return res.status(200).json(comments);
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }

    
}

export const addComment = async (req,res)=>{
    try{
        const newComm = new DYcomments(req.body);
        newComm.userId = req.user.id;
        newComm.videoId = req.params.id;
        newComm.desc = req.body.newcmnt;
        await newComm.save();
    
        return res.status(200).json(newComm);
    }   
    catch (err) {
        return res.status(500).json({message: err.message});
    }
    
}
