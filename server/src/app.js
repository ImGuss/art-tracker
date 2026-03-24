import express from 'express'
import { artistRouter } from './routes/artistRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

app.use('/api/artists', artistRouter)

app.use(errorHandler)

export default app