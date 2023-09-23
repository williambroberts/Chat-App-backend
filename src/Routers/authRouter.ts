import express from "express"
import passport from "passport"
import * as local from "passport-local"
import pool, { tables } from "../db/config";

import { changePasswordVs, emailVs, forgotPasswordVS, generateVs, loginVS, registerVS, resetPasswordVS, updateProfileVs, valitatorVS, verifyEmailVS } from "../utils/Validators";
import { passportIsAuth } from "../Middleware/authMiddleware";
import { VerifyEmailController, changePasswordController, deleteAccountController, failController, forgotPasswordController, generateVerificationTokenController, loginController, logoutController, registerController, resetPasswordController, statusController, updateProfileController } from "../Controllers/authController";
import db from "../db/db";
import { comparePassword } from "../utils/Bycrypt/ComparePasswords";
import { InternalServerError } from "../utils/Errors";
const LocalStrategy = local.Strategy
passport.serializeUser(function(user:any, done) {
    console.log("serializing user",user)
    done(null, user.email);
    
  });
  
  passport.deserializeUser(async function(id, done) {
    console.log(id,"desierialze")
    //this runs on each request if a user is authenticated
    try {
      // const [user] = await pool.query(`
      // select * from users
      // WHERE email = ?
      // `,[id]);
      const user = await db.emailExists({email:id,table:tables.users})
      console.log(user,id,"deserializing user")
      done(null, user);
    } catch(err) {
      done(err);
    };
  });
  
  passport.use(
    new LocalStrategy({usernameField: 'email'},localVerifyFunctionasync)
    );
  
  
  async function localVerifyFunctionasync(email:string, password:string, done:any) {
    //console.log(email,password,"❤️")
    //sanitize and validate first
    try {
        // const [row] = await pool.query(
        //   `select * 
        //   from store_users
        //   WHERE email = ? 
        //   `
        //   ,[email])
        //   const user = row[0]
        const result = await db.emailExists({email:email,table:tables.users})
        //console.log(user)
        let user = result[0]
        if (!user) {
        return done(null, false, { message: "Incorrect email" });
        };
        const passwords ={raw:password,hash:user.password}
       const match =  comparePassword(passwords)
      
        if (password && !match ){
        return done(null, false, { message: "Incorrect password" });
        };
        //todo add an additional cookie here
       const row = await db.login({email:email,table:tables.users})
       if (!row){
        throw new InternalServerError("Failed to update last_login")
       }
        console.log(typeof(row),row,Object.keys(row),"row🕊️")
       //set last_login to now to save a db call
        let now = new Date(Date.now())
        user.last_login = now
        return done(null, user);
    } catch(err) {
        return done(err);
    };
    }



const authRouter = express.Router()

authRouter.get("/fail",failController)
authRouter.post("/register",registerVS,valitatorVS,registerController)
//protected post /auth/logout
authRouter.post("/logout",passportIsAuth,logoutController)
authRouter.get("/status",statusController)
authRouter.post("/login",loginVS,valitatorVS,
passport.authenticate('local', 
{ failureRedirect: '/auth/fail',
 failureMessage: true }),
 loginController)


authRouter.post("/forgot",forgotPasswordVS,valitatorVS,forgotPasswordController)
authRouter.post("/reset",resetPasswordVS,valitatorVS,resetPasswordController)

//protected /auth/confirm verify email
authRouter.post("/verify",passportIsAuth,verifyEmailVS,valitatorVS,VerifyEmailController)
//protected generate email verification token
authRouter.post("/generate",passportIsAuth,generateVs,valitatorVS,generateVerificationTokenController)
//protected /auth/delete post
authRouter.post("/delete",passportIsAuth,loginVS,deleteAccountController)

authRouter.put("/changePassword",passportIsAuth,changePasswordVs,valitatorVS,changePasswordController)

authRouter.put("/update",passportIsAuth,updateProfileVs,valitatorVS,updateProfileController)
export default authRouter