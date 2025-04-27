import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const Chat = () => {


    const [ socket, setSocket ] = useState(null)


    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            withCredentials: true,
        })
        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])


    return (
        <div>Chat</div>
    )
}

export default Chat