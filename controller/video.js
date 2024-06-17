import DYvideo from "../models/Video.js"
import DYuser from "../models/userModel.js"

export const addVideo = async (req,res)=>{
    const newVideo = new DYvideo(req.body);
    newVideo.userId = req.user.id;

    try{
        await newVideo.save();
        return res.status(200).json(newVideo);
    }
    catch(err){
        return res.status(402).json({message: err.message});
    }
    
}

export const fetchVideo = async (req,res)=>{
    const video = await DYvideo.findById(req.params.id);
    if(!video){
        return res.status(404).json({message:"Video not found"});
    }
    else{
        return res.status(200).json(video);
    }
}


export const updateVideo = async(req, res) =>{
    const video = await DYvideo.findById(req.params.id);
    if(!video){
        return res.status(404).json({message:"Video not found"});
    }
    try{
        
        if(video.userId === req.user.id){
            const updatedVideo = DYvideo.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true})
    
            return res.status(200).json(updatedVideo);  
        }
        else{
            return res.status(400).json({message: "You are not allowed to edit this video"});
        }


    }catch(err){
        return res.status(400).json({message: "error updating video"});
    }
}

export const deleteVideo = async(req, res) => {

    const video = await findById(req.params.id);
    try{
        if(video.userId === req.user.id){
            await DYvideo.findByIdAndDelete(req.params.id);
        }
    }
    catch(err){
        return res.status(400).json({message: "error deleting video"});
    }
}

export const addView = async(req, res) => {
    try{
        const video = await DYvideo.findByIdAndUpdate(req.params.id,{
            $inc : {views: 1}
        });
        console.log(".");
        return res.status(200).json(video);
    }
    catch(err){
        return res.status(400).json({message: "error in adding views"});
    }
    
}

export const trending = async (req, res) => {
    try{
        const videos = await DYvideo.find().sort({views: -1});
        return res.status(200).json(videos);
    }
    catch(err){
        return res.status(500).json("error in fetching trending");
    }
}

export const random = async (req, res) => {
    try{
        const videos = await DYvideo.aggregate([{ $sample: {size : 40}}]);
        return res.status(200).json(videos);
    }
    catch(err){
        return res.status(500).json("error in fetching random");
    }
}

export const subVids = async (req, res) => {
    try{

        const currUser = await DYuser.findById(req.user.id);
        const subUsers = currUser.subscribedUsers;

        const subVids = await Promise.all(
            subUsers.map((channelId) => {
                return DYvideo.find({ userId: channelId });
            })
        );

        const faltVids = subVids.flat();

        return res.status(200).json(faltVids);
    }
    catch(err){
        return res.status(500).json("error in fetching sub-vids");
    }
}

export const likeVids = async (req,res)=>{
    try {
        const currUser = await DYuser.findById(req.user.id);
        const lv = currUser.likedVids;
    
        const allVids = await Promise.all(
            lv.map(async (vidId) => {
                const video = await DYvideo.findById(vidId);
                return video ? video : null;
            })
        );
    
        const filteredVids = allVids.filter(video => video !== null);
        
        console.log(filteredVids);
        return res.status(200).json(filteredVids);
    }
    catch(err){
        return res.status(500).json("error in fetching like videos"); 
    }
} 

export const yourVid = async (req, res) =>{
    try{
        const yourVids = await DYvideo.find({ userId : req.user.id});

        return res.status(200).json(yourVids);
        
    }
    catch(err){
        return res.status(500).json("error in your videos"); 
    }
}

export const getByTag = async (req, res) => {
    //TO make case insensitive
    const tags = req.query.tags.split(",").map(tag => new RegExp(tag, "i"));
    try {
        const videos = await DYvideo.find({ tags: { $in: tags } }).limit(10);
        return res.status(200).json(videos);
    } catch (err) {
        return res.status(500).json("error in tags");
    }
};

//Seach by Title and Tag
  export const search = async (req, res) => {
    const tag = req.query.q ? new RegExp(req.query.q.trim(), "i") : null;
    const title = req.query.q ? new RegExp(req.query.q.trim(), "i") : null;
    
    let searchCriteria = [];

    if (tag) {
        searchCriteria.push({ tags: { $regex: tag } });
    }

    if (title) {
        searchCriteria.push({ title: { $regex: title } });
    }

    try {
        console.log(searchCriteria);
        const videos = await DYvideo.find({ $or: searchCriteria }).limit(30);
        return res.status(200).json(videos);
    } catch (err) {
        return res.status(500).json("Error in search");
    }
};



export const like = async (req, res) => {
    try {
        // Update the user document to push the liked video ID
        const currUser = await DYuser.findByIdAndUpdate(req.user.id, {
            $push: { likedVids: req.params.id }
        }, { new: true });

        // Increment the like count of the video document
        const video = await DYvideo.findByIdAndUpdate(req.params.id, {
            $inc: { likes: 1 }
        }, { new: true });


        if (currUser.dislikedVids.includes(req.params.id)) {
            const updatedUser = await DYuser.findByIdAndUpdate(req.user.id, {
                $pull: { dislikedVids: req.params.id }
            }, { new: true });
        }


        // Return the updated user document as JSON response
        return res.status(200).json(currUser);
    } catch (err) {
        // Log the error and return a 500 status with the error as JSON response
        return res.status(500).json({ error: err.message });
    }
};


export const dislike = async (req, res) => {
    try {
        // Update the user document to push the liked video ID
        const currUser = await DYuser.findByIdAndUpdate(req.user.id, {
            $push: { dislikedVids: req.params.id }
        }, { new: true });

        // Increment the like count of the video document
        const video = await DYvideo.findByIdAndUpdate(req.params.id, {
            $inc: { likes: -1 }
        }, { new: true });


        if (currUser.likedVids.includes(req.params.id)) {
            const updatedUser = await DYuser.findByIdAndUpdate(req.user.id, {
                $pull: { likedVids : req.params.id }
            }, { new: true });
        }


        // Return the updated user document as JSON response
        return res.status(200).json(currUser);
    } catch (err) {
        // Log the error and return a 500 status with the error as JSON response
        return res.status(500).json({ error: err.message });
    }
}

export const deleteVid = async(req,res)=>{
    try{
        const vidId = req.params.id;

        await DYvideo.findByIdAndDelete(vidId);
        return res.status(200).json({msg : "success in delete"});
    }
    catch(err){
        return res.status(500).json("error in deleting video");
    }
}
