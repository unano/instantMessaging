import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "../components/Logout";

export default function Contacts({ contacts, channels, currentUser, changeChat, changeChannel, chatORChannel }) {


    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentSelected2, setCurrentSelected2] = useState(undefined);

    useEffect(() => {
      if(currentUser){
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
      }
    }, [currentUser]);
    
    const changeCurrentChat = (index, contact) => {
      setCurrentSelected(index);
      changeChat(contact);
      chatORChannel(true);
    };

    const changeCurrentChannel = (index, contact) => {
      setCurrentSelected2(index);
      changeChannel(contact);
      chatORChannel(false);
    };
    return (
      <>
        {currentUserImage && currentUserName && (
          <Container>
            <div className="brand">
              {/* <img src={Logo} alt="logo" /> */}
              <h3>Chats</h3>
            </div>
            <div className="contacts">
            {channels.map((channel, index) => {
            return(<div 
            className={`contact ${index === currentSelected2 ? "selected" : ""}`}
            onClick={() => changeCurrentChannel(index, channel)}>
              <div className="public">P</div>Public Cannel {channel.channel}</div>)})};
              {contacts.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar">
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt="avatar"
                      />
                    </div>
                    <div className="username">
                      <div>{contact.username}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="current-user">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
          </Container>
        )}
      </>
    );
  }
  const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #ebe9f0;
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      img {
        height: 2rem;
      }
      h3 {
        color: black;
        font-size:30px;
      }
    }
    .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top:8px;
      overflow: auto;
      gap: 0.8rem;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .contact {
        color:black;
        background-color: white;
        box-shadow: 0 0 6px #e2e2e2;
        min-height: 5rem;
        cursor: pointer;
        width: 90%;
        border-radius: 0.7rem;
        padding: 0.4rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        transition: 0.5s ease-in-out;
        .public{
          width:3rem;
          height: 3rem;
          border: 0.1rem solid black;
          border-radius: 3rem;
          text-align: center;
          line-height:3rem;
        }
        .avatar {
          img {
            height: 3rem;
          }
        }
        .username {
          div {
            color: black;
          }
        }
      }
      .selected {
        background-color: #211b42;
        color:white;
        .public{
          width:3rem;
          height: 3rem;
          border: 0.1rem solid white;
          border-radius: 3rem;
          text-align: center;
          line-height:3rem;
        }
        .username {
          div {
            color: white;
          }
        }
      }
    }
    .current-user {
      background-color: #0d0d30;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      .avatar {
        img {
          height: 4rem;
          max-inline-size: 100%;
        }
      }
      .username {
        h2 {
          color: white;
        }
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        gap: 0.5rem;
        .username {
          h2 {
            font-size: 1rem;
          }
        }
      }
    }
  `;