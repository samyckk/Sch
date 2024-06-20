import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img:{
        type: String
    },
    subscribers:{
        type: Number,
        default: 0
    },
    subscribedUsers:{
        type: [String],
    },
    likedVids:{
        type: [String],
    },
    dislikedVids:{
        type: [String],
    },
    role:{
        type: String,
        default: "student"
    },
    admin:{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

export default mongoose.model('DYuser', UserSchema);
