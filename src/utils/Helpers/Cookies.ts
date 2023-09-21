import { Response } from "express";
import { InternalServerError } from "../Errors";


export const generateAuthCookie = (res:Response,sessionToken:any)=>{
    if (!sessionToken){
        throw new InternalServerError("Missing session id")
    }
    const now = new Date().getTime()
    let extra = now + (60*60*1000)
    const expiresAt = new Date(extra) //1 hour
    console.log(expiresAt,now)
    let authCookie = ""
    if (process.env.AUTH_COOKIE){
        authCookie = process.env.AUTH_COOKIE
        res.cookie(authCookie,sessionToken,{
            sameSite:"none",//"none" for production,
            secure:true,
            httpOnly:true,
            
        })
    }else {
        throw new InternalServerError("Cannot access auth cookie name")
    }
   

}