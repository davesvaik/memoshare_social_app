import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const style = {
  postWrapper: `m-2`,
  postMainEffc: `relative cursor-zoom-in w-auto hover:shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out`,
  postStyle: `rounded-lg w-full`,
  hoverWrapper: `absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50`,
  hoverStyle: `flex items-center justify-between`,
  downloadWrapper: `flex gap-2`,
  downloadStyle: `bg-gray-300 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none`,
  savedBtnStyle: `bg-likes opacity-70 hover:opacity-100 text-white font-bold px-3 py-1 text-base rounded-3xl hover:shadow-md outlined-none`,
  saveBtnStyle: `bg-likes opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none`,
  deleteBtnWrapper: `flex justify-end items-center gap-2 w-full`,
  deletenBtnStyle: `bg-gray-300 p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none`,
  userLinkStyle: `flex gap-2 mt-2 items-center`,
  userImgStyle: `w-8 h-8 rounded-full object-cover`,
  userNameStyle: `font-semibold capitalize`,
};

const Post = ({ post: { postedBy, image, _id, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  //checking if the user has already been saved and turning array into boolean
  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length;

  //delete post
  const deletePost = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  //if not saved, save it and patch to sanity
  const savePost = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  return (
    <div className={style.postWrapper}>
      {/*Hover:shadow effect when mouse on top of the post. when clicked on navigate to the post */}
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/post-detail/${_id}`)}
        className={style.postMainEffc}
      >
        {/*show post image */}
        <img
          src={urlFor(image).width(250).url()}
          className={style.postStyle}
          alt="user-post"
        />
        {/*when hovering on post, show like and save options */}
        {postHovered && (
          <div className={style.hoverWrapper} style={{ height: "100%" }}>
            <div className={style.hoverStyle}>
              <div className={style.downloadWrapper}>
                {/*download the picture. stopPropagation used to not trigger other events */}
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className={style.downloadStyle}
                >
                  <MdDownloadForOffline size={25} />
                </a>
              </div>
              {/*like logic. show the number of likes. */}
              {alreadySaved ? (
                <button type="button" className={style.savedBtnStyle}>
                  {save?.length} Likes
                </button>
              ) : (
                <button
                  type="button"
                  className={style.saveBtnStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    savePost(_id);
                  }}
                >
                  Like
                </button>
              )}
            </div>
            <div className={style.deleteBtnWrapper}>
              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePost(_id);
                  }}
                  className={style.deletenBtnStyle}
                >
                  <AiTwotoneDelete size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/*user that posted the post */}
      <Link
        to={`user-profile/${postedBy?._id}`}
        className={style.userLinkStyle}
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className={style.userImgStyle}
        />
        <p className={style.userNameStyle}>{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Post;
