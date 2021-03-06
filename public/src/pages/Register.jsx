import React , {useState, useEffect } from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
    const navigate= useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState("");

    const uploadImage =(e)=>{
      console.log(e)
      setImage(e.target.files[0]);
    }

    const [values, setValues] = useState({
        "username":"",
        "email":"",
        "password":"",
        "confirmPassword":"",
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
        const formData = new FormData();

        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        const {data} = await axios.post(registerRoute, formData); 
        if (data.status===false){
            toast.info(data.msg, toastOptions);
        }
        if (data.status===true){
            localStorage.setItem('chat-app-user', JSON.stringify(data.user));
            navigate("/");
        }
      }
  };

  const handleChange = (e, num) =>{
    if(num===1)
      setValues({...values, [e.target.name]:e.target.value});
    else
      setValues({ ...values, [e.target.name]: e.target.file[0] });
  };



  const handleValidation = () =>{
      // const { password, confirmPassword, username, email} = values;
      if (password !== confirmPassword) {
        toast.info(
          "password and confirm password should be same.",
          toastOptions
        );
        return false;
      } else if (username.length < 3) {
        toast.info(
          "username should be greater than 3 characters.",
          toastOptions
        );
        return false;
      } else if (password.length < 8) {
        toast.info(
          "password should be greater than 8 characters.",
          toastOptions
        );
        return false;
      } else if (username.length < 3) {
        toast.info(
          "username should be greater than 3 characters.",
          toastOptions
        );
      } else if (email === "") {
        toast.info("email is required.", toastOptions);
        return false;
      } else if (image === "") {
        toast.info("Avatar is required.", toastOptions);
        return false;
      }
          return true;
      }
      


  return (
    <>
      <FormContainer>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}

          encType='multipart/form-data'
        >
          <div className="brand">
            {/* <img src={Logo} alt="" /> */}
            <h1>Vchat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="file"
            name="image"
            filename="image"
            onChange={uploadImage}
          />
          <button type="submit">Register</button>
          <span>
            Already have an account? Please <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
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
    gap: 1rem;
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
    ::file-selector-button {
      border: 2px solid gray;
      padding: .2em .4em;
      border-radius: 10rem;
      background-color: transparent;
      transition: 1s;
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

export default Register;