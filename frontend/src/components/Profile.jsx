import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profiles/user/${id}/`);
        setProfile(response.data);
      } catch (err) {
        setError('Error fetching profile. Please try again.');
      }
    };
    const fetchLoggedInUser = async () => {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      setLoggedInUser(userDetails);
    };
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts/');
        const userPosts = response.data.filter(post => post.user === parseInt(id));
        setPosts(userPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchProfile();
    fetchPosts();
    fetchLoggedInUser();
  }, [id]);

  const handleUpdateBio = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/profiles/user/${id}/`, { bio: newBio }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProfile({ ...profile, bio: newBio });
      setNewBio('');
    } catch (err) {
      console.error('Error updating bio:', err);
    }
  };

  const handleUpdateProfileImage = async () => {
    const formData = new FormData();
    formData.append('profile_image', newProfileImage);
    try {
      await axios.patch(`http://localhost:8000/api/profiles/user/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile({ ...profile, profile_image: URL.createObjectURL(newProfileImage) });
      setNewProfileImage(null);
    } catch (err) {
      console.error('Error updating profile image:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${postId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userDetails');
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
  
    return `posted on ${formattedDate}, ${formattedTime}`;
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {profile.profile_image ? (
          <img src={`https://res.cloudinary.com/dkmndrjks/${profile.profile_image}`} alt="Profile" className='profile-image'/>
        ) : (
          <img src="https://res.cloudinary.com/dkmndrjks/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1721194076/dummy_xnx1pc.png" className='profile-image-placeholder'/>
        )}
        <h2>{profile.username}</h2>
        <p>{profile.bio}</p>
        {loggedInUser && loggedInUser.id === parseInt(id) && (
          <>
            <div>
              <input
                type="text"
                placeholder="Update bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <button onClick={handleUpdateBio} className='profile-btn'>Update Bio</button>
            </div>
            <div>
              <input
                type="file"
                onChange={(e) => setNewProfileImage(e.target.files[0])}
              />
              <button onClick={handleUpdateProfileImage} className='profile-btn'>Update Profile Image</button>
            </div>
            <button onClick={handleLogout} className='delete-btn'>Logout</button>
          </>
        )}
      </div>
      <div className="profile-posts">
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p>This user hasn't posted yet</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post">
              {post.image && <img src={`http://localhost:8000${post.image}`} alt="Post" className="post-image" />}
              <p>{post.content}</p>
              <p className='post-date'>{formatDate(post.created_at)}</p>
              {loggedInUser && loggedInUser.id === parseInt(id) && (
                <>
                  <button className='profile-btn'><Link to={`/update-post/${post.id}`} className='link-btn'>Update</Link></button>
                  <button onClick={() => handleDeletePost(post.id)}
                    className='delete-btn'>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
