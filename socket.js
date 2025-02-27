import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import http from 'http'
const app = express()
app.use(cors())
app.use(express.json())

const httpServer = http.createServer()

console.log('hi there')

const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

io.on('connection', (socket) => {
    console.log('Connected')
    socket.on('addQuestion', async ({ questions, contestId }) => {
        try{
            const res = await axios.post(`${process.env.BACKEND}/api/updateContest`, { questions, contestId })
            if(!(res.status === 200)){
                socket.emit('error', { message: 'Failed to add question' })
            }
            socket.emit('success', { questions })
        } catch (error){
            console.log('Error in add Question socket', error)
            socket.emit('error', { message: 'Unexpected error' })
        }
    })
})

httpServer.listen(4000, () => {
    console.log("WebSocket server running on port 4000");
});