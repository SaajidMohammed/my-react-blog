import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostOptionsMenu from "../../components/PostOptionsMenu/PostOptionsMenu";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 New state for handling errors
  const { isAuthenticated, userId } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://my-react-blog-backend.onrender.com/api/posts/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setPost(null); // Correctly handle "Not Found"
          } else {
            throw new Error("Network response was not ok");
          }
        } else {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        // 👇 Set a user-friendly error message
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

  // 👇 New: Display a generic error message to the user
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
          src={`http://localhost:5000/${post.imagePath}`}
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
