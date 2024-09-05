import SearchForm from '../Components/SearchForm'
import SearchInput from '../Components/SearchInput'
import Member from '../Components/Member'
import { TbLogout2 } from "react-icons/tb"
import { MdGroupAdd } from "react-icons/md"
import { IoIosCloseCircle } from "react-icons/io";
import { useLogoutMutation } from '../slices/authApiSlice'
import { useLazySearchUserQuery } from '../slices/usersApiSlice'
import { useCreateChatMutation } from '../slices/chatApiSlice'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'
import { useState } from 'react'
import Contacts from '../Components/Contacts'
import { useSelector } from 'react-redux'

const DashboardScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [logoutUser, { isLoading }] = useLogoutMutation()
    const [searchUser, { data, isLoading: searchUserLoading, isError, error }] = useLazySearchUserQuery()
    const [createGroup, { isLoading: createGroupLoading }] = useCreateChatMutation()
    const [modal, setModal] = useState(false)
    const [members, setMembers] = useState([])
    const [groupName, setGroupName] = useState("")
    const [search, setSearch] = useState("")
    //logic: pass down this value to search form to update
    // and be able to pass it down to contact and chat;
    const [contact, setContact] = useState({})
    const id = useSelector(state => state.auth.userInfo?._id)

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleGroupName = e => {
        e.stopPropagation()
        setGroupName(e.target.value)
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

    const addMembers = (newUser) => {
        if (members.some(member => member._id===newUser._id)){
            toast.error("contact already added")
            return
        }
        setMembers([...members, newUser])
    }

    const handleDelete = id => {
        setMembers(members.filter(member => member._id!==id))
    }

    const createGroupChat = async e => {
        e.preventDefault()
        if (!groupName || !members || members.length < 2){
            toast.error("make sure you have a group chat name and atleast 2 members")
            return
        }
        const allMembers = [id, ...members.map(member => member._id)]
        console.log(allMembers)
        try {
            await createGroup({members: allMembers, name: groupName})
            setGroupName("")
            setSearch("")
            setMembers([])
            navigate('/dashboard')
        } catch(err){
            console.log(err)
            toast.error("failed to create group please refresh and try again!")
        }
    }

    const handleLogoutUser = async e => {
        e.preventDefault()
        try {
            await logoutUser()
            dispatch(logout())
            navigate('/')
            toast.success("Logout Successful!")
        } catch(err){
            toast.error("Something went wrong, please refresh the page and try again!")
            console.error(err.message)
        }
    }
    //see if you can create an onClick on the add group button
    // that allows you to render the modal so you can split
    //the logic into seperate components 
    return (
        <main className="dashboard-container">
            <div className="lets-talk">
                <img src="../public/cover.png"/>
                <span>letsTalk</span>
                <button onClick={toggleModal} type="button" className="btn-modal">
                    <MdGroupAdd />
                </button>
            </div>
            {modal && 
            <div className="modal">
                    <div className="modal-content">
                        <h2>Create GroupChat</h2>
                        <form onSubmit={createGroupChat}>
                            <input type="text" placeholder="Enter group name" value={groupName} onChange={handleGroupName} />
                            <SearchInput search={search} setSearch={setSearch} handleSearch={handleSearch} />
                            <button type="button" className="close-modal" onClick={toggleModal}>
                                <IoIosCloseCircle />
                            </button>
                            <div className="members-container">
                            {members && members.map(member => {
                                return <Member key={member._id} member={member} handleDelete={handleDelete} />
                            })}
                            </div>
                            <button className="createGroup-btn" type="submit">Create Group</button>
                        </form>
                    </div>
                    <div className={search ? "inputs-container" : "hidden"}>
                    {data && data.map(user => {
                        return (
                            <div onClick={() => addMembers(user)} key={user._id}>
                                <img src={user.profilePic} alt="#" />
                                <span>{user.firstName} {user.lastName}</span>
                            </div>
                        )
                        } )}
                    </div>
            </div>}
            {!modal && 
            <>
                <SearchForm />
                <Contacts />
                <form onSubmit={handleLogoutUser} className="logout">
                    {isLoading ? <ClipLoader color="#ffffff" /> : 
                    <button type="submit"><TbLogout2 /></button>}
                </form>
                <Outlet />
            </>}
            {/* <Chat /> */}
        </main>
    )
}

export default DashboardScreen

// your chats will come back in a list; put that list in STATE; add the
// search user to the state as a chat but don't save it first until someone
// sends a message then call the function to add the chat

// each chat will be accessed by the id of the chat; if we add a searched 
// user
// to STATE, then the searched users chat won't have an id; find a way to
// add
// the user without needing an id and when you send a message if there 
// isn't a 
// chat already created, create a chat and use the id of the created chat