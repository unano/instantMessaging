import React , {useState, useEffect, useCallback} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.svg";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
    const navigate= useNavigate();

    const [values, setValues] = useState({
        "username":"",
        "password":"",
    });
  const toastOptions = {
    position:"top-right",
    autoClose:4000,
    pauseOnHover:true,
    draggable:true,
    theme:"light",
}

  useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
          navigate('/');
      }
  },[]);

  const handleSubmit = async(e) =>{
      e.preventDefault();
      handleValidation();
      if(handleValidation()){
        const { password, username} = values;
        const {data} = await axios.post(loginRoute, {
            username, password,
        }); 
        if (data.status===false){
            toast.info(data.msg, toastOptions);
        }
        if (data.status === true) {
            localStorage.setItem(
              'chat-app-user',
              JSON.stringify(data.user)
            );
            navigate("/");
          }
      }
  };

  const handleChange = (e) =>{
      setValues({...values, [e.target.name]:e.target.value});
  };



  const handleValidation = () =>{
      const { password, username} = values;
      if(password === ""){
        toast.info("Email and password is required.",toastOptions);
        return false;
      }
      else if (username.length === ""){
            toast.info("Email and password is required.",toastOptions);
            return false;
          }
          return true;
      }
      


  return (
    <>
        <FormContainer>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <div className="brand">
                    {/* <img src={Logo} alt="" /> */}
                    <h1>Vchat</h1>
                </div>
                <input type="text" placeholder="Username" name="username" onChange={(e) =>handleChange(e)} min="3"/>
                <input type="password" placeholder="password" name="password" onChange={(e) =>handleChange(e)}/>
                <button type="submit">Login</button>
                <span>Don't have an account? Please <Link to="/register">Register</Link></span>
            </form>
        </FormContainer>
        <ToastContainer/>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-image: linear-gradient(45deg, #0066ff, #ff0088);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #0066ff;
      text-transform: uppercase;
      font-size: 50px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    border-radius: 0.5rem;
    padding: 5rem 3rem;
    box-shadow 0px 0px 8px gray;
    padding-top:2rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid silver;
    border-radius: 0.2rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid black;
      outline: none;
    }
  }
  button {
    background-color: white;
    color: #ff0088;
    padding: 1rem 2rem;
    border: 0.1rem solid #ff0088;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: all 0.5s;
    &:hover {
      background-color: #ff0088;
      color: white;
    }
  }
  span {
    color: black;
    a {
      color: #0066ff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;