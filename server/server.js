import express from 'express';
import mongoose from 'mongoose';
import router from './routes/authRoutes.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import multer from 'multer';



dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Could not connect to MongoDB', err));



//middleware
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({extended: true })); 

app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



