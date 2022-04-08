import React , {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { allUsersRoute, host , allChannels } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import PublicChat from "../components/publicChat";
import {io} from "socket.io-client";

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
        if (currentUser) {
          socket.current = io(host);
          socket.current.emit("add-user", currentUser._id);
        }
      }, [currentUser]);

      // useEffect(() => {
      //   if (currentChannel) {
      //     socket.current = io(host);
      //     socket.current.emit("join-room", currentChannel._id);
      //   }
      // }, [currentChannel]);


      useEffect(() => {
        async function fetchData() {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate("/setAvatar");
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
        if(!chatorChannel){
          socket.current = io(host);
          socket.current.emit("add-user", currentUser._id);
        }
      };

      const handleChatChannel = (channel) => {
        setCurrentChannel(channel);
        socket.current = io(host);
        socket.current.emit("join-room", channel._id);
      };
  return (
    <Container>
        <div className="container">
        <Contacts contacts={contacts} channels={channels} currentUser={currentUser} changeChat={handleChatChange} changeChannel={handleChatChannel} chatORChannel={setchatorChannel}/>
        {
            isLoaded && (currentChat || currentChannel)=== undefined? (
                <Welcome currentUser={currentUser}/>

            ):(<>{chatorChannel?<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/> :
            <PublicChat currentChannel={currentChannel} currentUser={currentUser} socket={socket}/>}</>
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
    overflow:hidden;
    box-shadow: 0 0 10px 2px gray;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;