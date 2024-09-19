import express from 'express'
import {db} from  '../db.js'
import { login, logout, register } from '../controllers/auth.js'


const router = express.Router()

//For database testing purpose
router.get("/", (req,res) =>{
    const query = "SELECT * FROM users";

    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.status(200).json(data);
    });
})

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

export default router