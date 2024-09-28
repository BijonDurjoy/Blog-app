import express from  "express";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cors from 'cors'
import cookieParser from "cookie-parser";
import multer from "multer"
import path from  "path";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' // Replace this with the frontend's origin
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ path.extname(file.originalname)) //ensure the file extension
    }
  })
const upload = multer({ storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    const fileUrl = `http://localhost:4500/upload/${file.filename}`;
    res.status(200).json(fileUrl); //send back to the full url
  })

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

//App listen
app.listen(4500,()=>{
    console.log("Connected to the server at 4500");
})