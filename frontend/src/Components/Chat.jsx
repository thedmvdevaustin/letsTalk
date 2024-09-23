import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchInput from './SearchInput'
import { useLazySearchUserQuery } from '../slices/usersApiSlice'
import { selectChatsById, useGetChatsQuery, useAddMemberMutation, useRemoveMemberMutation, useRenameChatMutation } from '../slices/chatApiSlice'
import { usePostMessageMutation } from '../slices/messagesApiSlice'
import { useEffect, useState } from 'react'
import { IoMdHand, IoIosSend } from 'react-icons/io'
import SyncLoader from 'react-spinners/SyncLoader'
import { toast } from 'react-toastify'
import { useSocket } from '../Context/SocketContext'
import { FaRegEdit } from "react-icons/fa"
import { FcCancel } from "react-icons/fc"
import { IoIosArrowDropdown, IoIosInformationCircleOutline, IoIosArrowDropright, IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline, IoClose } from "react-icons/io5"

const Chat = () => {
    const socket = useSocket()
    const { id } = useParams()
    const user = useSelector(state => state.auth?.userInfo)
    const userId = user?._id
    // const userId = useSelector(state => state.auth.userInfo?._id)
    // remember that getting all the data and using the select by id 
    // function is more optimal than doing a request to the backend when 
    // you are doing frequent calls; its optimal to do a request if you aren't
    // doing frequent calls
    const { data, isLoading: chatLoading, isError: chatError, isSuccess: chatSuccess } = useGetChatsQuery()
    const chat = useSelector(state => selectChatsById(state, id))
    const [sendMessage, { isLoading, isSuccess }] = usePostMessageMutation()
    const [addMember, {isLoading: addMemberLoading }] = useAddMemberMutation()
    const [removeMember, { isLoading: removeMemberLoading }] = useRemoveMemberMutation()
    const [renameChat, { isLoading: renameChatLoading }] = useRenameChatMutation()
    const [searchUser, { data: searchUserData, isLoading: searchUserLoading, isError, error }] = useLazySearchUserQuery()
    const [chatMessages, setChatMessages] = useState([])
    const [postMessage, setPostMessage] = useState("")
    const [search, setSearch] = useState("")
    const [infoPageToggle, setInfoPageToggle] = useState(false)
    const [extraInfoToggle, setExtraInfoToggle] = useState(true)
    const [editNameToggle, setEditNameToggle] = useState(false)
    const [addContactToggle, setAddContactToggle] = useState(false)
    const [newChatName, setNewChatName] = useState(chat ? chat.name : "")

    useEffect(() => {
        setChatMessages(chat?.messages)
    }, [chat?.messages])

    const handleMessage = e => {
        setPostMessage(e.target.value)
    }

    const handleInfoPageToggle = () => {
        setInfoPageToggle(!infoPageToggle)
    }

    const handleExtraInfoToggle = () => {
        setExtraInfoToggle(!extraInfoToggle)
    }

    const handleEditNameToggle = () => {
        setEditNameToggle(!editNameToggle)
    }

    const handleNewChatName = e => {
        setNewChatName(e.target.value)
    }

    const handleAddMember = () => {
            setAddContactToggle(true)
        }

    const handleSendMessage = async e => {
        e.preventDefault()
        // put any other input validation for the message input other than
        // the required tag. Look up proper input validation examples
        try {
            // put logic for sending a message; learn logic for socket io also
            const message = await sendMessage([postMessage, id]).unwrap()
            if (chat?.isGroupChat){
                socket?.emit("send_message", { message, isGroupChat: chat?.isGroupChat })
            } else {
                const receiver = chat?.members.find(member => member._id!==userId)
                socket?.emit("send_message", { message, isGroupChat: chat?.isGroupChat, receiverId: receiver._id })
            }

            setPostMessage("")

            //if this works this should give me back a message object with the
            //message, senders id and chat id; i can use this to pass into an 
            //event of socket.io once its setup
        } catch(err){
            console.log(err.message)
            toast.error("Unable to send message. please refresh page and try again or try again later!")
        }
    }

    const handleSearch = e => {
        e.stopPropagation()
        const searchWord = e.target.value
        setSearch(prev => prev=searchWord)
        setTimeout( async () => {
            try {
                const user = await searchUser(search)
            } catch(err){
                console.log(err)
                toast.error("Unable to find user")
            }
        }, 300)
    }

    const addMembers = async (newUser) => {
        try {
            await addMember({ members: [newUser._id], id })
            setSearch("")
            setAddContactToggle(false)
        } catch(err) {
            console.log(err)
            toast.error("cannot add user. please refresh page and try again!")
        }
    }

    const handleRemoveUser = async (user) => {
        try {
            await removeMember({ member: user, id })
        } catch(err) {
            console.log(err)
            toast.error("cannot remove user, please refresh and try again!")
        }
    }

    const handleRenameChat = async e => {
            try {
                const newChat = await renameChat({ name: newChatName, id }).unwrap()
                setNewChatName(prev => prev=newChat.name)
                handleEditNameToggle()
            } catch(err){
                console.log(err)
                toast.error("unable to rename pleae refresh and try again!")
            }

        }
        
    const handleDiscardChanges = () => {
        setNewChatName(chat ? chat.name : "")
        handleEditNameToggle()
    }

    useEffect(() => {
        socket?.emit("join_room", {chatId: chat?._id, isGroupChat: chat?.isGroupChat})
    }, [])

    useEffect(() => {
        socket?.on("new_message", newMessage => {
            console.log(newMessage)
            setChatMessages([...chatMessages, newMessage])
        })
        socket?.on("messageForSender", newMessage => {
            console.log(newMessage)
            setChatMessages(prevMessages => [...prevMessages, newMessage])
        })

        return () => {
            socket?.off("messageForSender")
            socket?.off("new_message")
        }
    }, [handleSendMessage])


    if (chatMessages?.length===0) {
        return (
            <section className="chat-container">
                <div className="chatname">
                    <span>Chat: {chat?.name}</span>
                    <span><IoIosInformationCircleOutline /></span>
                </div>
                <section className="noMessageDisplay-container">
                    <p>No messages yet!</p>
                    <p>Send a message!</p>
                </section>
                <form onSubmit={handleSendMessage} className="sendMessage-form">
                    <input required placeholder="Send a Message" type="text" onChange={handleMessage} value={postMessage} />
                    <button type="submit"><IoIosSend /></button>
                </form>
            </section>
        )
    }

    if (chatError){
        toast.error("Unable to get chat; please refresh page or try again later!")
        // add error ui for display
    }
    if (chatLoading){
        return (
            <section className="chat-container">
                <div className="chatname loader">
                    <SyncLoader color="#ffffff" />
                </div>
                <div className="chat-messages loader">
                    <SyncLoader color="#ffffff" />
                </div>
                <form className="sendMessage-form">
                    <input disabled placeholder="Send a Message" type="text" onChange={handleMessage} value={postMessage} />
                    <button type="button"><IoIosSend /></button>
                </form>
                {/* create messages in the avengers chat so you can style them 
                and add the send messages form so you can send messages from there
                once you get that setup and styled you can start with socket.io */}
    
            </section>
        )
    }

    if (chatSuccess && chatMessages){
        return (
            <section className="chat-container">
                <div className="chatname">
                    <span>Chat: {chat?.name}</span>
                    <span onClick={handleInfoPageToggle}><IoIosInformationCircleOutline /></span>
                </div>
                {infoPageToggle && 
                <div className="infoPage-container">
                    <div className="infoPage-chatname">
                        {!editNameToggle && 
                            <>
                                <h4>{chat?.name}</h4>
                                <span onClick={handleEditNameToggle}><FaRegEdit /></span>
                            </>
                        }
                        {editNameToggle && 
                            <>
                                <div className="editChatName-container">
                                    <input type="text" value={newChatName} onChange={handleNewChatName} />
                                    <span onClick={e => setNewChatName("")}><IoClose /></span>
                                </div>
                                <div className="editChatName-btns">
                                    <span data-tool-tip="Discard Changes" onClick={handleDiscardChanges}><FcCancel /></span>
                                    <span data-tool-tip="Rename" onClick={handleRenameChat}><IoCheckmarkDoneCircleOutline /></span>
                                </div>
                            </>
                        }
                    </div>
                    <div className="infoPage-dropdown-container">
                        <div className="infoPage-dropdown">
                            <div className="members">
                                <h4>{chat.members.length} People </h4>
                                {chat.members.map((member, index) => {
                                    if (member._id===userId){
                                        return
                                    }
                                    if (index===chat.members.length-1){
                                        return <span key={member._id}>{member.firstName}</span>
                                    } else {
                                        return <span key={member._id}>{member.firstName}, </span>
                                    }
                                })}
                            </div>
                            <span onClick={handleExtraInfoToggle}>{extraInfoToggle ? <IoIosArrowDropright /> : <IoIosArrowDropdown />}</span>
                        </div>
                        {extraInfoToggle && 
                        chat.members.map(member => {
                            if (member._id===userId){
                                return
                            }
                            return (
                                <div key={member._id} className="chatMembers">
                                    <div>
                                        <img src={member.profilePic} alt="#" />
                                        <span>{member.firstName}</span>
                                    </div>
                                    <span onClick={() => handleRemoveUser(member._id)}><IoIosRemoveCircleOutline /></span>
                                </div>
                            )
                        })}
                        {extraInfoToggle &&
                            <>
                                {!addContactToggle && 
                                    <div onClick={handleAddMember} className="addContact-form">
                                        <span><IoIosAddCircleOutline /></span>
                                        <span>Add Contact</span>
                                    </div>
                                }
                                {addContactToggle && 
                                <>
                                    <SearchInput search={search} setSearch={setSearch} handleSearch={handleSearch} />
                                    <div className={search ? "inputs-container" : "hidden"}>
                                    {searchUserData && searchUserData.map(user => {
                                        return (
                                            <div onClick={() => addMembers(user)} key={user._id}>
                                                <img src={user.profilePic} alt="#" />
                                                <span>{user.firstName} {user.lastName}</span>
                                            </div>
                                        )
                                        } )}
                                    </div>
                                </>
                                }
                            </>
                        }
                    </div>
                </div>
                }
                {!infoPageToggle &&
                <>
                    <div className="chat-messages">
                        {chatMessages && chatMessages.map(message => <div key={message._id} className={userId===message.sender ? "senderMessage" : "receiverMessage"}>
                            <img src={message.sender.profilePic} alt="#"/>
                            <p>{message.message}</p>
                            <span>delivered</span>
                        </div>)}
                    </div>
                    <form onSubmit={handleSendMessage} className="sendMessage-form">
                        <input required placeholder="Send a Message" type="text" onChange={handleMessage} value={postMessage} />
                        <button type="submit"><IoIosSend /></button>
                    </form>
                </>
                }
            </section>
        )
    }
  
}

export default Chat