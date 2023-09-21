import mysql from "mysql2";
import dotenv from "dotenv"
dotenv.config()

//todo config the options to the pool with connection number
export const dbOptions:any = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
    port:process.env.DB_PORT,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
};
if (!process.env.DATABASE_URL){
    throw new Error("missing db env variable")
}
const pool = mysql.createPool(process.env.DATABASE_URL).promise()
export default pool as any
const tables = {
	users:"chat_users",
	messages:"chat_messages",
	chats:"chats",
	resetPasswordTokens:"chat_resetPasswordTokens"
}
export  {tables}