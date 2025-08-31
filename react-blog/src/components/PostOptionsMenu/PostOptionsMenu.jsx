import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PostOptionsMenu.css';

const PostOptionsMenu = ({ post, onClose }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert('Post deleted successfully!');
        navigate('/blog'); // Redirect to blog page after deletion
      } else {
        throw new Error('Failed to delete the post.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    // Use a temporary textarea to work with execCommand
    const textArea = document.createElement("textarea");
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    } catch (err) {
        alert('Failed to copy link.');
    }
    document.body.removeChild(textArea);
    onClose();
  };

  return (
    <div className="options-menu-overlay" onClick={onClose}>
      <div className="options-menu-content" onClick={(e) => e.stopPropagation()}>
        {!showConfirm ? (
          <ul>
            <li onClick={handleCopyLink}>Copy Link</li>
            <li onClick={() => navigate(`/edit-post/${post._id}`)}>Edit Post</li>
            <li onClick={() => setShowConfirm(true)} className="delete">Delete Post</li>
          </ul>
        ) : (
          <div className="confirm-delete">
            <p>Are you sure you want to delete this post?</p>
            <button onClick={handleDelete} className="confirm-btn yes">Yes, Delete</button>
            <button onClick={() => setShowConfirm(false)} className="confirm-btn no">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOptionsMenu;