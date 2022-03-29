import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { postDetailMorePostQuery, postDetailQuery } from "../utils/data";

const style = {
  postDetailWrapper: `flex xl:flex-row flex-col m-auto bg-white`,
  postImgWrapper: `flex justify-center items-center flex-initial`,
  postImgStyle: `rounded-t-2xl rounded-b-2xl p-2`,
  postDetailsWrapper: `w-full p-5 flex-1 xl:min-w-620`,
  downloadSectionWrapper: `flex items-center justify-between`,
  downloadImgWrapper: `flex gap-2 items-center`,
  downloadIconStyle: `bg-gray-300 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none`,
  titleStyle: `text-4xl font-bold break-words mt-3`,
  aboutStyle: `py-5`,
  userLinkStyle: `flex gap-2 mt-5 items-center bg-white rounded-lg`,
  userImgStyle: `w-8 h-8 rounded-full object-cover`,
  userNameStyle: `font-semibold capitalize`,
  commentsStyle: `mt-5 text-2xl md:text-xl sm:text-base`,
  otherCommentsWrapper: `max-h-370 overflow-y-auto`,
  otherCommentsSection: `flex gap-2 mt-5 items-center bg-white rounded-lg`,
  commentUserPic: `w-10 h-10 rounded-full cursor-pointer`,
  otherCommentsTxt: `flex flex-col`,
  otherCommentsTxtStyle: `font-bold`,
  postMyCommentWrapper: `flex flex-wrap mt-6 gap-3`,
  postMyCommentUserPic: `w-10 h-10 rounded-full cursor-pointer`,
  postMyCommentInputStyle: `flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300`,
  postMyCommentBtnStyle: `bg-frenchSky text-black hover:bg-tufts hover:text-white rounded-full px-6 py-2 font-semibold text-base outline-none`,
  moreLikeThisStyle: `text-center font-bold text-2xl mt-8 mb-4`,
};

const PostDetail = ({ user }) => {
  const [posts, setPosts] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { postId } = useParams();

  //if comment is true then patch it to sanity
  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPostDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  //fetching post details from query
  const fetchPostDetails = () => {
    const query = postDetailQuery(postId);

    //fetch the post
    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPostDetail(data[0]);

        //fetch similar posts
        if (data[0]) {
          const query = postDetailMorePostQuery(data[0]);

          client.fetch(query).then((res) => setPosts(res));
        }
      });
    }
  };

  //fetch post details when postId changes
  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  //loading spinner
  if (!postDetail) return <Spinner message="Loading post..." />;

  return (
    <>
      <div
        className={style.postDetailWrapper}
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        {/*Show the post details */}
        <div className={style.postImgWrapper}>
          {/*post img*/}
          <img
            src={postDetail?.image && urlFor(postDetail.image).url()}
            className={style.postImgStyle}
            alt="user-post"
          />
        </div>
        {/*post details */}
        <div className={style.postDetailsWrapper}>
          {/*download button */}
          <div className={style.downloadSectionWrapper}>
            <div className={style.downloadImgWrapper}>
              <a
                href={`${postDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className={style.downloadIconStyle}
              >
                <MdDownloadForOffline size={25} />
              </a>
              <h2 className="text-base">Download</h2>
            </div>
          </div>
          {/*title and about*/}
          <div>
            <h1 className={style.titleStyle}>{postDetail.title}</h1>
            <p className={style.aboutStyle}>{postDetail.about}</p>
          </div>
          {/* Link to user that posted and his info*/}
          <Link
            to={`user-profile/${postDetail.postedBy?._id}`}
            className={style.userLinkStyle}
          >
            <img
              src={postDetail.postedBy?.image}
              alt="user-profile"
              className={style.userImgStyle}
            />
            <p className={style.userNameStyle}>
              {postDetail.postedBy?.userName}
            </p>
          </Link>
          {/*comment section*/}
          <h2 className={style.commentsStyle}>Comments</h2>
          <div className={style.otherCommentsWrapper}>
            {/* show all the comments if there are any*/}
            {postDetail?.comments?.map((comment, i) => (
              <div className={style.otherCommentsSection} key={i}>
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className={style.commentUserPic}
                />
                <div className={style.otherCommentsTxt}>
                  <p className={style.otherCommentsTxtStyle}>
                    {comment.postedBy.userName}
                  </p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          {/* post a comment*/}
          <div className={style.postMyCommentWrapper}>
            <Link to={`user-profile/${postDetail.postedBy?._id}`}>
              <img
                src={postDetail.postedBy?.image}
                alt="user-profile"
                className={style.postMyCommentUserPic}
              />
            </Link>
            <input
              className={style.postMyCommentInputStyle}
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className={style.postMyCommentBtnStyle}
              onClick={addComment}
            >
              {addingComment ? "Posting the comment" : "Post"}
            </button>
          </div>
        </div>
      </div>
      {/* show more of similar category posts if there are any*/}
      {console.log(posts)}
      {posts?.length > 0 ? (
        <>
          <h2 className={style.moreLikeThisStyle}>More like this</h2>
          <MasonryLayout posts={posts} />
        </>
      ) : (
        <Spinner message="Loading more posts.." />
      )}
    </>
  );
};

export default PostDetail;
