const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

let roomsAmount = 0;

type Point = { x: number; y: number }

type DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

io.on('connection', (socket) => {
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state')
  })

  socket.on('canvas-state', (state) => {
    console.log('received canvas state')
    socket.broadcast.emit('canvas-state-from-server', state)
  })

  socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
  })

  socket.on('clear', () => io.emit('clear'))

//adds new lines

  //send a message to the client
  socket.broadcast.emit("hello", roomsAmount)

  // recieve a message from the client
  socket.on("howdy", (arg) => {
    console.log(arg);
    if(arg !== 0 && roomsAmount !== arg)
    {
      roomsAmount++;
    }

    socket.broadcast.emit("hello", roomsAmount)
    socket.emit("hello", roomsAmount)
  })

})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
