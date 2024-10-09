import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Comments = ({ posId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchComments();
    }, [posId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:4500/api/posts/${postId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.log(err);

        }
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!commentText.trim()){
            alert('Please enter a comment');
            return;
        }
        const token = localStorage.getItem('access_token');

        try{
            const res = await axios.post(
                `http://localhost:4500/api/posts/${postId}/comments`,
                { comment_text: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setComments([res.data, ...comments]);
            setCommentText('');
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className="comments">
            <h3>COMMENTS</h3>
            {currentUser ? (
                <form onSubmit={handleSubmit} className='comment-form'>
                    <textarea
                        placeholder='Write a comment...'
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        rows="3"
                    ></textarea>
                    <button type="submit">Comment</button>
                </form>
            ) : (
                <p>Please login for comment</p>
            )}
            <div className="comments-list">
                {comments.map((comment) => {
                    <div key={comment.id} className='comment'>
                        <img src={comment.userImg} alt={comment.username} className='user-img' />
                        <div className="comment-content">
                            <span className='username'>{comment.username}</span>
                            <span className="date">{new Date(comment.created_at).toLocaleString()}</span>
                            <p>{comment.comment_text}</p>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Comments