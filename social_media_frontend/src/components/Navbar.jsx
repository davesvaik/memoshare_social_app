import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const style = {
  navbarWrapper: `flex gap-2 md:gap-5 w-full mt-5 pb-7 bg-alice`,
  searchWrapper: `flex justify-center items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm`,
  searchBar: `p-2 w-full bg-white outline-none`,
  linkWrapper: `flex gap-3`,
  userProfileLink: `hidden md:block`,
  userprofilePic: `w-14 h-12 rounded-lg`,
  createPostLink: `bg-frenchSky hover:bg-tufts text-black hover:text-white rounded-lg w-14 h-12 flex justify-center items-center`,
};

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className={style.navbarWrapper}>
      {/*Searchbar */}
      <div className={style.searchWrapper}>
        <IoMdSearch fontSize={22} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className={style.searchBar}
        />
      </div>
      {/*2 Links, one user profile and other is create post*/}
      <div className={style.linkWrapper}>
        {/*Link to user profile, with user picture */}
        <Link to={`user-profile/${user._id}`} className={style.userProfileLink}>
          <img src={user.image} alt="user" className={style.userprofilePic} />
        </Link>
        {/*Link to create post */}
        <Link to="create-post" className={style.createPostLink}>
          <IoMdAdd size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
