import express from 'express'

// routers
import { artistRouter } from './routes/artistRoutes.js'
import { artworkRouter } from './routes/artworkRoutes.js'
import { authRouter } from './routes/authRoutes.js'

import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

// routes
app.use('/api/auth', authRouter)
app.use('/api/artists', artistRouter)
app.use('/api/artworks', artworkRouter)

// error middleware
app.use(errorHandler)

export default app