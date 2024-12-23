import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Add new tag
router.post('/', (req, res) => {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Tag name is required and must be a non-empty string.' });
    }

    // Check if tag already exists
    const checkQuery = 'SELECT * FROM tags WHERE name = ?';
    db.query(checkQuery, [name], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'Tag already exists' });
        }

        // Proceed to insert the new tag
        const query = "INSERT INTO tags (name) VALUES (?)";
        db.query(query, [name], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to add tag" });
            }
            res.status(200).json({ message: 'Tag added successfully' });
        });
    });
});

// Get all tags
router.get('/', (req, res) => {
    const query = 'SELECT * FROM tags';
    db.query(query, (err, tags) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch tags' });
        }
        res.status(200).json(tags);
    });
});

//Fetch tags for a specific post
router.get('/post/:postId', (req, res) => {
    const { postId } = req.params;
    const query = `
        SELECT t.name FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?;
    `;
    db.query(query, [postId], (err, tags) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch tags.' });
        res.status(200).json(tags);
    });
});

// Associate tags with a post
router.post('/associate', (req, res) => {
    const { postId, tagIds } = req.body;

    // Validate input
    if (!postId || !Array.isArray(tagIds) || tagIds.length === 0) {
        return res.status(400).json({ error: 'Post ID and tag IDs are required.' });
    }

    const values = tagIds.map(tagId => [postId, tagId]);
    const query = 'INSERT INTO post_tags (post_id, tag_id) VALUES ? ON DUPLICATE KEY UPDATE tag_id = tag_id'; // Prevent duplicates
    db.query(query, [values], (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json({ error: 'Failed to associate tags with the post' });
        }
        res.status(200).json({ message: 'Tags associated successfully' });
    });
});

//Fetch related post by tag
router.get('/related/:tagId', (req, res) => {
    const { tagId } = req.params;
    const query = `
        SELECT p.* FROM posts p
        JOIN post_tags pt ON p.id = pt.post_id
        WHERE pt.tag_id = ?;
    `;
    db.query(query, [tagId], (err, posts) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch related posts.' });
        res.status(200).json(posts);
    });
});

export default router;