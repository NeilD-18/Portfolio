import express from 'express';
import mongoose from 'mongoose';
import router from './routes/authRoutes.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use('/api/users', router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');  // You can replace this message with any response you want
});

