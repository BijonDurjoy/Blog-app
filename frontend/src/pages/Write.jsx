import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from  'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from  'moment';

const Write = () => {
  const navigate = useNavigate();
  const state = useLocation().state;
  const [value, setValue] = useState(state?.des || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat ||"");

  //To retrive the token
  const token = localStorage.getItem("access_token");
  
  const upload = async () =>{
    try{
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:4500/api/upload",formData)
      return res.data
    }catch(err){
      console.log(err);
    }
  }
  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      if (state) {
        //Put request with token
        await axios.put(`http://localhost:4500/api/posts/${state.id}`, {
          title,
          des: value,
          cat,
          img: file ? imgUrl : "",
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // send token  in header
          }
        });
      } else {
        // post req with token
        await axios.post(`http://localhost:4500/api/posts`, {
          title,
          des: value,
          cat,
          img: file ? imgUrl : "",
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // send token in header
          }
        });
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  
  console.log(value);
  return (
    <div className="add">
      <div className="content">
        <input type="text" value={title} placeholder='Title' onChange={e=>setTitle(e.target.value)} />
        <div className="editorContainer">
          <ReactQuill className='editor' theme="snow" value={value} onChange={setValue} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input style={{display:"none"}} type="file" id='file' name='' onChange={e=>setFile(e.target.files[0])} />
          <label className='file' htmlFor="file">Upload Image</label>
          <div className="buttons">
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
          <input type="radio" checked={cat === "art"} name="cat" id="art" value="art" onChange={e=>setCat(e.target.value)} />
          <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
          <input type="radio" checked={cat === "movie"} name="cat" id="movie" value="movie" onChange={e=>setCat(e.target.value)} />
          <label htmlFor="movie">Movie</label>
          </div>
          <div className="cat">
          <input type="radio" checked={cat === "sport"} name="cat" id="sport" value="sport" onChange={e=>setCat(e.target.value)} />
          <label htmlFor="sport">Sport</label>
          </div>
          <div className="cat">
          <input type="radio" checked={cat === "food"} name="cat" id="food" value="food" onChange={e=>setCat(e.target.value)} />
          <label htmlFor="food">Food</label>
          </div>
          <div className="cat">
          <input type="radio" checked={cat === "culture"} name="cat" id="culture" value="culture" onChange={e=>setCat(e.target.value)} />
          <label htmlFor="culture">Culture</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;