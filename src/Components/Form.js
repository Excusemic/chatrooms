import React, { useState } from "react"
import { Link } from "react-router-dom"

const Form = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  return (
    <div className="signin-content">
      <h3>Join</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room"
      />
      <Link
        onClick={(e) => (!name || !room ? e.preventDefault() : null)}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button type="submit" value="Enter" className="primary-btn">
          Sign in
        </button>
      </Link>
    </div>
  )
}

export default Form
