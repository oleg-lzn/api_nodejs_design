import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3006

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Server is Running',
    timestamp: new Date().toISOString(),
    service: 'Api Practice',
  })
})

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})

export default app
