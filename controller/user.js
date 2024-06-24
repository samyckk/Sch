import express from 'express';
import DYuser from '../models/userModel.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

export const updateUser = async(req,res)=>{
    if(req.params.id === req.user.id){
        try{

            const updatedUser = await DYuser.findByIdAndUpdate(req.user.id,{
                $set: req.body
            },{new: true});
            return res.status(200).json("User updated successfully!");

        }catch(err){
            return res.status(400).json(err);
        }
    }
    else{
        return res.status(500).json({message: "You are not allowed to update other users."});
    }
}
export const deleteUser = async (req,res)=>{
    if(req.params.id === req.user.id){
        try{

            const deleteUser = await DYuser.findByIdAndDelete(req.user.id);
            return res.status(200).json("User Deleted successfully!");

        }catch(err){
            return res.status(400).json(err);
        }
    }
    else{
        return res.status(500).json({message: "You are not allowed to Delete other user."});
    }
}
//DOES NOT NEED AUTHENTICATION
export const getUser = async(req,res)=>{
    try{
        const getuser = await DYuser.findById(req.params.id);
        return res.status(200).json(getuser);
    }
    catch(err){
        return res.status(400).json("error in getting user");
    }
}

export const subscribe = async (req, res) => {
    try {
      await DYuser.findByIdAndUpdate(req.user.id, {
        $push: { subscribedUsers: req.params.id },
      });
      await DYuser.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });
      res.status(200).json("Subscription successfull.")
    } catch (err) {
      res.status(500).json("Error updating");
    }
  };

  export const unsubscribe = async (req, res) => {
    try {
      try {
        await DYuser.findByIdAndUpdate(req.user.id, {
          $pull: { subscribedUsers: req.params.id },
        });
        await DYuser.findByIdAndUpdate(req.params.id, {
          $inc: { subscribers: -1 },
        });
        res.status(200).json("Unsubscription successfull.")
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
};

export const applyEdu = async (req, res) => {
    try{
      const applier = await DYuser.findByIdAndUpdate(req.user.id,{
        $set : {role : "requested"}
      }, {new : true});

      return res.status(200).json(applier);
    }
    catch (err) { 
      return res.status(500).json("error in apply for Educator");
    }
}


export const reqVerify = async (req, res) => {
  try{
      const listReq = await DYuser.find({ role : "requested"});
      return res.status(200).json(listReq);
  }
  catch(err){
    return res.status(500).json("error in getting appliers");
  }
}

export const updateAcceptReq = async (req, res) => {
  try{
    const UpdateRole = await DYuser.findByIdAndUpdate(req.params.id,{
      $set : {role: "uploader"}
    }, {new: true} );

    return res.status(200).json(UpdateRole);
  }
  catch(err){
    return res.status(500).json("error in handling req");
  }
}

export const updateRejectReq = async (req, res) => {
  try{
    const UpdateRole = await DYuser.findByIdAndUpdate(req.params.id,{
      $set : {role: "student"}
    }, {new: true} );

    return res.status(200).json(UpdateRole);
  }
  catch(err){
    return res.status(500).json("error in handling req");
  }
}

export const logoutFun = async (req, res) => {
  try{
    res.clearCookie('access_token', {
      httpOnly: false,
      secure: true, // Set to true if using HTTPS
      sameSite: 'None' // Adjust according to your needs
    });
    res.status(200).send({ message: 'Logged out successfully' });
  }
  catch(err){
    return res.status(500).json("error in logging out");
  }
}
