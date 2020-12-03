const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users")

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

const io = socketio(server, {
  cors: {
    origin: "*",
  },
})

io.on("connect", (socket) => {
  console.log("someone connected")
  socket.on("join", ({ name, room }, callback) => {
    const { newUser, error } = addUser({ name, room, id: socket.id })
    if (error) {
      return callback(error)
    } else {
      socket.join(newUser.room)
      socket.emit("message", { user: "Owl", message: `Welcome to ${newUser.room} room!` })

      socket.broadcast
        .to(newUser.room)
        .emit("message", { user: "Owl", message: `User ${newUser.name} just joined room!` })

      io.to(newUser.room).emit("room_data", {
        room: newUser.room,
        users: getUsersInRoom(newUser.room),
      })
    }
  })
  socket.on("send_message", (myMessage, callback) => {
    const user = getUser(socket.id)
    const message = myMessage
    io.to(user.room).emit("message", { user: user.name, message })

    callback()
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit("message", { user: "Owl", message: `${user.name} left the room` })
      io.to(user.room).emit("room_data", { room: user.room, users: getUsersInRoom(user.room) })
    }
  })
})

server.listen(PORT, () => console.log(`listening to port ${PORT}`))
