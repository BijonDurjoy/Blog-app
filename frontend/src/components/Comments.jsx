import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (postId) {
            console.log("Fetching comments for post ID:", postId); // Debug log
            fetchComments();
        }
    }, [postId]);

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:4500/api/comments/${postId}`);
            console.log("Raw API response:", res.data); // Debug log
            const formattedComments = formatComments(res.data);
            console.log("Formatted comments:", formattedComments); // Debug log
            setComments(formattedComments);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    };

    const formatComments = (rawComments) => {
        if (!Array.isArray(rawComments)) {
            console.error("Raw comments is not an array:", rawComments);
            return [];
        }

        const commentMap = new Map();
        
        rawComments.forEach(comment => {
            if (!commentMap.has(comment.commentId)) {
                commentMap.set(comment.commentId, {
                    id: comment.commentId,
                    comment: comment.comment,
                    username: comment.username,
                    created_at: comment.created_at,
                    replies: []
                });
            }

            if (comment.replyId) {
                const parentComment = commentMap.get(comment.commentId);
                if (parentComment) {
                    parentComment.replies.push({
                        id: comment.replyId,
                        reply: comment.reply,
                        username: comment.replyUser,
                        created_at: comment.reply_created_at
                    });
                }
            }
        });

        return Array.from(commentMap.values());
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        try {
            const res = await axios.post('http://localhost:4500/api/comments/add', {
                postId,
                userId: currentUser.id,
                comment: commentText
            });

            console.log("New comment response:", res.data); // Debug log

            // Refresh comments after posting
            fetchComments();
            setCommentText('');
        } catch (err) {
            console.error("Error adding comment:", err);
            alert("Failed to add comment");
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const res = await axios.post('http://localhost:4500/api/comments/reply', {
                commentId,
                userId: currentUser.id,
                reply: replyText
            });

            console.log("New reply response:", res.data); // Debug log

            // Refresh comments after posting reply
            fetchComments();
            setReplyText('');
            setReplyToCommentId(null);
        } catch (err) {
            console.error("Error adding reply:", err);
            alert("Failed to add reply");
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            
            {currentUser && (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>
            )}

            {loading && <p>Loading comments...</p>}
            {error && <p className="error">{error}</p>}

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header">
                            <strong>{comment.username}</strong>
                            <span className="date">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                        
                        {currentUser && (
                            <button 
                                className="reply-button"
                                onClick={() => setReplyToCommentId(comment.id)}
                            >
                                Reply
                            </button>
                        )}

                        {replyToCommentId === comment.id && (
                            <form 
                                onSubmit={(e) => handleReplySubmit(e, comment.id)} 
                                className="reply-form"
                            >
                                <textarea
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    required
                                />
                                <button type="submit">Post Reply</button>
                            </form>
                        )}

                        <div className="replies">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="reply">
                                    <div className="reply-header">
                                        <strong>{reply.username}</strong>
                                        <span className="date">
                                            {new Date(reply.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="reply-text">{reply.reply}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;