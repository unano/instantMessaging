import React , {useState, useEffect, useRef,useCallback} from "react";
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { allUsersRoute, host , allChannels } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import PublicChat from "../components/publicChat";
import {io} from "socket.io-client";
import Logout from "../components/Logout";

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [channels, setChannels] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentChannel, setCurrentChannel] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chatorChannel, setchatorChannel] = useState(true);
    const [keyLastTime, setKeyLastTime] = useState(new Date());
    const [newMsg, setNewMsg] = useState("");


    const handleUserKeyPress = useCallback(event => {
      setKeyLastTime(new Date());
  }, []);


    // useEffect(() => {
    //   window.addEventListener('keydown', handleUserKeyPress);
    //   return () => {
    //     window.removeEventListener("keydown", handleUserKeyPress);
    // };
    // }, [handleUserKeyPress]);

    useEffect (() => {
      async function fetchData() {
        if (!localStorage.getItem("chat-app-user")) {
          navigate("/login");
        } else {
          setCurrentUser(
            await JSON.parse(
              localStorage.getItem("chat-app-user")
            )
          );
          setIsLoaded(true);
        }
      }
      fetchData();
      }, []);

      useEffect(() => {
        socket.current = io(host);
      }, []);
    

      useEffect(() => {
        if (currentUser) {
          socket.current.emit("add-user", currentUser._id);
          socket.current.on("getUsers", users=>{
            // setOnlineUsers(
            //   contacts.filter((f) => users.some((u) => u.userId === f._id))
            // );
            console.log(users)
          });
        }
      }, [currentUser]);

      useEffect(() => {
        if (currentChannel) {
          socket.current.emit("join-room", currentChannel._id);
        }
      }, [currentChannel]);


//timer
      useEffect(() => {

          //5 minutes
          const diff =1000 * 1000;
            console.log(`${keyLastTime}ms`);
            var delay = Date.now() - keyLastTime;
            console.log(`and the now is ${Date.now()}ms`);
            console.log(delay > diff);
            if(delay > diff)
            {
              alert("Long time no event, Please Re-login!!");
              socket.current.emit("timeOut", currentUser._id);
              localStorage.clear();
              navigate("/login");
            }


      }, [new Date()]);

/*
useEffect(() => {
  const timeout = setTimeout(() => , 6000);

  return () => clearTimeout(timeout);

}, [varA]);*/

      useEffect(() => {
        async function fetchData() {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } 
        }
        }
        fetchData();
      }, [currentUser]);

      useEffect(() => {
        async function fetchData() {
            const data = await axios.get(allChannels);
            setChannels(data.data);
        }
        fetchData();
      }, []);

      const handleChatChange = (chat) => {
        setCurrentChat(chat);
      };

      const handleChatChannel = (channel) => {
        setCurrentChannel(channel);
      };

      const handleNewMsg = (msg) =>{
        setNewMsg(msg)
      }
  return (
    <Container>
      <div className="head">
        <div className="current-user">
          <div className="avatar">
            {currentUser ? (
              <img
                src={require(`../images/${currentUser.image}`)}
                alt="avatar"
              />
            ) : (
              <></>
            )}
          </div>

          <div className="username">
            <h2>{currentUser ? currentUser.username : ""}</h2>
          </div>
        </div>
        <Logout />
      </div>
      <div className="container">
        <Contacts
          contacts={contacts}
          channels={channels}
          currentUser={currentUser}
          changeChat={handleChatChange}
          changeChannel={handleChatChannel}
          chatORChannel={setchatorChannel}
          newMsg={newMsg}
        />
        {
          isLoaded && (currentChat || currentChannel) === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <>
              {chatorChannel ? (
                <ChatContainer
                  currentChat={currentChat}
                  currentUser={currentUser}
                  socket={socket}
                  setArrivalMsg={handleNewMsg}
                />
              ) : (
                <PublicChat
                  currentChannel={currentChannel}
                  currentUser={currentUser}
                  socket={socket}
                />
              )}
            </>
          )

          //   isLoaded && (currentChat || currentChannel) === undefined? (
          //     <Welcome currentUser={currentUser}/>

          // ):(<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
          // )
        }
      </div>
    </Container>
  );
}

export default Chat ;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-image: linear-gradient(45deg, #0066ff, #ff0088);
  .container {
    height: 85vh;
    width: 85vw;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px 2px gray;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .head {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 85vw;
    margin-top: -20px;
    justify-content: right;
    .current-user {
      height: 4rem;
      padding-left: 0.8rem;
      padding-right: 1rem;
      background-color: white;
      border-radius: 20rem;
      overflow: hidden;
      box-shadow: 0 0 10px 2px gray;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      .avatar {
        img {
          height: 3rem;
          max-inline-size: 100%;
          border-radius: 8rem;
        }
      }
      .username {
        h2 {
          color: black;
        }
      }
    }
  }
`;