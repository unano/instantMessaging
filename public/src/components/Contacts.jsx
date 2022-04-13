import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GoSearch } from "react-icons/go";

export default function Contacts({ contacts, channels, currentUser, changeChat, changeChannel, chatORChannel }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentSelected2, setCurrentSelected2] = useState(undefined);
    const [chatOrc, setChatOrc] = useState(undefined);
    const [selectedUser, setSelectedUser]= useState(contacts);
    const [seach, setSearch]= useState("");


    useEffect(() => {
      const selected = contacts.filter((contact) => {
        return contact.username.toLowerCase().indexOf(seach)!== -1;
      }
        );
      setSelectedUser(selected);
    }, [contacts, seach]);

    useEffect(() => {
      if(currentUser){
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.image);
      }
    }, [currentUser]);
    
    const changeCurrentChat = (index, contact) => {
      setCurrentSelected(index);
      changeChat(contact);
      chatORChannel(true);
      setChatOrc(true);
    };

    const changeCurrentChannel = (index, contact) => {
      setCurrentSelected2(index);
      changeChannel(contact);
      chatORChannel(false);
      setChatOrc(false);
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
              <div className="search">
                <GoSearch className="serachLogo" />
                <input
                  type="text"
                  className="searchArea"
                  onChange={(e) => setSearch(e.target.value)}
                ></input>
              </div>
              {channels.map((channel, index) => {
                return (
                  <div
                    className={`contact ${
                      index === currentSelected2 && !chatOrc ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChannel(index, channel)}
                  >
                    <div className="public">P</div>Public Cannel{" "}
                    {channel.channel}
                  </div>
                );
              })}
              ;
              {selectedUser.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected && chatOrc ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar">
                      <img
                        // src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        src={
                          contact.image
                            ? require(`../images/${contact.image}`)
                            : require("../images/default.png")
                        }
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

            {/* <div className="current-user">
              <div className="avatar">
                <img src={require(`../images/${currentUserImage}`)} alt="avatar" />
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div> */}
          </Container>
        )}
      </>
    );
  }
  const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 90%;
    overflow: hidden;
    background-color: #ebe9f0;
    box-shadow: 2px 0 8px silver;
    z-index: 5;
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
        font-size: 30px;
      }
    }

    .search {
      display: flex;
      width: 90%;
      background-color: white;
      padding: 0.5rem;
      border-radius: 3rem;
      .searchArea {
        font-size: 1.5rem;
        width: 83%;
        margin-left: 1rem;
        border: none;
        &:focus {
          outline: none;
        }
      }

      .serachLogo {
        font-size: 2rem;
      }
    }
    .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 8px;
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
        color: black;
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
        .public {
          width: 3rem;
          height: 3rem;
          border: 0.1rem solid black;
          border-radius: 3rem;
          text-align: center;
          line-height: 3rem;
        }
        .avatar {
          img {
            height: 3rem;
            border-radius: 3rem;
            overflow: hidden;
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
        color: white;
        .public {
          width: 3rem;
          height: 3rem;
          border: 0.1rem solid white;
          border-radius: 3rem;
          text-align: center;
          line-height: 3rem;
        }
        .username {
          div {
            color: white;
          }
        }
      }
    }
    .current-user {
      background-color: white;
      box-shadow: 0 0 8px silver;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      .avatar {
        img {
          height: 4rem;
          max-inline-size: 100%;
          border-radius: 8rem;
        }
      }
      .username {
        h2 {
          color: black;
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