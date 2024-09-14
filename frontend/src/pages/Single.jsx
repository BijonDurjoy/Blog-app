import React from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link } from 'react-router-dom';

const Single = () => {
  return (
    <div className='single'>
      <div className="content">
        <img src="https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D" alt="Cover" />
        <div className="user">
          <img src="https://cdn.pixabay.com/photo/2020/09/18/22/05/man-5583034_640.jpg" alt="userpic" />
          <div className="info">
            <span>Cody Roads</span>
            <p>Posted 2 days ago</p>
          </div>
          <div className="edit">
            <Link to={`/write?edit=2`}>
              <img src={Edit} alt="edit logo" />
            </Link>
            <img src={Delete} alt="delete logo" />
          </div>
        </div>
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod non quibusdam commodi eaque libero repellat cumque molestiae illum, culpa ab?</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis laborum neque blanditiis optio. Temporibus iure minima repellat cumque blanditiis dignissimos, amet laboriosam vitae eius recusandae at veritatis corrupti eaque eos perferendis libero enim quod consequuntur atque magnam necessitatibus rem numquam! Earum, blanditiis quas quam minima maiores id culpa eaque, at excepturi architecto, voluptatibus nulla modi! <br />Doloremque laudantium vero error sint saepe iste recusandae tenetur nam reprehenderit porro tempore quod fugiat, facilis eligendi possimus, facere expedita velit molestias in libero ex numquam illo eveniet! Accusamus, exercitationem iure deserunt sed tenetur facere nesciunt voluptate ad officia ratione odio est modi aliquam alias sapiente laboriosam tempora blanditiis! Distinctio, molestiae. Suscipit non doloremque tempora nesciunt velit et assumenda fugiat alias totam nihil quos repudiandae ipsam perferendis mollitia laboriosam minus, dolorem asperiores eos accusamus sunt nobis, veniam nisi? Laudantium, repudiandae. Mollitia, deleniti! Blanditiis nemo eveniet architecto, quam ea rerum corrupti totam quibusdam culpa cupiditate illum?</p>
      </div>
      
    </div>
  )
}

export default Single