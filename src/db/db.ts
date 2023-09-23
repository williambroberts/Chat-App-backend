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
    insertNewResetToken:Function
    getPasswordResetTokenFromDb:Function;
    updateUserPassword:Function;
    invalidateUsedPwResetToken:Function;
}
const db:dbType = {
    emailExists:async ({email,table}:loginType)=>{

        const [result] = await pool.query(
            `select * 
            from ${table}
            WHERE email = ?
            limit 1
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
    login:async ({table,email}:{table:string,email:string})=>{//update the last_login to now 
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
    },
    insertNewResetToken:async({hash,email,createdAt,expiresAt,table}:{table:string,hash:string,email:string;createdAt:any,expiresAt:any})=>{
        const [insertResult]= await pool.query(`
        insert into ${table} (hash,email,createdAt,expiresAt)
        values (?,?,?,?)
        `,[hash,email,createdAt,expiresAt])
        return insertResult
    },
    getPasswordResetTokenFromDb:async({email,now,table}:{email:string,now:any,table:string})=>{
        const [result]=await pool.query(`
    select distinct * from ${table}
    where email = ?
    and used = 0
    and expiresAt > ?
    `,[email,now])
    return result
    },
    updateUserPassword:async({table,hash,email}:{table:string,email:string,hash:string})=>{
        const [updatePwResult]=await pool.query(`
        update ${table}
        set password = ?
        where email = ?
        `,[hash,email])
        return updatePwResult
    },
    invalidateUsedPwResetToken:async({table,hash}:{table:string,hash:string})=>{
        const [result]=await pool.query(`
        update ${table}
        set used = 1
        where hash = ?
        `,[hash])
        return result
    }
    
}




// db.register = async ({email,password}:{email:string,password:string})=>{

// }
export default db