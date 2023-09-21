import bcrypt from "bcryptjs"
import { passwordTypes } from "../../types"

const comparePassword = (passwords:passwordTypes)=>{
    return bcrypt.compareSync(passwords.raw,passwords.hash)
}

export {comparePassword}