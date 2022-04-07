import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "../components/Logout";

export default function Welcome({currentUser}) {
  const [userName, setUserName] = useState("");

  return (
    <Container>
      <h1>Vchat</h1>
      <h2>
        Welcome, <span>{currentUser.username}!</span>
      </h2>
      <h3>Select a chat to Start messaging.</h3>
      <Logout />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }

  h3{
    margin-bottom:30px;
  }

  h1 {
    color: #0066ff;
    text-transform: uppercase;
    font-size: 50px;
  }
`;