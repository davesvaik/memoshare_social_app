import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePost = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const style = {
    createPostWrapper: `flex flex-col justify-center items-center mt-5 lg:h-4/5`,
    notAllfieldsFilledError: `text-red-500 mb-5 text-xl transition-all duration-150 ease-in`,
    createPostInnerWrapper: `flex xl:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full`,
    pictureUploadWrapper: `bg-secondaryColor p-3 flex flex-0.7 w-full`,
    pictureUploadInnerWrapper: `flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420`,
    uploadLogoWrapper: `flex flex-col items-center justify-center h-full hover:cursor-pointer`,
    uploadLogoInnerWrapper: `flex flex-col justify-center items-center`,
    deletePostBtn: `absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out`,
    filloutFormWrapper: `flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full`,
    titleStyle: `outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2`,
    aboutStyle: `outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2`,
    lowerFilloutForm: `flex flex-col`,
    chooseTxtStyle: `mb-2 font-semibold text-lg sm:text-xl`,
    selectCategoryStyle: `outline-none w-2/5 text-base border-b-2 border-gray-400 p-2 rounded-md cursor-pointer`,
    categoryOptions: `text-base border-0 outline-none capitalize bg-white text-black-50`,
    userAndPostWrapper: `flex justify-between items-end mt-5`,
    userWrapper: `flex gap-2 items-center bg-white rounded-lg`,
    userImg: `w-10 h-10 rounded-full`,
    postBtnStyle: `bg-frenchSky text-black hover:bg-tufts hover:text-white font-bold p-2 rounded-full w-28 outline-none`,
  };

  const navigate = useNavigate();

  //check the type of the upload file, upload to sanity and set states
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Image upload error ", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  //Post function to sanity, check if all fields have inputs before posting
  const savePost = () => {
    if (title && about && imageAsset?._id && category) {
      const doc = {
        _type: "post",
        title,
        about,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate("/"); //navigate to homepage after successful upload
      });
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className={style.createPostWrapper}>
      {/* if all fields are not filled give error message */}
      {fields && (
        <p className={style.notAllfieldsFilledError}>
          Please fill in all the fields.
        </p>
      )}
      <div className={style.createPostInnerWrapper}>
        <div className={style.pictureUploadWrapper}>
          <div className={style.pictureUploadInnerWrapper}>
            {/*Spinner if loading is true */}
            {loading && <Spinner />}
            {/*display error message if type is wrong */}
            {wrongImageType && <p>Wrong image type</p>}
            {/*if there are no assets, make the upload screen available. Otherwise show the asset as a preview */}
            {!imageAsset ? (
              <label>
                <div className={style.uploadLogoWrapper}>
                  <div className={style.uploadLogoInnerWrapper}>
                    <p>
                      <AiOutlineCloudUpload size={35} />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Recommended to use high-quality JPG, SVG, PNG or GIF
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="w-full h-full"
                />
                <button
                  type="button"
                  className={style.deletePostBtn}
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        {/*fill out form */}
        <div className={style.filloutFormWrapper}>
          {/*title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add the title here"
            className={style.titleStyle}
          />
          {/*about post or picture */}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell your story here"
            className={style.aboutStyle}
          />
          <div className={style.lowerFilloutForm}>
            <div>
              <p className={style.chooseTxtStyle}>Choose a category</p>
              {/* drop down of the categories */}
              <select
                onChange={(e) => setCategory(e.target.value)}
                className={style.selectCategoryStyle}
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {/*map over all the categories*/}
                {categories.map((category) => (
                  <option
                    className={style.categoryOptions}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.userAndPostWrapper}>
              {/*show user image */}
              {user && (
                <div className={style.userWrapper}>
                  <img
                    src={user.image}
                    className={style.userImg}
                    alt="user-profile"
                  />
                  <p className="font-bold">{user.userName}</p>
                </div>
              )}
              {/*Post button */}
              <button
                type="button"
                onClick={savePost}
                className={style.postBtnStyle}
              >
                Post!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
