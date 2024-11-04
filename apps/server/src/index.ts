import express from 'express'
import dotenv from 'dotenv'
import appRouter from './routes/appV1.router'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1', appRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`)
})