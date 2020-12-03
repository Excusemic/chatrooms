import React, { useState, useEffect, useRef } from "react"
import queryString from "query-string"
import io from "socket.io-client"

const Chat = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [usersInRoom, setUsersInRoom] = useState([])
  const [myMessage, setMyMessage] = useState("")
  const [messages, setMessages] = useState([])
  const ENDPOINT = "http://localhost:5000/"
  const socket = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (myMessage) {
      socket.current.emit("send_message", myMessage, () => setMyMessage(""))
    }
  }
  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search)
    setName(name)
    setRoom(room)
    socket.current = io(ENDPOINT)
    socket.current.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error)
      }
    })
    const cleanup = () => {
      socket.current.disconnect()
    }

    return () => {
      cleanup()
    }
  }, [ENDPOINT])
  useEffect(() => {
    socket.current.on("message", ({ user, message }) => {
      const new_message = { user, message }
      console.log(new_message)
      setMessages((prevState) => {
        return [...prevState, new_message]
      })
    })
    socket.current.on("room_data", ({ room, users }) => {
      setUsersInRoom(users)
    })
  }, [])
  return (
    <div>
      <div className="chatbox">
        <ul>
          {messages.map((message, index) => {
            return (
              <li key={index}>
                <h4>{message.user}</h4>
                <p>{message.message}</p>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="room-data">
        Users in room:
        <ul>
          {usersInRoom.map((user) => {
            return <li key={user.id}>{user.name}</li>
          })}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={myMessage} onChange={(e) => setMyMessage(e.target.value)} />
        <input type="submit" value="send" />
      </form>
    </div>
  )
}

export default Chat
