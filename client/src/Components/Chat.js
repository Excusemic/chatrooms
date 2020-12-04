import React, { useState, useEffect, useRef } from "react"
import queryString from "query-string"
import io from "socket.io-client"
import { Link } from "react-router-dom"

const Chat = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [usersInRoom, setUsersInRoom] = useState([])
  const [myMessage, setMyMessage] = useState("")
  const [messages, setMessages] = useState([])
  const ENDPOINT = "https://kuzmic-chatrooms.herokuapp.com/"
  const socket = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (myMessage) {
      socket.current.emit("send_message", myMessage, () => setMyMessage(""))
    }
  }
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (e.shiftKey) {
        return
      } else {
        e.preventDefault()
        handleSubmit(e)
      }
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
      setMessages((prevState) => {
        return [...prevState, new_message]
      })
    })
    socket.current.on("room_data", ({ room, users }) => {
      setUsersInRoom(users)
    })
  }, [])
  return (
    <div className="chat-container">
      <div className="chat-content">
        <div className="chatbox">
          <div className="room-data">
            <h4>{room}</h4>
            <p>{usersInRoom.length} active</p>
            <Link to="/">
              <p className="exit">&#10006;</p>
            </Link>
          </div>
          <ul>
            {messages.map((message, index) => {
              return (
                <li key={index} className={message.user === name ? "myMessage" : "recievedMessage"}>
                  <h4>{message.user}:</h4>
                  <div dangerouslySetInnerHTML={{ __html: message.message }}></div>
                </li>
              )
            })}
          </ul>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Write message..."
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <input type="submit" value="send" />
          </form>
        </div>
      </div>
      <div className="info">
        <h2>Chat app made with Node, Express, React and Socket.io</h2>
        <p>Active users:</p>
        <ul>
          {usersInRoom.map((user) => {
            return <li key={user.id}>{user.name}</li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default Chat
