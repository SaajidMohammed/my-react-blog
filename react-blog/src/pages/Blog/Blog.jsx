import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 New state for handling errors

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://my-react-blog-backend.onrender.com/api/posts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // 👇 Set a user-friendly error message
        setError(
          "Could not load posts. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 👈 New function to create a short excerpt from post content
  const createExcerpt = (content) => {
    if (!content) return "";
    return content.substring(0, 120) + "...";
  };

  return (
    <div className="blog-container">
      <h1 className="blog-page-title">The Blog</h1>

      {/* 👇 Conditionally render based on loading, error, or success states */}
      {loading && <div className="loading-message">Loading posts...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="blog-posts-list">
          {posts.map((post) => (
            <article key={post._id} className="blog-post-item">
              {post.imagePath && (
                <Link to={`/blog/${post._id}`}>
                  <img
                    src={`http://localhost:5000/${post.imagePath}`}
                    alt={post.title}
                    className="post-image"
                  />
                </Link>
              )}
              <div className="post-content-preview">
                <Link to={`/blog/${post._id}`} className="post-title-link">
                  <h2>{post.title}</h2>
                </Link>

                {/* 👇 Display author and date */}
                <div className="post-meta">
                  <span>By {post.author?.username || "Admin"}</span> |{" "}
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* 👇 Display the excerpt */}
                <p className="post-excerpt">{createExcerpt(post.content)}</p>

                <Link to={`/blog/${post._id}`} className="read-more-link">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
