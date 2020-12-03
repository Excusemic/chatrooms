import React, { useState } from "react"
import { Link } from "react-router-dom"

const Form = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  return (
    <div>
      <label htmlFor="name">Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="room">Room:</label>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
      <Link
        onClick={(e) => (!name || !room ? e.preventDefault() : null)}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button type="submit" value="Enter">
          Sign in
        </button>
      </Link>
    </div>
  )
}

export default Form
