import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 8081;

// MongoDB URI and Client setup
const uri = "mongodb+srv://ndaterao2:Kajoba_11@portfoliocluster.mrz0xk8.mongodb.net/?retryWrites=true&w=majority&appName=PortfolioCluster"; // Replace with your actual MongoDB URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    return client.db('your_db_name'); // Replace 'your_db_name' with your actual database name
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Stop the Node.js process if unable to connect
  }
}

const database = connectToMongoDB();

// Define routes here
app.get('/', async (req, res) => {
  try {
    const db = await database;
    const ping = await db.command({ ping: 1 });
    res.status(200).json({ message: "Connected to MongoDB", ping });
  } catch (error) {
    res.status(500).json({ message: "Failed to connect to MongoDB", error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
