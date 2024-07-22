import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Update.css';

const Update = () => {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPostDetails();
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}/`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  },
            });
            setContent(response.data.content);
            setImage(response.data.image);
        } catch (err) {
            console.error('Error fetching post details:', err);
            setError('Error fetching post details. Please try again.');
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        setError('');
        const access_token = localStorage.getItem('access_token');

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image, image.name);
            }

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/home', { state: { updated: true } });
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Error updating post. Please try again.');
        }
    };

    return (
        <div className="update-container">
            <h2>Update Post</h2>
            <form onSubmit={handleUpdatePost} className="update-form">
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Update your post content..."
                    required
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                />
                <button type="submit" className='update-btn'>Update Post</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Update;