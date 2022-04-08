import React , {useState, useEffect } from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer} from "buffer";
export default function SetAvatar() {

    const api = "https://api.multiavatar.com/45678945"
    const navigate = useNavigate();

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] =useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
      position:"top-right",
      autoClose:4000,
      pauseOnHover:true,
      draggable:true,
      theme:"light",
  }

    useEffect(() => {
      async function nav() {
        if (!localStorage.getItem("chat-app-user"))
          navigate("/login");
      }
      nav();
      }, []);
    

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
          toast.info("Please select an avatar", toastOptions);
        } else {
          const user = await JSON.parse(
            localStorage.getItem("chat-app-user")
          );
    
          const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
          });
    
          if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem(
                "chat-app-user",
              JSON.stringify(user)
            );
            navigate("/");
          } else {
            toast.info("Error setting avatar. Please try again.", toastOptions);
          }
        }
      };
    useEffect(()=>{
        async function fetchImage() {
            const data = [];
            for (let i =0; i<4; i++){
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }; 
            setAvatars(data);
            setIsLoading(false);
          }
          fetchImage();
    },[]);


    return (
    <>
    {isLoading ? (
        <Container>
          <Loader>
          <div className="loader">Loading...</div>
          </Loader>
        </Container>
      ) : (
          <>
      <Container>
            <div className="title-container">
            <h1>
                Pick an Avatar as your profile picture
            </h1>
            </div>
            <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
    </Container>
    <ToastContainer/>
    </>
      )};
    </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-image: linear-gradient(45deg, #0066ff, #ff0088);
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: black;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #5ba5ff;
    }
  }
  .submit-btn {
    color: #5ba5ff;
    border: 0.1rem solid #5ba5ff;
    padding: 1rem 2rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    background-color: white;
    transition: all 0.5s;
    &:hover {
      background-color: #5ba5ff;
      color: white;
    }
  }
`;

const Loader = styled.div`
.loader,
.loader:after {
  border-radius: 50%;
  width: 16em;
  height: 16em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1em solid #b6b6b6b9;
  border-right: 1em solid #b6b6b6b9;
  border-bottom: 1em solid #b6b6b6b9;
  border-left: 1em solid #5ba5ff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

`;

