import userModel from "../models/userModel.js";
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


const getBio = (req,res) => { 

}




export default { test, registerUser, loginUser, getProfile, logoutUser }