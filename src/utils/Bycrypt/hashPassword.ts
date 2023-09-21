
import bcrypt from "bcryptjs"

const hashPassword = (raw:string)=>{
    const salt =  bcrypt.genSaltSync(12);
    const hash =  bcrypt.hashSync(raw,salt)
    return hash
}

export {hashPassword}