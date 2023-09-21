import mysql from "mysql2";
import dotenv from "dotenv"
dotenv.config()

//todo config the options to the pool with connection number

let dbOptions = {}
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PORT && process.env.DB_PASSWORD && process.env.DB_DATABASE){
        dbOptions = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port:process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        };	
    }
export {dbOptions}
if (!process.env.DATABASE_URL){
    throw new Error("missing db env variable")
}
const pool = mysql.createPool(process.env.DATABASE_URL).promise()
export default pool as any