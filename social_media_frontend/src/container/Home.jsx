import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import { Sidebar, UserProfile } from "../components";
import Posts from "./Posts";
import { client } from "../client";
import logo from "../assets/MemoShare.png";
import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

const style = {
  pageWrapper: `flex bg-alice md:flex-row flex-col h-screen transaction-height duration-75 ease-out`,
  sidebarMDWrapper: `hidden md:flex h-screen flex-initial`,
  sidebarXLWrapper: `flex md:hidden flex-row`,
  sidebarNavWrapper: `p-2 w-full flex flex-row justify-between items-center shadow-md`,
  logoTxtStyle: `text-logo text-xl font-semibold`,
  mobileSidebar: `fixed w-3/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in`,
  mobileCloseIconWrapper: `absolute w-full flex justify-end items-center p-2`,
  scrollbar: `pb-2 flex-1 h-screen overflow-y-scroll`,
};

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const userInfo = fetchUser();

  //loading the user data on mounting
  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  //scroll reset to top on mounting
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className={style.pageWrapper}>
      <div className={style.sidebarMDWrapper}>
        {/*Sidebar with user props */}
        <Sidebar user={user && user} />
      </div>
      <div className={style.sidebarXLWrapper}>
        <div className={style.sidebarNavWrapper}>
          {/*Hamburger icon for mobile sidebar*/}
          <HiMenu
            fontSize={35}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          {/*Logo also works as Link to home */}
          <Link to="/">
            <div className="flex flex-row justify-center items-center">
              <img src={logo} alt="logo" className="w-12" />
              <h2 className={style.logoTxtStyle}>MemoShare</h2>
            </div>
          </Link>
          {/*User pic also works as Link to user profile */}
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="user-pic"
              className="w-9 h-9 rounded-full"
            />
          </Link>
        </div>
        {/*Mobile: open/close sidebar */}
        {toggleSidebar && (
          <div className={style.mobileSidebar}>
            <div className={style.mobileCloseIconWrapper}>
              {/*Close sidebar icon */}
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            {/*Sidebar with user and toggle props */}
            <Sidebar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      <div className={style.scrollbar} ref={scrollRef}>
        <Routes>
          {/* dynamic user profile id*/}
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          {/* posts route*/}
          <Route path="/*" element={<Posts user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
