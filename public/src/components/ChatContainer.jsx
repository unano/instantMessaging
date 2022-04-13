import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ChatInput from "./ChatInput";
import { sendMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket, setArrivalMsg}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() =>{
    async function updateMsg() {
      if(currentChat){ 
        const response = await axios.post(getAllMessageRoute,{
            from: currentUser._id,
            to:currentChat._id,
    });
    setMessages(response.data);
      }
    }
    updateMsg();
},[currentChat]);

  const handleSendMsg = async (msg) => {
      await axios.post(sendMessageRoute,{
          from:currentUser._id,
          to:currentChat._id,
          message:msg
      });
      socket.current.emit("sendMessage", {
        receiverId: currentChat._id,
        senderId: currentUser._id,
        text: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getMessage", (data) => {
        console.log(currentChat._id);
        if (currentChat) {
          setArrivalMessage({
            fromSelf: false,
            sender: data.senderId,
            message: data.text,
          });
        }
        setArrivalMsg({ message: data.text, room: data.senderId});
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat._id===arrivalMessage.sender &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    currentChat && (
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img src={require(`../images/${currentChat.image}`)} alt="" />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
                  <div className="content">
                    <div>{message.message}</div>
                  </div>
                  {/* <div>{message.time}</div> */}
                </div>
                {message.time ? (
                  <div
                    className={`message ${
                      message.fromSelf ? "sended2" : "recieved2"
                    }`}
                  >
                    {/* message.time.split("-")[1]+"."+message.time.split("-")[2].slice(0,2)+" "+ */}
                    <div className="time">
                      {message.time.split(":")[0].slice(-2) +
                        ":" +
                        message.time.split(":")[1]}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
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
          border-radius:7rem;
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
      height:20px;
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
      height:20px;
      margin-top:-5px;
      padding-left:10px;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;