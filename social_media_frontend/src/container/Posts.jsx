import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Feed, PostDetail, CreatePost, Search } from "../components";

const Posts = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="px-2 md:px-5">
      <div>
        {/*Navbar for searching */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        {/*All the routes */}
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/post-detail/:postId"
            element={<PostDetail user={user} />}
          />
          <Route path="/create-post" element={<CreatePost user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Posts;
