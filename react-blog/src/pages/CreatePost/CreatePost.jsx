import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CreatePost.css';

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const { token } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('postImage', image);

    try {
      // 👇 CORRECTED: Use the environment variable for the API call
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Post created successfully!');
        setTitle('');
        setContent('');
        setImage(null);
        event.target.reset();
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" rows="10" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
        </div>
        <button type="submit" className="submit-btn">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
