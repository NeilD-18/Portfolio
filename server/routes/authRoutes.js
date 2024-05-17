import express from "express"; 


const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      res.json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
export default router;

