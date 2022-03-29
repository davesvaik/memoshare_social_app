import React from "react";
import Masonry from "react-masonry-css";
import Post from "./Post";

const style = {
  masonryStyle: `flex animate-slide-fwd`,
};
//breakpoints for masonry layout based on device size
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1800: 4,
  1400: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ posts }) => {
  return (
    <div>
      {/* */}
      <Masonry className={style.masonryStyle} breakpointCols={breakpointObj}>
        {posts?.map((post) => (
          <Post key={post?._id} post={post} className="w-max" />
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryLayout;
