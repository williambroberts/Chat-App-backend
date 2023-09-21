
import createApp from "./app"
const PORT = 5000


process.on('uncaughtException',(err)=>{
    console.error(err)
    console.log("uncaughtException, shutting down")
    server.close(() => {
        console.log('Express server closed due to uncaughtException');
        process.exit(1); // Exit the Node.js process with a non-zero code (indicating an error)
      });
})

const app:any = createApp()
// const server = http.createServer(app)
// server.listen(PORT,()=>{
//     console.log(`server is running on port ${PORT}`)
// })
const server = app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
import { Server } from "socket.io"
const io = new Server(server,{
    cors: {
      origin: ["http://localhost:3000"]
    }
  });


io.on('connection',async (socket)=>{
    console.log("connected",socket.id)
    socket.on('join__room',(room,cb)=>{
        socket.join(room)//join this user with this socket to this room
        //todo better message
        //tood better callback
        cb(`${socket.id} joined ${room}`)
        console.log(room)
        socket.to(room).emit('joined',`user joined room ${socket.id}`)
})


    socket.on('file',(data,room,cb)=>{
        console.log(data,"🕊️",room,"🕊️","file");
        let now = new Date()
        //todo better cb
       cb(`server recieved file at ${now}`)
        if (room!==""){
            socket.to(room).emit("reply",data)
            
        }
    })
    socket.on('message', (data,room,cb) => {
        console.log(data,"🕊️",room,"🕊️","message");
        let now = new Date()
        //todo better cb
        cb(`server recieved message at ${now}👍🏻`)
        if (room===""){
            socket.broadcast.emit("reply",data)
        }else {
            socket.to(room).emit("reply",data)//broadcast to users in the room 
        }
      });   


    socket.on('leaveRoom',(data)=>{
        console.log(socket.rooms)
        if (data?.room){
            //todo upgrate this 
            socket.leave(data.room)
            console.log(`user ${socket.id} left room ${data.room}`)
            socket.to(data?.room).emit("leftRoom",`user ${socket.id} left room ${data.room}`)//excludes sender socket.to
            socket.emit("leftRoom",`you left ${data?.room}`)
        }else{
            
        }
    })



    socket.on("disconnect",async (reason) => {
        // ...
        //todo for each room tell others they left 
        //todo for yourself say you left this room etc
        
        console.log("disconnected",socket.id)
      });
})



process.on('unhandledRejection',(err)=>{
    console.error(err)
    console.log("unhandledRejection, shutting down")
    server.close(() => {
        console.log('Express server closed due to unhandled promise rejection');
        process.exit(1); // Exit the Node.js process with a non-zero code (indicating an error)
      });
})

