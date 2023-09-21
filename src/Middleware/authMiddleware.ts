import { NextFunction, Request, Response } from "express"
import { ForbiddenError, InternalServerError, UnauthorizedError } from "../utils/Errors"
import ash from "express-async-handler"
import pool from "../db/config"

// validate session-id db-id cookie-id (session has final say > db > cookie)
export const enableAuthenticate = ash(async(req:any,res:Response,next:NextFunction)=>{
  // check cookie and session store
  if (!req.cookies){
    throw new UnauthorizedError("No cookies sent with request")
  }
  let cookies = req.cookies
  
  
  if (process.env.SESSION_NAME){
      let sessionCookie = process.env.SESSION_NAME
     sessionCookie = cookies[sessionCookie]
     if (!sessionCookie){
      // todo change to ok response to hide mechanism of protect route
      throw new UnauthorizedError("No session cookie")
     }
     //get sessionid from cookie 
     
     let idFromCookie = sessionCookie.split(":")[1].split(".")[0]
     //let idFromCookie = authCookie
     console.log(idFromCookie,cookies)
     const [result]=await pool.query(`
     select distinct * from sessions
     where session_id = ?
     `,[idFromCookie])
     
     if (result.length===0){
      throw new UnauthorizedError("Invalid cookie")
     }
     let row = result[0]
     
     //console.log(row)
     if (row?.session_id===idFromCookie){
      console.log(row.session_id,req.sessionID,"🕊️",idFromCookie)
      if (row?.session_id===req.sessionID){
        return next()
      }else {
        // MYSQL id !== cookie !== session
        // cookie is using old session that was deleted from db and isnt current session id
        throw new UnauthorizedError("Invalid cookie .")
      }
      
     }else {
      throw new UnauthorizedError("Invalid cookie _")
     }
     

  }
  throw new InternalServerError("Session name error")
  


})


export const passportIsAuth = ash(async(req:any,res:Response,next:NextFunction)=>{
    if (req.isAuthenticated()){
      return next()
    }
    throw new UnauthorizedError("Unauthorized access")
})