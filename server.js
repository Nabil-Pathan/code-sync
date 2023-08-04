const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const ACTIONS = require('./frontend/src/Actions')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const server = http.createServer(app)
const io = new Server(server)



// <--------------------- Deployment ------------------------> //

const __dirname1 = path.resolve()

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,"/frontend/build")))

  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
  })
}

const userSocketMap = {}

function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}




io.on('connection', (socket) => {
    if (!userSocketMap[socket.id]) {
        console.log('Socket connected', socket.id);

        socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
            userSocketMap[socket.id] = username;
            socket.join(roomId);
            const clients = getAllConnectedClients(roomId);
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit(ACTIONS.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                });
            });
        });

        socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
            socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
        })

        socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
            io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
        })

        socket.on('disconnecting', () => {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            });
            delete userSocketMap[socket.id];
            socket.leave();
        });
    }
});

const PORT = process.env.PORT 
server.listen(PORT , ()=>{
    console.log(`Listening on Port ${PORT}`);
})

