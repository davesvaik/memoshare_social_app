import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);
  const { categoryId } = useParams();

  //refreshes when category changes
  useEffect(() => {
    setLoading(true);
    //if there are search results - display them, otherwise display normal feed
    if (categoryId) {
      const query = searchQuery(categoryId);

      //fetch data from query
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
  }, [categoryId]);

  //if loading then display spinner with message
  if (loading) return <Spinner message="More content incoming shortly!" />;

  //return warning message if no posts found
  if (!posts?.length) return <h2>No posts available</h2>;

  //display posts in Masonry layout
  return <div>{posts && <MasonryLayout posts={posts} />}</div>;
};

export default Feed;
