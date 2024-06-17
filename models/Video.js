import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    imgUrl: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: true
    },
    views : {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    likes:{
        type: Number,
        default: 0
    },
    dislikes:{
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('DYvideo', VideoSchema);