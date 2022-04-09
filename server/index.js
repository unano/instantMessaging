const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const publicMessageRoute = require("./routes/publicMessagesRoute");
const channelRoute = require("./routes/channelRoute");
const { Server} = require("socket.io");
const app = express();
const path = require('path');
require("dotenv").config(); 

app.use(cors());
app.use(express.json());


const __dirname1 = path.resolve();



app.use("/api/auth", userRoutes);
app.use("/api/channel", channelRoute);
app.use("/api/messages", messageRoute);
app.use("/api/publicMessages", publicMessageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/public/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "public", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

mongoose.connect(process.env.MONGO_URL,{
         useNewUrlParser: true,
         useUnifiedtopology: true,
    }).then(() =>{
        console.log("DB connection secceeed");
    })
    .catch((err) =>{
        console.log(err.message);
    });
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
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
        if(sendUserSocket){
            io.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })

    socket.on("join-room", (data) =>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })
    
    socket.on("send-global", (data)=>{
            socket.to(data.room).emit("msg-recieve2", data);
    })
});
