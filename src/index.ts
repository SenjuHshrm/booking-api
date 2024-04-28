import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { join, resolve } from 'path'
import passport from 'passport';
import { Server } from 'socket.io'
import { createServer } from 'http';
import { RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import { instrument } from '@socket.io/admin-ui';

import { dbConfig, env, port, redisClient } from './config'
import { header } from './middleware'
import { IO } from './socket/io'
import { Routes } from './routes';

declare global {
  var appRoot: string;
  var io: Server;
}

const app: Express = express()
const httpServer = createServer(app)
const io: Server = new Server(httpServer, {
  cors: {
    origin: env.ORIGIN,
    credentials: true
  }
})
const pubClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> = <RedisClientType<RedisModules, RedisFunctions, RedisScripts>>(redisClient)
IO(io)

globalThis.appRoot = <string>resolve(__dirname)
globalThis.io = io

app.set('port', port(env.NODE_ENV))
app.use(morgan('dev'))
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ limit: '500mb', extended: true }))
app.use(express.static(join(__dirname, 'uploads')))
app.use(express.static(join(__dirname, 'app')))
app.use(cors({
  origin: env.ORIGIN,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(passport.initialize())
import './config/passport.config'

app.use(header)
app.use('/api/', Routes)
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '/app/index.html'))
})

httpServer.listen(app.get('port'), () => {
  dbConfig()
  pubClient.connect()
  redisClient.flushAll()
  // task(io)
  instrument(io, {
    auth: {
      type: 'basic',
      username: env.SIO_ADMIN_USERNAME,
      password: env.SIO_ADMIN_PASSWORD
    }
  })
  console.log(`App running on PORT ${app.get('port')}`)
})