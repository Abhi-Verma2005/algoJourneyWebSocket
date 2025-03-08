import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import http from 'http'
import dotenv from 'dotenv';
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())

const httpServer = http.createServer()


const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

const BACKEND_URL = process.env.BACKEND || 'http://your-backend-url';

io.on('connection', (socket) => {
    console.log('Connected')
    socket.on('addQuestion', async ({ q, contestId }) => {
        try{
            const question = {
                questionId: q.id,
                question: q
            }

            const res = await axios.post(`${BACKEND_URL}/api/realTimeAddQuestion`, { questions: [question], contestId })
            // console.log(res)
            if(!(res.status === 200)){
                socket.emit('error', { message: 'Failed to add question' })
            }
            const questions = res.data
            console.log(questions)
            io.emit('contestUpdate', { questions })
        } catch (error){
            console.log('Error in add Question socket', error)
            socket.emit('error', { message: 'Unexpected error' })
        }
    })
})

httpServer.listen(4000, () => {
    console.log("WebSocket server running on port 4000");
});