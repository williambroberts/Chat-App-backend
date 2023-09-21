import pool from "./config";

type dbType = {
    login?:Function;
}

const db:dbType = {}


db.login =async ()=>{
    return new Promise(async(resolve,reject)=>{
        const [row] = await pool.query(`
        
        `)
    })
}