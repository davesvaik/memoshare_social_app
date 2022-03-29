import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/video3.mp4";
import MemoShare from "../assets/MemoShare.png";
import { client } from "../client";

const style = {
  pageWrapper: `flex justify-start items-center flex-col h-screen`,
  bgVideoWrapper: `relative w-full h-full`,
  bgVideoStyle: `w-full h-full object-cover`,
  overlayShadow: `absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay`,
  logoWrapper: `flex justify-center items-center py-5`,
  loginBtn: `bg-mainColor font-semibold flex justify-center items-center text-semibold p-3 rounded-lg cursor-pointer outline-none`,
  logoAndLoginWrapper: `border-black rounded-xl p-10 bg-whiteOverlay`,
  logoColor: `text-logo text-2xl font-semibold`,
};

const Login = () => {
  const navigate = useNavigate();
  //response from google login. user is saved in sanity database and redirected home
  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response.profileObj;

    //data for sanity user schema
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.bgVideoWrapper}>
        {/*background video */}
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className={style.bgVideoStyle}
        />
        <div className={style.overlayShadow}>
          <div className={style.logoAndLoginWrapper}>
            <div className={style.logoWrapper}>
              {/*Logo */}
              <img src={MemoShare} width="60px" alt="logo" />
              <h1 className={style.logoColor}>MemoShare</h1>
            </div>
            <div>
              {/*google login with logo */}
              <GoogleLogin //react-google-login
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} //google API for login
                render={(renderProps) => (
                  <button
                    type="button"
                    className={style.loginBtn}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle size={20} className="mr-4" /> Sign in with Google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
