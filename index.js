const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const adminRoutes = require('./routes/admin/adminRoutes')
const userRoutes = require('./routes/user/userRoutes')

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' })
})

app.use('/admin', adminRoutes)
app.use('/user', userRoutes)

async function startdb() {
  const mongoUri = process.env.MONGODB_URI || process.env.Mongodb_URI

  if (!mongoUri) {
    console.error('Missing MongoDB URI in environment variables.')
    process.exit(1)
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('db connected successfully!')

    const PORT = process.env.PORT || 5001
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error occurred while connecting to db:', error.message)
    process.exit(1)
  }
}

startdb()