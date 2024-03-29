import {
  createClient,
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts
} from 'redis';
import { env } from './environment.config'

export const redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
 = createClient<RedisModules, RedisFunctions, RedisScripts>({ url: env.REDIS_URL })