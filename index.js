import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/users.js';
import videoRoute from './routes/videos.js';
import commentRoute from './routes/comments.js';
import authRoute from './routes/authentication.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: 'https://scholary-tube.vercel.app/', // Use the client origin from environment variables
    credentials: true // Allow credentials (cookies) to be sent
}));

dotenv.config();

const connection = async () =>{
    const URL = `mongodb+srv://samyck:1234@blog-app.ywqvnes.mongodb.net/?retryWrites=true&w=majority&appName=blog-app`
    try {
        console.log("trying to connect to mongoose");
        await mongoose.connect(URL);
        console.log("Connect Succcessfully to Database");
    } catch (error) {
        console.log("Error connecting to database", error);
    }

}

app.use(cookieParser());

app.use(express.json());

app.set('trust proxy', 1);

app.use('/api/users', userRoute);
app.use('/api/videos', videoRoute);
app.use('/api/comments', commentRoute);
app.use('/api/auth', authRoute);

app.get('/hey', (req, res) => {
    res.send("Hello world");
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log("connected to server!");
});

connection();
