import { createClient } from 'redis'

export const rdb =  await createClient()
    .on('error', err => { console.error('Redis error', err) })
    .connect()