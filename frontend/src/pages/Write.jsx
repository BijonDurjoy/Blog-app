import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const Write = () => {
  const navigate = useNavigate();
  const state = useLocation().state;
  const [value, setValue] = useState(state?.des || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [tags, setTags] = useState([]); // All tags fetched from backend
  const [selectedTags, setSelectedTags] = useState([]); // Tags selected by the user
  const [newTag, setNewTag] = useState(''); // New tag name
  const [loading, setLoading] = useState(false); // Loading state for adding tags

  // To retrieve the token
  const token = localStorage.getItem("access_token");

  // Fetch available tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:4500/api/tags");
        setTags(res.data);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  const upload = async () => {
    if (!file) return ""; 
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:4500/api/upload", formData);
      return res.data.url; 
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      if (state) {
        await axios.put(`http://localhost:4500/api/posts/${state.id}`, {
          title,
          des: value,
          cat,
          img: imgUrl,
          tagIds: selectedTags, // Include selected tags
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      } else {
        await axios.post(`http://localhost:4500/api/posts`, {
          title,
          des: value,
          cat,
          img: imgUrl,
          tagIds: selectedTags, // Include selected tags
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTagSelection = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return alert('Tag name cannot be empty.');
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4500/api/tags", { name: newTag });
      setTags([...tags, res.data]); // Update tag list with the new tag
      setNewTag(''); // Clear the input box
    } catch (err) {
      console.error("Error adding new tag:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input 
          type="text" 
          value={title} 
          placeholder='Title' 
          onChange={e => setTitle(e.target.value)} 
        />
        <div className="editorContainer">
          <ReactQuill 
            className='editor' 
            theme="snow" 
            value={value} 
            onChange={setValue} 
          />
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
          <input 
            style={{ display: "none" }} 
            type="file" 
            id='file' 
            onChange={e => setFile(e.target.files[0])} 
          />
          <label className='file' htmlFor="file">Upload Image</label>
          <div className="buttons">
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          {["art", "movie", "sport", "food", "culture"].map(category => (
            <div className="cat" key={category}>
              <input 
                type="radio" 
                checked={cat === category} 
                name="cat" 
                id={category} 
                value={category} 
                onChange={e => setCat(e.target.value)} 
              />
              <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
            </div>
          ))}
        </div>
        <div className="item">
          <h1>Tags</h1>
          <div className="tags">
            {tags.map((tag) => (
              <label key={tag.id}>
                <input
                  type="checkbox"
                  value={tag.id}
                  onChange={() => handleTagSelection(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
          <div className="new-tag">
            <input
              type="text"
              placeholder="Add new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button onClick={handleAddTag} disabled={loading}>
              {loading ? "Adding..." : "Add Tag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
