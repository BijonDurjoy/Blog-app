import express from  "express";
import postRoutes from "./routes/posts.js"

const app = express();

app.use(express.json());
app.use("/api/posts", postRoutes)

//App listen
app.listen(4500,()=>{
    console.log("Connected");
})