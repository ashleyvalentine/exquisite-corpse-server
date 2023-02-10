const io = require('socket.io')(3050, {
  cors: {
    origin: ['http://localhost:5173']
  }
})
const { addUser, getUser, deleteUser, getUsers } = require('./users')

io.on('connection', (socket) => {
  socket.on('add-user', ({ userName, userRoom }, callback) => {
    const { error, user } = addUser(socket.id, userName, userRoom)

    console.log(user)

    if (error) return callback(error)

    socket.join(user.room)

    io.to(user.room).emit('room-data', {
      room: user.room,
      userData: getUsers(user.room)
    })

    return callback(error)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
    const user = deleteUser(socket.id)

    if (user) {
      io.to(user.room).emit('room-data', {
        room: user.room,
        userData: getUsers(user.room)
      })
    }
  })
})
