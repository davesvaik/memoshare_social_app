import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { categories } from "../utils/data";
import logo from "../assets/MemoShare.png";

const style = {
  sidebarWrapper: `flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar`,
  sidebarInnerWrapper: `flex flex-col`,
  logoLink: `flex px-5 gap-2 my-6 w-190 justify-center items-center`,
  logoWrapper: `flex flex-col justify-center items-center`,
  logoTxtStyle: `text-logo text-2xl font-semibold`,
  categoryWrapper: `flex flex-col gap-5`,
  discoverCategories: `mt-2 px-5 text-base font-semibold border-b-2 2xl:text-xl`,
  categoryImgStyle: `w-10 h-10 rounded-full shadow-sm`,
};

//category is not selected
const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-lg text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
//category is selected
const isActiveStyle =
  "flex items-center px-5 gap-3 text-lg font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
  //sidebar handler via props
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className={style.sidebarWrapper}>
      <div className={style.sidebarInnerWrapper}>
        {/*Link to Home with app logo */}
        <Link to="/" className={style.logoLink} onClick={handleCloseSidebar}>
          <div className={style.logoWrapper}>
            <img src={logo} alt="logo" className="w-20" />
            <h2 className={style.logoTxtStyle}>MemoShare</h2>
          </div>
        </Link>
        <div className={style.categoryWrapper}>
          {/*Home navigation link. Style changes on Activity and also close onClick */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill size={20} />
            Home
          </NavLink>
          {/*Categories. map over all categories from util data */}
          <h3 className={style.discoverCategories}>Discover categories</h3>
          {/*category navigation link. Style changes on Activity and also close onClick */}
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                className={style.categoryImgStyle}
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
