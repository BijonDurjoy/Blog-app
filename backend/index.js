import express from  "express";
import postRoutes from "./routes/posts.js"

const app = express();

app.use(express.json());
app.use('/api/posts', postRoutes);

//App listen
app.listen(8800,()=>{
    console.log("Server is running on port 8800");
})