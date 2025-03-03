import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true}, 
});

/*userSchema.pre('save', async function(next)  { 
    if (this.isModified('password') || this.isNew) { 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    }
    next(); 
});
*/

/*
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
*/
const userModel = mongoose.model('User', userSchema);

export default userModel;