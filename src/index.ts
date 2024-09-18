import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { join, resolve } from 'path'
import passport from 'passport';
import { Server } from 'socket.io'
import { createShardedAdapter, createAdapter } from '@socket.io/redis-adapter'
import { createServer } from 'http';
import { RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import { instrument } from '@socket.io/admin-ui';
import { checkBookingArrivals } from './tasks';
import { dbConfig, env, port, redisClient, csrf } from './config'
import { header } from './middleware'
import IO from './socket/io'
import { Routes } from './routes';
import cookieParser from 'cookie-parser';

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
  },
  maxHttpBufferSize: 1e8
})
const pubClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> = <RedisClientType<RedisModules, RedisFunctions, RedisScripts>>(redisClient)
const subClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> = <RedisClientType<RedisModules, RedisFunctions, RedisScripts>>pubClient.duplicate()
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient))
})
IO(io)

globalThis.appRoot = <string>resolve(__dirname)
globalThis.io = io

const bodyParser = express.json({ limit: '500mb' })

app.set('port', port(env.NODE_ENV))
app.use(morgan('dev'))
app.use(bodyParser)
app.use(express.urlencoded({ limit: '500mb', extended: false }))
app.use(express.static(join(__dirname, 'uploads')))
app.use(express.static(join(__dirname, 'app')))
app.use(cors({
  origin: env.ORIGIN,
  allowedHeaders: ['Authorization', 'Content-Type', env.CSRF_HEADER_NAME],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// let getSec: CsrfSecretRetriever = <CsrfSecretRetriever>((req: Request) => req.secret)

// const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
//   getSecret: getSec,
//   // secret: env.CSRF_SECRET,
//   cookieName: env.CSRF_COOKIE_NAME,
//   cookieOptions: { sameSite: true, secure: true, signed: true },
//   ignoredMethods: [ "GET", "HEAD", "OPTIONS" ],
//   getTokenFromRequest: (req: Request) => <string>req.headers[env.CSRF_COOKIE_NAME]
// })


app.use(passport.initialize())
import './config/passport.config'

checkBookingArrivals()

app.use(cookieParser(env.COOKIE_SECRET))
app.use(header)
app.all('*', bodyParser, (req: Request, res: Response, next: NextFunction) => {
  console.log(
    'req.secret: ', req.secret, '\n',
    'req.path: ', req.path, '\n',
    'req.headers: ', req.headers, '\n',
    'req.body: ', req.body
  )
  next()
})

app.get('/token', (req: Request, res: Response) => {
  // res.setHeader('Set-Cookie', `${env.CSRF_COOKIE_NAME}=${csrf.generateToken(req, res)}; Path=/; SameSite=None; Domain=localhost:3000`)
  
  // csrf.generateToken(req, res, true, true)
  let token = <string>csrf.generateToken(req, res)
  // res.cookie(env.CSRF_COOKIE_NAME, token, { secure: true, httpOnly: false, sameSite: 'none', domain: 'localhost' })
  res.json({
    token
  })
})

app.use('/api/', Routes)
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '/app/index.html'))
})

httpServer.listen(app.get('port'), () => {
  dbConfig()
  // pubClient.connect()
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