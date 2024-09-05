import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const userId = useSelector(state => state.auth.userInfo?._id)
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const socketio = io("http://localhost:5000", {
            query: {
                userId: userId
            }
        })
        setSocket(socketio)

        return () => {
            socketio.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}