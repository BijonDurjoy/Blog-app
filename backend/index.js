import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();

// __dirname এর জন্য
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS সেটআপ
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// মুলটার স্টোরেজ সেটআপ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../frontend/public/upload'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // ফাইল এক্সটেনশন নিশ্চিত করা
    }
});
const upload = multer({ storage });

// ইমেজ আপলোড রুট
app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:4500/upload/${file.filename}`;
    res.status(200).json({ url: fileUrl }); // send back as object
});

// স্ট্যাটিক ফাইল সার্ভ করা
app.use('/upload', express.static(path.join(__dirname, '../frontend/public/upload')));

// অন্যান্য মিডলওয়্যার
app.use(express.json());
app.use(cookieParser());

// রাউট সেটআপ
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// সার্ভার লিসেন
app.listen(4500, () => {
    console.log("Connected to the server at 4500");
});
