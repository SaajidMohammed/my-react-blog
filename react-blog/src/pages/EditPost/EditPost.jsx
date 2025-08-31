import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Reuse the same CSS as CreatePost for consistency
import '../CreatePost/CreatePost.css';

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // You can also add state for a new image if you want to allow changing it

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // 👇 CORRECTED: Use the environment variable here
                const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setTitle(data.title);
                    setContent(data.content);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                alert('Failed to load post data.');
            }
        };
        fetchPostData();
    }, [id, token]); // Added token as a dependency

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        // Add image handling here if you allow image updates

        try {
            // 👇 CORRECTED: Use the environment variable here as well
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (response.ok) {
                alert('Post updated successfully!');
                navigate(`/blog/${id}`);
            } else {
                throw new Error('Failed to update post.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="create-post-container">
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" rows="10" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                </div>
                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPost;
