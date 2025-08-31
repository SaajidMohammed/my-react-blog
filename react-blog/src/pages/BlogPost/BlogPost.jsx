import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 👇 CORRECTED: Use the environment variable for the API call
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError(
          "Could not load posts. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const createExcerpt = (content) => {
    if (!content) return "";
    return content.substring(0, 120) + "...";
  };

  return (
    <div className="blog-container">
      <h1 className="blog-page-title">The Blog</h1>

      {loading && <div className="loading-message">Loading posts...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="blog-posts-list">
          {posts.map((post) => (
            <article key={post._id} className="blog-post-item">
              {post.imagePath && (
                <Link to={`/blog/${post._id}`}>
                  <img
                    // 👇 CORRECTED: Use the environment variable for the image source
                    src={`${API_BASE_URL}/${post.imagePath}`}
                    alt={post.title}
                    className="post-image"
                  />
                </Link>
              )}
              <div className="post-content-preview">
                <Link to={`/blog/${post._id}`} className="post-title-link">
                  <h2>{post.title}</h2>
                </Link>
                <div className="post-meta">
                  <span>By {post.author?.username || "Admin"}</span> |{" "}
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
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
