import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostOptionsMenu from "../../components/PostOptionsMenu/PostOptionsMenu";
import "./BlogPost.css";

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, userId } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 👇 CORRECTED: Use the environment variable for the API call
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setPost(null);
          } else {
            throw new Error("Network response was not ok");
          }
        } else {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError("Could not load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="loading-message">Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <h1>Post Not Found</h1>
        <p>Sorry, we couldn't find the post you're looking for.</p>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    );
  }

  const isAuthor = isAuthenticated && post.author?._id === userId;

  return (
    <article className="blog-post-container">
      {post.imagePath && (
        <img
          // 👇 CORRECTED: Use the environment variable for the image source
          src={`${API_BASE_URL}/${post.imagePath}`}
          alt={post.title}
          className="post-full-image"
        />
      )}

      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        {isAuthor && (
          <button
            onClick={() => setShowMenu(true)}
            className="options-btn"
            aria-label="Post Options"
          >
            &#8942; {/* Vertical ellipsis */}
          </button>
        )}
      </div>

      <div className="post-meta">
        <span>By {post.author?.username || "Unknown Author"}</span> |{" "}
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <Link to="/blog" className="back-to-blog-link">
        ← Back to All Posts
      </Link>

      {showMenu && (
        <PostOptionsMenu post={post} onClose={() => setShowMenu(false)} />
      )}
    </article>
  );
};

export default BlogPost;
