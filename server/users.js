let users = []

const addUser = ({ name, room, id }) => {
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  const userExists = users.filter((u) => u.name === name && u.room === room)
  if (userExists.length > 0) {
    return { error: `Username is taken` }
  }
  const newUser = { name, room, id }
  users.push(newUser)
  return { newUser }
}
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}
const getUser = (id) => users.find((user) => user.id === id)
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
