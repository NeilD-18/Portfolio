import userModel from "../models/userModel.js";
import About from "../models/aboutModel.js";
import utils from "../utils/encrypt.js"
import jwt from "jsonwebtoken"; 

const test = (req, res) => { 
    res.json("test works");
   
}

//Login Endpoint
const loginUser = async (req, res) => { 
    try { 
        const { username, password } = req.body;

        //if user exists
        const user = await userModel.findOne({username});
        if (!user) { 
            return res.json({
                error: "Username not found"
            })
        }
        
        //Check if passwords match
        const passwordsMatch = await utils.comparePassword(password, user.password);
        if (passwordsMatch) { 
           
            jwt.sign({username: user.username, id: user._id}, process.env.JWT_SECRET, {}, (err,token) => { 
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        else { 
            return res.json({
                error: "Incorrect Password"
            })
        }

    } catch (error) { 
        console.log(error)
    }

}





//Register Endpoint
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body; 

        //Check if username is entered
        if (!username) { 
            return res.json({
                error: 'Username is Required'
            })
        }
        
        //Check password
        if (!password || password.length < 6) { 
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        //check username against database
        const exists = await userModel.findOne({username}); 
        if (exists) {
            return res.json({
                error: 'Username is Taken Already' 
            })
        }

        const hashedPassword = await utils.hashPassword(password); 

        const user = await userModel.create({
            username, password: hashedPassword, 
        })

        return res.json(user)
        
    } catch (error) {
        console.log(error)
    }
}

//logout user endpoint
const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).json({ message: 'Logged out successfully' });
};

//Get Profile Endpoint
const getProfile = (req,res) => { 
    const {token} = req.cookies
    if (token) { 
        jwt.verify(token, process.env.JWT_SECRET, {}, (err,user) => { 
            if (err) throw err;
            res.json(user)
        })
    } 
    else { 
        res.json(null)
    }
}


// Controller to get the bio
const getBio = async (req, res) => {
    try {
        const bio = await About.findOne();
        if (!bio) {
            return res.status(404).json({ message: 'Bio not found' });
        }
        res.status(200).json(bio);
    } catch (error) {
        console.error('Error fetching bio:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update the bio
const updateBio = async (req, res) => {
    const { about } = req.body;

    if (!about) {
        return res.status(400).json({ message: 'About field is required' });
    }

    try {
        let bio = await About.findOne();

        if (bio) {
            bio.about = about;
            bio = await bio.save();
        } else {
            bio = new About({ about });
            bio = await bio.save();
        }

        res.status(200).json(bio);
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addExperience = (req, res) => { 

}

const deleteExperience = (req, res) => { 

}

const editExperience = (req, res) => { 
    
}

export default { test, registerUser, loginUser, getProfile, logoutUser, getBio, updateBio }