import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import styled from "styled-components";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => { 
      localStorage.clear();
      navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <IoMdLogOut />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  width:4rem;
  height:4rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 2rem;
  background-color: #211b42;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;