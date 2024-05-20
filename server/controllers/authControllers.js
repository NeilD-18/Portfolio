import userModel from "../models/userModel.js";

const test = (req, res) => { 
    res.json("test works");
   
}

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
        
        const exists = await userModel.findOne({username}); 
        if (exists) {
            return res.json({
                error: 'Username is Taken Already' 
            })
        }

        const user = await userModel.create({
            username, password
        })

        return res.json(user)
        //check username against database
    } catch (error) {
        console.log(error)
    }
}

export default { test, registerUser }