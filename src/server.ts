import express, { type Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import gameRoutes from './old/gameRoutes'
import { gameSessionRouter } from './game/publicGoodsGame/routes/gameSessionRoutes'
import morgan from 'morgan'
import * as admin from 'firebase-admin'
import { serviceAccount } from './config/firebase'
// import { authenticateUser } from './common/middleware/authenticate'

const server: Express = express()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// Configure middleware
server.use(cors({ origin: true }))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(fileUpload())
server.use(morgan('dev'))

// Include custom routes
server.use('/gamesession', gameSessionRouter)
server.use('/games', gameRoutes)

// Start the server
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 30167
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
