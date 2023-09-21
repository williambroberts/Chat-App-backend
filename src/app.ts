import express from "express"
import cors from "cors"
import session from "express-session"
import MySQLSessionStore  from "express-mysql-session"
import pool, { dbOptions } from "./db/config"
const SESSION:any=session
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { errorHandler } from "./Middleware/errorMiddleware"
import { Response } from "express"
function createApp(){

const app = express()
const MySQLStore = MySQLSessionStore(SESSION)
const sessionStore = new MySQLStore(dbOptions,pool);

let SESSION_NAME = "382734"
let SESSION_SECRET = "wiejijea"
if (process.env.SESSION_NAME){
    SESSION_NAME=process.env.SESSION_NAME
}
app.use(session({
    name:SESSION_NAME,
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:sessionStore,
    cookie:{
        secure:false,
        sameSite:'none'
    }
}))

app.use(helmet())
app.use(cors({
    origin:['http://localhost:3000','https://chat-app-frontend-olive.vercel.app'],
    credentials:true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
const limiter = rateLimit({
    limit: 3000,
    windowMs: 60 * 60 * 1000, // In one hour
    message: "Too many Requests from this IP, please try again in an hour!",
  });


app.use(limiter)


app.get("/",(req:any,res:Response)=>{
    
    if (req.session.count){
        req.session.count++
    }else {
        req.session.count=1
    }
    res.status(200)
    res.json({
        success:true,
        count:req.session.count,
        id:req.sessionID,
        session:req.session
    })
})








app.all("*",(req,res)=>{
    res.status(404)
    res.json({
        message:"Not found"
    })
})
app.use(errorHandler)  



return app
}

export default createApp