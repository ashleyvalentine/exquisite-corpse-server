const io = require('socket.io')(3050, {
  cors: {
    origin: ['http://localhost:5173']
  }
})

io.on('connection', (socket) => {
  const room = socket.handshake.query.room
  socket.join(room)
})
