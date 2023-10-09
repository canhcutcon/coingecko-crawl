import { Redis } from 'ioredis'
import dayjs from 'dayjs'
import { Logging } from '../lib'
import AppConfig from '../config'

// 1h
const DEFAULT_EXPIRY_TIME = 60 * 60

const isUseHost = !!AppConfig.redis.host

const RedisClient = new Redis(
    isUseHost
        ? {
            host: AppConfig.redis.host || undefined,
            port: AppConfig.redis.port || undefined,
            password: AppConfig.redis.password || undefined,
        }
        : undefined
)

export default class CacheService {
    static getRedisInstance() {
        return RedisClient
    }

    static createKey(key: string) {
        return `${AppConfig.redis.prefix}::${key}`?.toLowerCase()
    }

    static async bootstrap() {
        await this.clearAllCache()
        // await Promise.all([TokenService.loadCache(), ChainService.loadCache(), AppService.loadCache()])
    }

    static async clearAllCache() {
        const keys = await RedisClient.keys(`${AppConfig.redis.prefix}:*`.toLowerCase())
        if (keys.length > 0) {
            await RedisClient.del(...keys)
            Logging.log('Cleared all cache')
        }
    }

    static update(key: string, value: any) {
        const cacheKey = this.createKey(key)
        RedisClient.del(cacheKey)
        return RedisClient.set(cacheKey, value, 'NX')
    }

    static set(key: string, value: any, expiry: number = DEFAULT_EXPIRY_TIME) {
        const redisKey = this.createKey(key)
        Logging.log(`Load cache ${redisKey} at ${dayjs(new Date()).format('DD-MM hh:mm:ss')}`)
        return RedisClient.set(redisKey, JSON.stringify(value), 'EX', expiry)
    }

    static async get(key: string) {
        const data = await RedisClient.get(this.createKey(key))
        return JSON.parse(data)
    }

    static remove(key: string) {
        return RedisClient.del(this.createKey(key))
    }
}
