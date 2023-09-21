// function uncaughtExceptionProcess(){
//     process.on('uncaughtException',(err)=>{
//         console.warn('uncaughtException',err)
//         app.close()
//         setTimeout(()=>{
//             process.exit(1)
//         },1000)
        
//     })
// } 
// function unhandledRejectionProcess(){
//     process.on('uncaughtRejection',(err)=>{
//         console.warn('uncaughtRejection',err)
//         app.close()
//         sestTimeout(()=>{
//             process.exit(1)
//         },1000)
//     })
// }
// module.exports = {uncaughtExceptionProcess,unhandledRejectionProcess}