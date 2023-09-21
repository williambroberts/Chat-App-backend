import { Response } from "express"
import ash from "express-async-handler"
import { BadRequestError, ConflictError, InternalServerError, UnauthorizedError } from "../utils/Errors"
import pool, { tables } from "../db/config"

import crypto from "crypto"
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/Emails/email"
import { hashPassword } from "../utils/Bycrypt/hashPassword"
import { comparePassword } from "../utils/Bycrypt/ComparePasswords"
import db from "../db/db"
//email,verfiyToken,used,createdAt,expriredAt
export const VerifyEmailController = ash(async(req:any,res:Response)=>{
    //link
    const {email,token:verificationToken}=req.matchedData
    if (!email){
        throw new BadRequestError("Email required")
    }
    if(!verificationToken){
        throw new BadRequestError("Verification token required")
    }
    //todo check token format
    if (verificationToken.length!==36){
        throw new BadRequestError("Invalid token")
    }
    const [row] = await db.emailExists({table:tables.users,email:email})
    console.log({row})
    if (!row){
        throw new BadRequestError("Invalid email")
    }
    const match = comparePassword({raw:verificationToken,hash:row.verificationHash})
    if (match){
        //verfiy email
        const row = await db.verifyEmail({table:tables.users,email:email})
        console.log(row,"here will🕊️")
        if (row){
            res.status(200)
            res.json({
                success:true,
                row:row,
                email:email
            })
        }else {
            throw new InternalServerError("Failed to verify email")
        }
    }else {
        //todo hide the response if bad
        // res.status(200)
        // res.json({
        //     success:true,
        //     token:verificationToken,
        //     email:email
        // })
        throw new BadRequestError("Invalid token")
    }
    
    //todo check token vs database if email and unverified and token
})

export const failController = ash(async(req:any,res:Response)=>{
    throw new UnauthorizedError("Failed to authenticate")
})
//todo this controller make a new email verification token and hash it and save it to database
export const generateVerificationTokenController = ash(async(req:any,res:Response)=>{
    const {email}=req.matchedData
    if (!email){
        throw new BadRequestError("Email required")
    }
    const result = await db.emailExists({table:tables.users,email:email})
    console.log({result})
    if (result.length===0){
        //no email in db but dont tell the request that
        res.status(200)
        res.json({success:true,
        
        })
        return
    }
    //todo if verified already
    const [user]=result
    if (user.verified===1){

        throw new BadRequestError("Email is already verified")
    }
    const verificationToken = crypto.randomUUID()
    const hash = hashPassword(verificationToken)
    const row = await db.updateEmailVerificationToken({table:tables.users,email:email,hash:hash})
    await sendVerificationEmail({toEmail:email,verifcationToken:verificationToken})

    res.json({
        row,success:true
    })

    //generate a token for an email, and save to db and send email if not yet confirmed
})
export const registerController = ash(async(req:any,res:Response)=>{
    const {email,password,username}=req.matchedData
    if (!email){
        throw new BadRequestError("Email required")
    }
    if(!password){
        throw new BadRequestError("Password required")
    }
    if (!username){
        throw new BadRequestError("Username required")
    }
    //query db for email
    
    // const [result] = await pool.query(`
    // SELECT DISTINCT * FROM ${table}
    // WHERE email = ?
    // LIMIT 1;
    // `,[email])
    const result = await db.emailExists({email:email,table:tables.users})
    if (result.length!==0){
        throw new ConflictError("Email in use already")
    }
    const hash = hashPassword(password)
    //save to db
    if (hash){
        // const [row] =await pool.query(`
        // insert into store_users (email,password)
        // values (?, ?)
        // `,[email,hash])
        
        const row = await db.register({table:tables.users,email:email,hash:hash,username:username})
        console.log({row})
        if (row){
            //todo generate and send verification email
            const verificationToken = crypto.randomUUID()
            const hash = hashPassword(verificationToken)
            const row = await db.updateEmailVerificationToken({table:tables.users,email:email,hash:hash})
            await sendVerificationEmail({toEmail:email,verifcationToken:verificationToken})
            res.status(201)
            res.json({success:true,row:row})
        }else {
            throw new InternalServerError("Failed to create user in DB")
        }
    }else {
        throw new InternalServerError("Failed to hash password")
    }
    
})

export const loginController = ash(async(req:any,res:Response)=>{


    res.status(200)
    res.json({
        success:true
    })
})

