import React, { useState, useEffect } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import {
  userCreatedPostsQuery,
  userQuery,
  userSavedPostsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const style = {
  wrapper: `relative pb-2 h-full justify-center items-center`,
  wrapper2: `flex flex-col pb-5`,
  wrapper3: `relative flex flex-col mb-7`,
  wrapper4: `flex flex-col justify-center items-center`,
  img: `w-full h-370 2xl:h-510 shadow-lg object-cover`,
  userImg: `rounded-full w-20 h-20 -mt-10 shadow-xl object-cover`,
  userName: `font-bold text-3xl text-center mt-3`,
  logoutWrapper: `absolute top-0 z-1 right-0`,
  logoutButton: `bg-white p-2 rounded-full cursor-pointer outline-none shadow-md`,
  btnWrapper: `text-center mb-7`,
  noPosts: `flex justify-center font-bold items-center w-full text-xl mt-2`,
};

//random cover image for all users
const randomImage = "https://source.unsplash.com/1600x900/?food,cars";

//styles for active/not active buttons
const activeBtnStyles =
  "bg-tufts mx-1 mt-4 text-black font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-frenchSky mx-1 mt-4 text-white font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  //fetch user data on userId change
  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  //fetch either created or liked posts. re-fetch on input change or userId change
  useEffect(() => {
    if (text === "Created") {
      const createdPostsQuery = userCreatedPostsQuery(userId);

      client.fetch(createdPostsQuery).then((data) => {
        setPosts(data);
      });
    } else {
      const savedPostsQuery = userSavedPostsQuery(userId);

      client.fetch(savedPostsQuery).then((data) => {
        setPosts(data);
      });
    }
  }, [text, userId]);

  //logout and navigate to login page
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  //if not user then display spinner and warning message
  if (!user) return <Spinner message="Loading profile.." />;

  return (
    <div className={style.wrapper}>
      <div className={style.wrapper2}>
        <div className={style.wrapper3}>
          <div className={style.wrapper4}>
            {/*display cover image, profile picture, username*/}
            <img src={randomImage} className={style.img} alt="banner-pic" />
            <img src={user.image} className={style.userImg} alt="user-pic" />
            <h1>{user.userName}</h1>
            <div className={style.logoutWrapper}>
              {/*log out the user + logout icon */}
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} //google API for logout
                  render={(renderProps) => (
                    <button
                      type="button"
                      className={style.logoutButton}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <RiLogoutBoxRLine color="blue" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
            {/*Created and Liked buttons */}
            <div className={style.btnWrapper}>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("created");
                }}
                className={`${
                  activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("saved");
                }}
                className={`${
                  activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Liked
              </button>
            </div>
            {/*if posts found, display them, otherwise show warning message */}
            {posts?.length ? (
              <div className="px-2">
                <MasonryLayout posts={posts} />
              </div>
            ) : (
              <div className={style.noPosts}>No posts found!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
