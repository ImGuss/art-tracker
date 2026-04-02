import express from 'express'
import cookieParser from 'cookie-parser'

// routers
import { artistRouter } from './routes/artistRoutes.js'
import { artworkRouter } from './routes/artworkRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { museumRouter } from './routes/museumRoutes.js'
import { collectionRouter } from './routes/collectionRoutes.js'
import { visitRouter } from './routes/visitRoutes.js'

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
app.use('/api/collections', collectionRouter)
app.use('/api/visits', visitRouter)

// error middleware
app.use(errorHandler)

export default app