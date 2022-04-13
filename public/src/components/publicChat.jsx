import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ChatInput from "./ChatInput";
import { sendPublicMessageRoute, getAllPublicMessageRoute } from "../utils/APIRoutes";
// import {io} from "socket.io-client";

export default function ChatContainer({ currentChannel, currentUser, socket}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  // useEffect(() => {
  //   if (currentChannel) {
  //     socket.current = io(host);
  //     socket.current.emit("join-room", currentChannel._id);
  //   }
  // }, [currentChannel, socket]);


  useEffect(() =>{
    async function updateMsg() {
      if(currentChannel){ 
        const response = await axios.post(getAllPublicMessageRoute,{
            from: currentUser._id,
            room: currentChannel.channel
    });
    setMessages(response.data);
      }
    }
    updateMsg();
},[currentChannel]);

  const handleSendMsg = async (msg) => {
      await axios.post(sendPublicMessageRoute,{
          name:currentUser.username,
          from:currentUser._id,
          room: currentChannel.channel,
          message:msg
      });
      socket.current.emit("send-global", {
        room: currentChannel._id,
        from: currentUser._id,
        message: msg,
        name:currentUser.username
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg, name:currentUser.username});
      setMessages(msgs);
  };


  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve2", (msg) => {
        console.log(msg)
        setArrivalMessage({ fromSelf: false, message: msg.message, name:msg.name, time:msg.time});
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    currentChannel && (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
          </div>
          <div className="username">
            <h3>Public Channel {currentChannel.channel}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()} className="contain">
              <div className={`message ${message.fromSelf ? "sended3" : "recieved3"}`}>
                <div>{message.name}</div>
                </div>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}
              >
                <div className="content">
                  <div>{message.message}</div>
                </div>
                {/* <div>{message.time}</div> */}
                </div>
                {message.time? 
                <div className={`message ${message.fromSelf ? "sended2" : "recieved2"}`}
              >
                {/* message.time.split("-")[1]+"."+message.time.split("-")[2].slice(0,2)+" "+ */}
               <div className="time">{ message.time.split(":")[0].slice(-2) +":"+message.time.split(":")[1]}</div>
              </div>:<></>}
              </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
      )
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: white;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 2rem;
    padding-right:1rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contain{
      margin-bottom:14px;
    .message {
      display: flex;
      align-items: center;
      width:100%;
      height:100%;
        .content {
          max-width: 100%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 1rem;
          color: black;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }
        .time{
          font-size:15px;
          display:table-row-group;
        }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #5ba5ff;
        color:white;
        border-radius: 1rem 0rem 1rem 1rem;
        display:table-row-group;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        border-radius: 1rem 1rem 1rem 0rem;
        background-color: #9900ff20;
      }
    }

    .sended2 {
      justify-content: flex-end;
      height:12px;
      margin-top:-5px;
      padding-right:10px;
      .content {
        background-color: #5ba5ff;
        color:white;
        display:table-row-group;
      }
    }
    .recieved2 {
      justify-content: flex-start;
      height:12px;
      margin-top:-5px;
      padding-left:10px;
      .content {
        background-color: #9900ff20;
      }
    }

    .sended3 {
      justify-content: flex-end;
      height:20px;
      margin-bottom:-10px;
      padding-right:-10px;
      color:black;
      .content {
        background-color: #5ba5ff;
        color:white;
        display:table-row-group;
      }
    }
    .recieved3 {
      justify-content: flex-start;
      height:20px;
      margin-bottom:-10px;
      padding-left:-10px;
      color:black;
      .content {
        background-color: #9900ff20;
      }
    }
  }
  }
`;