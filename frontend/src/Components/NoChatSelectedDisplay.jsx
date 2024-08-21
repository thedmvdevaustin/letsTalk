import { useSelector } from 'react-redux'
import { IoMdHand } from 'react-icons/io'
import { LuMessagesSquare } from 'react-icons/lu'

const NoChatSelectedDisplay = () => {
    const user = useSelector(state => state.auth.userInfo)
    return (
        <section className="noChatSelectedDisplay">
            <p>Hello <IoMdHand /> {user?.firstName} {user?.lastName}</p>
            <p>Select a chat to start a conversation</p>
            <LuMessagesSquare />
        </section>
    )
}

export default NoChatSelectedDisplay