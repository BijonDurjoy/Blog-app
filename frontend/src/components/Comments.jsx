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
            fetchComments();
        }
    }, [postId]);

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:4500/api/comments/${postId}`);
            setComments(res.data);
        } catch (err) {
            setError("Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await axios.post('http://localhost:4500/api/comments/add', {
                postId,
                userId: currentUser.id,
                comment: commentText
            });
            fetchComments();
            setCommentText('');
        } catch (err) {
            alert("Failed to add comment");
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await axios.post('http://localhost:4500/api/comments/reply', {
                commentId,
                userId: currentUser.id,
                reply: replyText
            });
            fetchComments();
            setReplyText('');
            setReplyToCommentId(null);
        } catch (err) {
            alert("Failed to add reply");
        }
    };

    const handleLike = async (type, id) => {
        try {
            const url =
                type === "comment"
                    ? `http://localhost:4500/api/comments/like/comment/${id}`
                    : `http://localhost:4500/api/comments/like/reply/${id}`;
            await axios.post(url, { userId: currentUser.id });
            fetchComments();
        } catch (err) {
            alert("You have already liked this " + type);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments ({comments.length})</h3>

            {loading && <p>Loading comments...</p>}
            {error && <p className="error">{error}</p>}

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

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.commentId} className="comment">
                        {/* Comment Details */}
                        <div className="comment-header">
                            <strong>{comment.username}</strong>
                            <span className="date">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                        <button
                            className="like-button"
                            onClick={() => handleLike("comment", comment.commentId)}
                        >
                            Like ({comment.commentLikes})
                        </button>

                        {/* Reply Section */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="replies">
                                <h4>Replies ({comment.replies.length})</h4>
                                {comment.replies.map((reply) => (
                                    <div key={reply.replyId} className="reply">
                                        <div className="reply-header">
                                            <strong>{reply.replyUser}</strong>
                                            <span className="date">
                                                {new Date(reply.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="reply-text">{reply.reply}</p>
                                        <button
                                            className="like-button"
                                            onClick={() => handleLike("reply", reply.replyId)}
                                        >
                                            Like ({reply.replyLikes})
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Reply */}
                        {currentUser && (
                            <div>
                                <button
                                    className="reply-button"
                                    onClick={() => setReplyToCommentId(comment.commentId)}
                                >
                                    Reply
                                </button>
                                {replyToCommentId === comment.commentId && (
                                    <form
                                        onSubmit={(e) => handleReplySubmit(e, comment.commentId)}
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
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
