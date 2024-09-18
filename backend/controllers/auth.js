import { db } from "../db.js"
import bcrypt from 'bcryptjs'

export const register = (reg, res) => {
    //check existing user
    const q = "SELECT * FROM users WHERE email=? OR username =?"
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.status(500).send(err);
        if (data.length) return res.status(409).json("User already exists");

        //Hash pass and create user
        const salt = bcrypt.genSaltSync(10);
        const  hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]

        db.query(q,[values],(err,data) =>{
            if(err) return res.json(err);
            res.status(200).json("User create successfully")
        })
    })
}
export const login = (reg, res) => {

}
export const logout = (reg, res) => {

}