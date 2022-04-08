const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const publicMessageRoute = require("./routes/publicMessagesRoute");
const channelRoute = require("./routes/channelRoute");
const { Server} = require("socket.io");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/channel", channelRoute);
app.use("/api/messages", messageRoute);
app.use("/api/publicMessages", publicMessageRoute);

mongoose.connect(process.env.MONGO_URL,{
         useNewUrlParser: true,
         useUnifiedtopology: true,
    }).then(() =>{
        console.log("DB connection secceeed");
    })
    .catch((err) =>{
        console.log(err.message);
    });

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
});


const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;

    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) =>{
        const sendUserSocket = onlineUsers.get(data.to);

        console.log(data.to)
        console.log(sendUserSocket)
        if(sendUserSocket){
            io.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })

    socket.on("join-room", (data) =>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })
    
    socket.on("send-global", (data)=>{
            socket.to(data.room).emit("recieve-msg", data.message);
            console.log(data)
    })
});
