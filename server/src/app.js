import express from 'express'
import { artistRouter } from './routes/artistRoutes.js'

const app = express()

app.use(express.json())

app.use('/api/artists', artistRouter)

export default app