import bcrypt from "bcrypt"

const hashPassword = (password) => { 
    return new Promise((resolve, reject) => { 
        bcrypt.genSalt(12, (err,salt) => { 
            if (err) { 
                reject(err)
            }
            bcrypt.hash(password, salt, (err,hash) => { 
                if (err) { 
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => { 
    return bcrypt.compare(password, hashed)
}

export default { hashPassword, comparePassword }