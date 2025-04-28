import { Redis } from 'ioredis';



const redis = new Redis({})



redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on("ready", () => {
    console.log("Redis is ready");
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});


export const appendMessage = async (key, messageData) => {
    await redis.rpush(key, JSON.stringify(messageData))
}

export const getMessages = async (key) => {
    const messages = await redis.lrange(key, 0, -1);
    return messages.map((message) => {
        const tempMessage = JSON.parse(message)
        return {
            role: tempMessage.role,
            parts: [ {
                text: tempMessage.content,
            } ]
        }
    });
}

export default redis;