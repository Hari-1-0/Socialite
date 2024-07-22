import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Post.css';
import { AiFillHeart } from 'react-icons/ai';
import axios from 'axios';
import dummy from '../assets/dummy.png';

const Post = ({ post }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('USER_DETAILS'));

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profiles/user/${post.user}/`);
        setUserDetails(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/`);
        const filteredComments = response.data.filter(comment => comment.post === post.id);
        setComments(filteredComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    const fetchLikedStatus = async () => {
      const access_token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/like-status/${post.id}/`, {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        setLiked(response.data.liked);
      } catch (err) {
        console.error('Error fetching liked status:', err);
      }
    };

    fetchUserDetails();
    fetchComments();
    fetchLikedStatus();
  }, [post.user, liked, post.id]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
    const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/`,
        { post: post.id, content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/like/`,
        { post: post.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLiked(!liked);
      }
      post.no_of_likes = response.data.no_of_likes;
    } catch (err) {
      console.error('Error liking post:', err);
    }
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

  if (!post || !userDetails) {
    return null; // or render a loading indicator/error message
  }

  return (
    <div className="post">
      <div className="post-header">
        {userDetails.profile_image ? (
          <img src={`https://res.cloudinary.com/dkmndrjks/${userDetails.profile_image}`} alt="Profile" className="profile-pic" />
        ) : (
          <img src={dummy} alt="Dummy" className='profile-pic-placeholder'/>
        )}
        <Link to={`/profiles/${post.user}`} className='username'>
          {userDetails.username}
        </Link>
      </div>
      {post.image && <img src={`https://res.cloudinary.com/dkmndrjks/${post.image}`} alt="Post" className="post-image" />}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <p className='post-date'>{formatDate(post.created_at)}</p>
      <div className="post-actions">
        <button onClick={handleLikePost} className={`like-btn ${liked ? 'liked' : ''}`}>
          <AiFillHeart /> {liked ? 'Liked' : 'Like'} ({post.no_of_likes})
        </button>
      </div>
      <div className="comments">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <strong>{comment.username}</strong>: {comment.content}
          </div>
        ))}
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleAddComment} className='comment-btn'>Add Comment</button>
      </div>
    </div>
  );
};

export default Post;
