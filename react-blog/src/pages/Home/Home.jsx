import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 New state for handling errors

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts?limit=3`);
        if (!response.ok) {
          // If the server responds with an error status (like 404 or 500)
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFeaturedPosts(data);
      } catch (error) {
        console.error("Failed to fetch featured posts:", error);
        // 👇 Set a user-friendly error message
        setError(
          "Could not load featured posts. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const createExcerpt = (content) => {
    if (!content) return "";
    return content.substring(0, 100) + "...";
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to My Blog</h1>
        <p>A place for my thoughts on tech, life, and everything in between.</p>
      </header>

      <main className="featured-posts">
        <h2>Featured Posts</h2>
        {/* 👇 Conditionally render based on loading, error, or success states */}
        {loading && <p>Loading posts...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="posts-grid">
            {featuredPosts.map((post) => (
              <article key={post._id} className="post-preview">
                {post.imagePath && (
                  <img
                    src={`http://localhost:5000/${post.imagePath}`}
                    alt={post.title}
                    className="post-preview-image"
                  />
                )}
                <h3>{post.title}</h3>
                <p className="post-excerpt">{createExcerpt(post.content)}</p>
                <Link to={`/blog/${post._id}`} className="read-more-btn">
                  Read More
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
