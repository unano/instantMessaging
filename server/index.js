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
        console.log("DB connection succeeed");
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
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket)=>{
    console.log("a user connected");
    //detect the user is online
    socket.on("add-user",(userId)=>{
        // onlineUsers.set(userId, socket.id);
        // console.log(`detect`);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      console.log(senderId)
      if (user){
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
    });

    // socket.on("send-msg", (data) =>{
    //     const sendUserSocket = onlineUsers.get(data.to);
    //     if(sendUserSocket){
    //       console.log(sendUserSocket);
    //         io.to(sendUserSocket).emit("msg-recieve", data.message);
    //         console.log(`User with ID: ${socket.id} say: ${data.message}`);
    //         console.log(data.to);
    //         console.log(data.from);
    //     }
    // })

    socket.on("join-room", (data) =>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        console.log(socket.rooms); 
    })
    
    socket.on("send-global", (data)=>{
            socket.to(data.room).emit("msg-recieve2", data);
            console.log(`global`);
    })

    // socket.on("timeOut", (data) => {
    //     socket.disconnect(true);
    //     console.log('%s because timeout', data)
    //   })
    
    //   socket.on("disconnecting", (reason) => {
    //     for (const room of socket.rooms) {
    //       if (room !== socket.id) {
    //         socket.to(room).emit("user has left", socket.id, room);
    //         console.log(`user ID %f has left the room %d`,socket.id, socket.room) ;
    //       }
    //     }
    //   })
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
});
/*
io.use((socket, next) => {
    setTimeout(() => {
      // next is called after the client disconnection
      next();
    }, 1000);
  
    socket.on("disconnect", () => {
      // not triggered
    });
  });
  
  io.on("connection", (socket) => {
    // not triggered
  });*/
