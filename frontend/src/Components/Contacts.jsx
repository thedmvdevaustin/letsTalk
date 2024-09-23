import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useGetChatsQuery, selectChats } from '../slices/chatApiSlice'
import { useSelector } from 'react-redux'
import SyncLoader from 'react-spinners/SyncLoader'
import { BiSolidError } from "react-icons/bi"
const Contacts = () => {
    const [contacts, setContacts] = useState([])
    const { data, isLoading, isSuccess, isError } = useGetChatsQuery()
    const allChats = useSelector(selectChats)
    useEffect(() => {
        setContacts(allChats)
    }, [allChats])
    
    if (isLoading){
        return (
            <div className="contacts-loading-container">
                <SyncLoader color="#ffffff" />
            </div>
        )
    }
    if (isSuccess){
        return (
            <div className="contacts-container">
                {contacts && contacts.map(contact => <NavLink key={contact._id} to={`/dashboard/${contact._id}`} className={({ isActive, isPending }) => {
                    return (isActive ? "active" : 'InActive')
                }}>
                    <div className="contact">
                        <img src={`https://avatar.iran.liara.run/username?username=${contact.name}`} alt="#" />
                        <span>{contact.name}</span>
                    </div>
                </NavLink> )}
            </div>
        )
    }
    if (isError) {
        <div className="contacts-error-container">
            <BiSolidError color="#ffffff"/>
        </div>
    }
}

export default Contacts