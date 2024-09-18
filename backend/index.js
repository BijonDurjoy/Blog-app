import express from  "express";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cors from 'cors'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' // Replace this with the frontend's origin
}));

app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

//App listen
app.listen(4500,()=>{
    console.log("Connected");
})