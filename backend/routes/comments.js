import express from 'express';
const router = express.Router();
import { db } from "../db.js"

//Add comment for a post 
router.post('/add', (req, res) => {
    const { postId, userId, comment } = req.body;
    const query = 'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)';
    db.query(query, [postId, userId, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add comment' });
        }
        res.status(200).json({ message: 'Comment added successfully' });
    });
});

//Add a reply to comment 
router.post('/reply', (req, res) => {
    const { commentId, userId, reply } = req.body;
    const query = 'INSERT INTO replies (comment_id,user_id,reply) VALUES(?,?,?)';
    db.query(query, [commentId, userId, reply], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add reply' });
        }
        res.status(200).json({ message: 'Reply added successfully' });
    });
});

// Like a comment
router.post('/like/comment/:commentId', (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const query = 'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)';
    db.query(query, [commentId, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'You have already liked this comment.' });
            }
            return res.status(500).json({ error: 'Failed to like the comment.' });
        }
        res.status(200).json({ message: 'Comment liked successfully.', commentId });
    });
});

// Like a reply
router.post('/like/reply/:replyId', (req, res) => {
    const { replyId } = req.params;
    const { userId } = req.body;

    const query = 'INSERT INTO reply_likes (reply_id, user_id) VALUES (?, ?)';
    db.query(query, [replyId, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'You have already liked this reply.' });
            }
            return res.status(500).json({ error: 'Failed to like the reply.' });
        }
        res.status(200).json({ message: 'Reply liked successfully.', replyId });
    });
});


// Get all comments and replies for a post with like count
router.get('/:postId', (req, res) => {
    const { postId } = req.params;

    const commentQuery = `
        SELECT 
            c.id AS commentId, c.comment, c.created_at, u.username,
            (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) AS commentLikes
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC;
    `;

    const replyQuery = `
    SELECT 
        r.id AS replyId, r.reply, r.comment_id, r.created_at, ru.username AS replyUser ,
        (SELECT COUNT(*) FROM reply_likes rl WHERE rl.reply_id = r.id) AS replyLikes
    FROM replies r
    LEFT JOIN users ru ON r.user_id = ru.id;
`;

    db.query(commentQuery, [postId], (err, comments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch comments.' });
        }

        db.query(replyQuery, (err, replies) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch replies.' });
            }

            // Map replies to their respective comments
            const commentsWithReplies = comments.map((comment) => ({
                ...comment,
                replies: replies.filter(reply => reply.comment_id === comment.commentId),
            }));

            res.status(200).json(commentsWithReplies);
        });
    });
});


export default router;