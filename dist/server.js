"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = 5000;
process.on('uncaughtException', (err) => {
    console.error(err);
    console.log("uncaughtException, shutting down");
    server.close(() => {
        console.log('Express server closed due to uncaughtException');
        process.exit(1); // Exit the Node.js process with a non-zero code (indicating an error)
    });
});
const app = (0, app_1.default)();
// const server = http.createServer(app)
// server.listen(PORT,()=>{
//     console.log(`server is running on port ${PORT}`)
// })
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://chat-app-frontend-olive.vercel.app"]
    }
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connected", socket.id);
    socket.on('join__room', (room, cb) => {
        socket.join(room); //join this user with this socket to this room
        //todo better message
        //tood better callback
        cb(`${socket.id} joined ${room}`);
        console.log(room);
        socket.to(room).emit('joined', `user joined room ${socket.id}`);
    });
    socket.on('file', (data, room, cb) => {
        console.log(data, "🕊️", room, "🕊️", "file");
        let now = new Date();
        //todo better cb
        cb(`server recieved file at ${now}`);
        if (room !== "") {
            socket.to(room).emit("reply", data);
        }
    });
    socket.on('message', (data, room, cb) => {
        console.log(data, "🕊️", room, "🕊️", "message");
        let now = new Date();
        //todo better cb
        cb(`server recieved message at ${now}👍🏻`);
        if (room === "") {
            socket.broadcast.emit("reply", data);
        }
        else {
            socket.to(room).emit("reply", data); //broadcast to users in the room 
        }
    });
    socket.on('leaveRoom', (data) => {
        console.log(socket.rooms);
        if (data === null || data === void 0 ? void 0 : data.room) {
            //todo upgrate this 
            socket.leave(data.room);
            console.log(`user ${socket.id} left room ${data.room}`);
            socket.to(data === null || data === void 0 ? void 0 : data.room).emit("leftRoom", `user ${socket.id} left room ${data.room}`); //excludes sender socket.to
            socket.emit("leftRoom", `you left ${data === null || data === void 0 ? void 0 : data.room}`);
        }
        else {
        }
    });
    socket.on("disconnect", (reason) => __awaiter(void 0, void 0, void 0, function* () {
        // ...
        //todo for each room tell others they left 
        //todo for yourself say you left this room etc
        console.log("disconnected", socket.id);
    }));
}));
process.on('unhandledRejection', (err) => {
    console.error(err);
    console.log("unhandledRejection, shutting down");
    server.close(() => {
        console.log('Express server closed due to unhandled promise rejection');
        process.exit(1); // Exit the Node.js process with a non-zero code (indicating an error)
    });
});
