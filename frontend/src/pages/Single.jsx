import React, { useContext, useEffect, useState } from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Single = () => {
  const [post, setPost] = useState({})

  const location = useLocation()

  const postId = location.pathname.split("/")[2]

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:4500/api/posts/${postId}`)
        setPost(res.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, [postId]);

  return (
    <div className='single'>
      <div className="content">
        <img
          src={post?.img}
          alt=''
        />
        <div className="user">
          <img src={post.userImg}/>
          <div className="info">
            <span>{post?.username}</span>
            <p>Posted 2 days ago</p>
          </div>
          {currentUser?.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`}>
                <img src={Edit} alt="" />
              </Link>
              <img src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        {post.des}
      </div>

    </div>
  )
}

export default Single