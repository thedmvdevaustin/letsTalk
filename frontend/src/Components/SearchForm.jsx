import { useState } from 'react'
import SearchInput from './SearchInput'
import { useLazySearchUserQuery } from '../slices/usersApiSlice'
import { useCreateChatMutation } from '../slices/chatApiSlice'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
const SearchForm = () => {
    const [search, setSearch] = useState("")
    const id = useSelector(state => state.auth.userInfo?._id)
    // the useLazyQuery hook is the same as a mutation 
    const [searchUser, { data, isLoading, isError, error }] = useLazySearchUserQuery()
    const [createChat, { isLoading: chatLoading, isError: chatError }] = useCreateChatMutation()

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

    const handleClick = async (newChat) => {
    //remember to use a callback function on a event handler
    //if you want to pass in a value other than the event obj 
        try {
            const chat = await createChat(newChat)
            handleClose()
        } catch(err){
            console.log(err)
            //think of an error notification to give to toast
        }
    }   

    return (
        <>
        <SearchInput search={search} setSearch={setSearch} handleSearch={handleSearch} />
        <div className={search ? "inputs-container" : "hidden"}>
            {data && data.map(user => {
                return (
                    <div onClick={() => handleClick({members: [user._id, id], name: `${user.firstName} ${user.lastName}`})} key={user._id}>
                        <img src={user.profilePic} alt="#" />
                        <span>{user.firstName} {user.lastName}</span>
                    </div>
                )
            } )}
        </div>
        </>
    )
}

export default SearchForm