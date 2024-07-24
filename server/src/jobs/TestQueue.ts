import {Job, Queue ,Worker} from 'bullmq'
import { defaultQueueConfig, redisConnection } from '../config/queue.js'

export const testQueueName = "test"

export const testQueue = new Queue(testQueueName ,{
    connection:redisConnection,
    defaultJobOptions:defaultQueueConfig
})

// * Workers
export const handler = new Worker(testQueueName ,async(job:Job) => {
console.log("The test queue data is" ,job?.data)
} ,{connection:redisConnection})