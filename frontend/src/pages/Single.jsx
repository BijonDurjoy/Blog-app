import React, { useContext, useEffect, useState } from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from "moment"
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
        setPosts(res.data);
      } catch {
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
        <img src="https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D" alt="Cover" />
        <div className="user">
          <img src="https://cdn.pixabay.com/photo/2020/09/18/22/05/man-5583034_640.jpg" alt="userpic" />
          <div className="info">
            <span>{post?.username}</span>
            <span>Cody Roads</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`}>
                <img src={Edit} alt="edit logo" />
              </Link>
              <img src={Delete} alt="delete logo" />
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