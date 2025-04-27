import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './Chat.css'

const Chat = () => {


    const [ socket, setSocket ] = useState(null)
    const [ messages, setMessages ] = useState([])
    const [ input, setInput ] = useState('')


    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            withCredentials: true,
        })

        newSocket.on('message', (message) => {
            setMessages((prevMessages) => [ ...prevMessages, {
                role: 'assistant',
                content: message
            } ])
        })
        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    function sendMessage() {
        if (input.trim() === '') return

        const newMessage = {
            role: 'user',
            content: input
        }

        setMessages((prevMessages) => [ ...prevMessages, newMessage ])
        setInput('')

        socket.emit('message', { message: input })


    }

    return (
        <main className='chat-main' >
            <section className="chat-section">
                <div className="conversation-area">
                    <div className="messages">
                        {
                            messages.map((message, index) => (
                                <div key={index} className={`message ${message.role}`}>
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="input-area">
                        <input type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage()
                                }
                            }}
                        />
                        <button onClick={() => { sendMessage() }}>Send</button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Chat