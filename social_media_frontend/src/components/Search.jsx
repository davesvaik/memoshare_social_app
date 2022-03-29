import React, { useState, useEffect } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const style = {
  warningMsg: `mt-10 text-center text-xl`,
};

const Search = ({ searchTerm }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  //set loading while searching for posts
  useEffect(() => {
    //if searching then fetch from query, else show normal feed
    if (searchTerm) {
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPosts(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {/*When loading show spinner */}
      {loading && <Spinner message="Searching for posts.." />}
      {/*if posts found then show in masonry layout */}
      {posts?.length !== 0 && <MasonryLayout posts={posts} />}
      {/*if no posts found then show warning message */}
      {posts?.length === 0 && searchTerm !== "" && !loading && (
        <div className={style.warningMsg}>No posts found</div>
      )}
    </div>
  );
};

export default Search;
