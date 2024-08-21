import SearchForm from '../Components/SearchForm'
import Contacts from '../Components/Contacts'
import { TbLogout2 } from "react-icons/tb"
import { MdGroupAdd } from "react-icons/md"
import { useLogoutMutation } from '../slices/authApiSlice'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useNavigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'

const DashboardScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [logoutUser, { isLoading }] = useLogoutMutation()

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
    return (
        <main className="dashboard-container">
            <div className="lets-talk">
                <img src="../public/cover.png"/>
                <span>letsTalk</span>
                <MdGroupAdd />
            </div>
            <SearchForm />
            <Contacts />
            <form onSubmit={handleLogoutUser} className="logout">
                {isLoading ? <ClipLoader color="#ffffff" /> : 
                <button type="submit"><TbLogout2 /></button>}
            </form>
            <Outlet />
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