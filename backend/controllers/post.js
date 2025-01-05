import { db } from "../db.js"
import jwt from 'jsonwebtoken'

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data)
  })
}

export const getPost = (req, res) => {
  const q = "SELECT p.id, `username`, `title`, `des`, p.img, u.img AS userImg, `cat`, `date`, `views` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    // Increment the views count
    const updateViewsQuery = "UPDATE posts SET views = views + 1 WHERE id = ?";
    db.query(updateViewsQuery, [req.params.id], (err, result) => {
      if (err) return res.status(500).json(err);
    });

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO posts(`title`, `des`, `img`, `cat`, `date`, `uid`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.des,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      const postId = data.insertId; // Get the ID of the newly inserted post

      // Associate tags with the post
      if (req.body.tagIds && Array.isArray(req.body.tagIds) && req.body.tagIds.length > 0) {
        const tagAssociations = req.body.tagIds.map((tagId) => [postId, tagId]);
        const tagQuery = "INSERT INTO post_tags (post_id, tag_id) VALUES ?";
        db.query(tagQuery, [tagAssociations], (err) => {
          if (err) return res.status(500).json("Failed to associate tags with the post.");
          return res.json("Post and tags have been created successfully.");
        });
      } else {
        return res.json("Post has been created successfully, but no tags were associated.");
      }
    });
  });
};


export const deletePost = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) { return res.status(403).json("Token is not valid") }

    const postId = req.params.id
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?"

    db.query(q,[postId,userInfo.id], (err,data)=>{
      if(err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted");
    })
  })
};

export const updatePost = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const q = "UPDATE posts SET `title` = ?, `des` = ?, `img` = ?, `cat` = ? WHERE `id` = ? AND `uid` = ?";
    const values = [
      req.body.title,
      req.body.des,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      // Update tag associations
      if (req.body.tagIds && Array.isArray(req.body.tagIds)) {
        const deleteQuery = "DELETE FROM post_tags WHERE post_id = ?";
        db.query(deleteQuery, [postId], (err) => {
          if (err) return res.status(500).json("Failed to remove old tag associations.");

          const tagAssociations = req.body.tagIds.map((tagId) => [postId, tagId]);
          const insertQuery = "INSERT INTO post_tags (post_id, tag_id) VALUES ?";
          db.query(insertQuery, [tagAssociations], (err) => {
            if (err) return res.status(500).json("Failed to associate new tags with the post.");
            return res.json("Post and tags have been updated successfully.");
          });
        });
      } else {
        return res.json("Post has been updated successfully, but no tags were associated.");
      }
    });
  });
};
