import express from 'express'
import cookieParser from 'cookie-parser'

// routers
import { artistRouter } from './routes/artistRoutes.js'
import { artworkRouter } from './routes/artworkRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { museumRouter } from './routes/museumRoutes.js'

import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

// cookie middleware
app.use(cookieParser())

// routes
app.use('/api/auth', authRouter)
app.use('/api/artists', artistRouter)
app.use('/api/artworks', artworkRouter)
app.use('/api/museums', museumRouter)

// error middleware
app.use(errorHandler)

export default app