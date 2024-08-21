import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectChatsById, useGetChatsQuery } from '../slices/chatApiSlice'
import { usePostMessageMutation } from '../slices/messagesApiSlice'
import { useEffect, useState } from 'react'
import { IoMdHand, IoIosSend } from 'react-icons/io'
import SyncLoader from 'react-spinners/SyncLoader'
import { toast } from 'react-toastify'
const Chat = () => {
    const { id } = useParams()
    const userId = useSelector(state => state.auth.userInfo?._id)
    // remember that getting all the data and using the select by id 
    // function is more optimal than doing a request to the backend when 
    // you are doing frequent calls; its optimal to do a request if you aren't
    // doing frequent calls
    const { data, isLoading: chatLoading, isError: chatError, isSuccess: chatSuccess } = useGetChatsQuery()
    const chat = useSelector(state => selectChatsById(state, id))
    const [sendMessage, { isLoading, isSuccess }] = usePostMessageMutation()
    const [chatMessages, setChatMessages] = useState([])
    const [postMessage, setPostMessage] = useState("")

    useEffect(() => {
        setChatMessages(chat?.messages)
    }, [chat?.messages])

    const handleMessage = e => {
        setPostMessage(e.target.value)
    }
    const handleSendMessage = async e => {
        e.preventDefault()
        // put any other input validation for the message input other than
        // the required tag. Look up proper input validation examples
        try {
            // put logic for sending a message; learn logic for socket io also
            const message = await sendMessage([postMessage, id]).unwrap()
            console.log(message)
            //if this works this should give me back a message object with the
            //message, senders id and chat id; i can use this to pass into an 
            //event of socket.io once its setup
        } catch(err){
            console.log(err.message)
            toast.error("Unable to send message. please refresh page and try again or try again later!")
        }
    }
    // if (chatError){
    //     toast.error("Unable to get chat; please refresh page or try again later!")
    //     // add error ui for display
    // }
    // if (chatLoading){
    //     return (
    //         <section className="chat-container">
    //             <div className="chatname loader">
    //                 <SyncLoader color="#ffffff" />
    //             </div>
    //             <div className="chat-messages loader">
    //                 <SyncLoader color="#ffffff" />
    //             </div>
    //             <form className="sendMessage-form">
    //                 <input disabled placeholder="Send a Message" type="text" onChange={handleMessage} value={postMessage} />
    //                 <button type="button"><IoIosSend /></button>
    //             </form>
    //             {/* create messages in the avengers chat so you can style them 
    //             and add the send messages form so you can send messages from there
    //             once you get that setup and styled you can start with socket.io */}
    
    //         </section>
    //     )
    // }
    // if (chatSuccess){
        return (
            <section className="chat-container">
                <div className="chatname">
                    <p>Chat: {chat?.name}</p>
                </div>
                <div className="chat-messages">
                    {chatMessages && chatMessages.map(message => <div key={message._id} className={userId===message.sender ? "senderMessage" : "receiverMessage"}>
                        <img src={chat.members.find(member => member._id===message.sender).profilePic}/>
                        <p>{message.message}</p>
                        <span>delivered</span>
                    </div>)}
                </div>
                <form onSubmit={handleSendMessage} className="sendMessage-form">
                    <input required placeholder="Send a Message" type="text" onChange={handleMessage} value={postMessage} />
                    <button type="submit"><IoIosSend /></button>
                </form>
            </section>
        )
    // }  
}

export default Chat