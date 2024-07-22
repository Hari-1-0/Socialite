// Home.jsx

import React, { useState, useEffect} from 'react';
import Post from '../components/Post';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem('USER_DETAILS'));

  useEffect(() => {
    fetchPosts();
    if (location.state && location.state.updated) {
      setSuccessMessage('Your post has been successfully updated');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/`);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error fetching posts. Please try again.');
    }
  };
  

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddPost = async () => {
    setError('');
    const access_token = localStorage.getItem('access_token');

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image, image.name);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts/`, formData, {
        headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post added successfully:', response.data);
      setContent('');
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Error adding post. Please try again.');
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search-users/?q=${query}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error('Error searching users:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="home">
      <div className="header">
        <h1>&lt;Socialite /&gt;</h1> 
        <div className="user-actions">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search users..."
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <Link key={user.id} to={`/profiles/${user.id}`} className="search-result">
                  {user.username}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="profile-settings">
          <Link to={`/profiles/${loggedInUser.id}`} className="profile-button">{loggedInUser.username}</Link>
        </div>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="add-post-form">
        <h2>Add New Post</h2>
        <div className='add-post-form-inputs'>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write something..."
          />
          <input
            type="file"
            onChange={handleImageChange}
          />
          <button onClick={handleAddPost} className='post-btn'>Add Post</button>
        </div>
      </div>
      <div className="posts-container">
        <h1>Posts</h1>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
