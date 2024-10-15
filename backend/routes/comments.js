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
router.post ('/reply', (req,res) =>{
    const { commentId, userId, reply } = req.body;
    const query = 'INSERT INTO replies (comment_id,user_id,reply) VALUES(?,?,?)';
    db.query(query, [commentId, userId, reply], (err, result) => {
        if(err){
            return res.status(500).json({error: 'Failed to add reply'});
        }
        res.status(200).json({message: 'Reply added successfully'});
    });
});

//Get all comments and replies for a post
router.get('/:postId', (req,res) =>{
    const {postId} = req.params;
    const commentQuery = `SELECT c.id AS commentId, c.comment, c.created_at, u.username,
                          r.id AS replyId, r.reply, r.created_at AS reply_created_at, ru.username AS replyUser
                          FROM comments c
                          LEFT JOIN users u ON c.user_id = u.id
                          LEFT JOIN replies r ON r.comment_id = c.id
                          LEFT JOIN users ru ON r.user_id = ru.id
                          WHERE c.post_id = ?`;

    db.query(commentQuery, [postId], (err,result) =>{
        if(err){
            return res.status(500).json({error: 'Failed to fetch comments'});
        }
        res.status(200).json(result);
    });
});

export default router;