export const logoutController = ash(async(req:any,res:Response)=>{
    const prev = req.isAuthenticated()
    let user = req.user
    let now = new Date(Date.now())
    user[0].last_logout=now
    const email = user[0].email
    req.logout(async(err:Error)=>{
        if (err){
            console.error(err)
            throw new InternalServerError("logout failed")
            
            
        }
        //update user table last_logout
        const row = await db.logout({email:email,table:tables.users})
        res.status(200)
        
        //db.logout({table:tables.users,email:email})
        res.json({success:true,curr:req.isAuthenticated(),prev:prev,row:row})
        // 1.clear session cookie, 2.destroy session delete 3.session from db
    })
})


export const statusController = ash(async(req:any,res:Response)=>{
    console.log(req?.user,req.session.passport,"here will💛")
    res.status(200)
    res.json({
        success:true,isAuth:req.isAuthenticated()
    })
})
export const forgotPasswordController = ash(async(req:any,res:Response)=>{
    
    const {email}=req.matchedData
    if (!email){
        throw new BadRequestError("Email required")
    }
    // invalidate all previous tokens for this email address
    // const [result]= await pool.query(`
    // update resetPasswordTokens
    // set used = 1
    // where email = ?
    // `,[email])
    const result = await db.invalidateAllResetTokens({table:tables.resetPasswordTokens})
    //see if there is a valid user here
    const [row]=await pool.query(`
    select distinct * from store_users
    where email = ?
    `,[email])
    console.log(row)
    if (row.length===0){
        //no email in db
        res.status(200)
        res.json({
            success:true
        })
    }else {
        //genereate reset token
        const resetToken = crypto.randomUUID()
        const hash = hashPassword(resetToken)
        //save hash to database as the token and make row entry
        const createdAt = new Date(Date.now())
        const expireesAt = new Date(Date.now()+ 60*5*1000) //5mins
        const [insertResult]= await pool.query(`
        insert into resetPasswordTokens (hash,email,createdAt,expiresAt)
        values (?,?,?,?)
        `,[hash,email,createdAt,expireesAt])
        // send email with resetToken in link
        
        await sendPasswordResetEmail(email,resetToken)
        const origin = req.get('origin')
        console.log(insertResult,origin,req.origin,req.originalUrl)
        res.status(200)
        res.json({
            resetToken:resetToken,email:email,origin:origin
        })
    }
    
})

export const resetPasswordController =ash(async(req:any,res:Response)=>{
    
    const {newPassword,token:resetToken,email}=req.matchedData
    if(!resetToken){
        throw new BadRequestError("Reset Token required")
    }
    if (!newPassword){
        throw new BadRequestError("New password required")
    }
    if (!email){
        throw new BadRequestError("Email required")
    }
    const now = new Date(Date.now())
    //db has row with token and email and time before expired and unused token
    const [result]=await pool.query(`
    select distinct * from resetPasswordTokens
    where email = ?
    and used = 0
    and expiresAt > ?
    `,[email,now])
    if (result.length===0){
        // no db entry , either invalid email or resetToken or its too late or token is set to used already
        throw new BadRequestError("Invalid request")
    }
    const [row]=result
    const {hash} =row 
   
    const tokens = {raw:resetToken,hash:hash}
    const match = comparePassword(tokens)
    if (match){
        //todo update user password in db hash and save and return success & set used to true
        const newHash = hashPassword(newPassword)

        const [updatePwResult]=await pool.query(`
        update store_users
        set password = ?
        where email = ?
        `,[newHash,email])
        const [row]= await pool.query(`
        update resetPasswordTokens
        set used = 1
        where hash = ?
        `,[hash])
        console.log(updatePwResult,row)
        if (true){
            //todo change here, redirect to login
            res.status(200)
            res.json({
                success:true    

            })
        }
    }else {
        // invalid token
        throw new BadRequestError("Invalid request") 
    }

    
})

export const updateProfileController = ash(async(req:any,res:Response)=>{
    const {username,about} = req.matchedData
    // if username && description 
    console.log(req.originalUrl)
    if (username && about){
        
    }
    res.json({username})
})
export const deleteAccountController = ash(async(req:any,res:Response)=>{
    const {password,email} = req.matchedData
    if (!email){
        throw new BadRequestError("Invalid email")
    }
    if (!password){
        throw new BadRequestError("Password required")
    }
})

export const changePasswordController = ash(async(req:any,res:Response)=>{
    const {email,password,newPassword}=req.matchedData
    
    res.status(200)
    res.json({success:true})
})