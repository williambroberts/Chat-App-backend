import pool from "./config"
type loginType = {
    email:string
    table:string
}
type dbType = {
    emailExists:Function
    register:Function
    logout:Function
    login:Function
    invalidateAllResetTokens:Function
    updateEmailVerificationToken:Function,
    verifyEmail:Function;
}
const db:dbType = {
    emailExists:async ({email,table}:loginType)=>{

        const [result] = await pool.query(
            `select * 
            from ${table}
            WHERE email = ?
            `
            ,[email])
        return result
    },
    register:async ({table,email,username,hash}:{table:string,email:string,username:string,hash:string})=>{
        const [row] =await pool.query(`
        insert into ${table} (email,password,username)
        values (?, ?,?)
        `,[email,hash,username])
        return row
    },
    logout:async ({table,email}:{table:string,email:string})=>{
        const now = new Date(Date.now())
        const [row]=await pool.query(`
        update  ${table}
        set last_logout = ?
        where email = ?
        `,[now,email])
        return row
    },
    login:async ({table,email}:{table:string,email:string})=>{
        const now = new Date(Date.now())
        const [row]=await pool.query(`
        update ${table}
        set last_login = ?
        where email = ?
        `,[now,email])
        return row
    },
    invalidateAllResetTokens:async({table,email}:{table:string,email:string})=>{
        const [result]= await pool.query(`
        update ${table}
        set used = 1
        where email = ?
        `,[email])
        return result
    },
    updateEmailVerificationToken:async({table,email,hash}:{table:string,email:string,hash:string})=>{
        const [row]= await pool.query(`
        update ${table}
        set verificationHash = ?
        where email = ?
        `,[hash,email])
        return row
    },
    verifyEmail:async ({table,email}:{email:string,table:string})=>{
        const [row]= await pool.query(`
        update ${table}
        set verified = 1
        where email = ?
        `,[email])
        return row
    }
}




// db.register = async ({email,password}:{email:string,password:string})=>{

// }
export default db