import { Response,Request, NextFunction } from "express"
import {body, validationResult, matchedData} from "express-validator" 

const passwordVS = body('password').escape().exists({checkFalsy:true}).withMessage("Password required").isString().withMessage('Password must be string').isLength({min:3})
.withMessage('Password must be at least 3 char long')


const usernameVS = body('username').escape().exists({checkFalsy:true}).withMessage('Username is required').isString().withMessage("Username must be a string")
const emailVs = body('email').escape().exists({checkFalsy:true}).withMessage("Email is required")
.trim().isEmail().withMessage("Provide valid email format").isLength({ min: 3 }).withMessage("Email length must be at least 3 characters")
//register 
const tokenVS = body('token').escape().exists({checkFalsy:true}).withMessage("Token is required").isString().withMessage("Token must be a string").isLength({min:36, max:36}).withMessage("Reset Token must be a valid UUID")
const nameVS = body('name').escape().exists({checkFalsy:true}).withMessage('Name is required').isString().withMessage("Name must be a string")
const suggestionVS = body('suggestion').escape().exists({checkFalsy:true}).withMessage('Suggestion is required').isString().withMessage("Suggestion must be of type string")
const newPasswordVS = body('newPassword').escape().exists({checkFalsy:true}).withMessage("Password required").isString().withMessage('Password must be string').isLength({min:3})
.withMessage('Password must be at least 3 char long')

//checkfalsy, if it is falsy it throws error
const optionalUsernameVs = body('username').optional().exists({checkFalsy:true}).withMessage("Username cannot be Falsy").isString().withMessage('Username must be of type string')
const optionalAboutVs = body('about').optional().exists({checkFalsy:true}).withMessage('About cannot be falsy').isString().withMessage('About must be of type string')


const generateVs = [emailVs]
const changePasswordVs = [passwordVS,newPasswordVS,emailVs]
const updateProfileVs = [optionalUsernameVs,optionalAboutVs]
const verifyEmailVS = [emailVs,tokenVS]
const forgotPasswordVS = [emailVs]
const resetPasswordVS=[newPasswordVS,tokenVS,emailVs]
const subsribeVS = [emailVs]
const registerVS = [passwordVS,emailVs,usernameVS]
const suggestProductVS = [emailVs,nameVS,suggestionVS]
const valitatorVS = (req:any,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()){
        
        req.matchedData = matchedData(req)
        return next()
    }else if (!errors.isEmpty()){
        res.statusCode = 400 //bad request
        res.json({errors:errors.array()})
    }
}



//login
const loginVS = [emailVs,passwordVS]

export {loginVS,
    registerVS,
    valitatorVS,
    suggestProductVS,
    subsribeVS,
    resetPasswordVS,
    forgotPasswordVS,
    verifyEmailVS,emailVs,updateProfileVs,
    changePasswordVs,generateVs
}