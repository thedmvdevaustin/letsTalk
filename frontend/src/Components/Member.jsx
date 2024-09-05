import { IoClose } from "react-icons/io5"


const Member = ({ member, handleDelete }) => {

    return (
        <div className="member">
            <img src={member.profilePic} alt="#" />
            <span>{member.firstName}</span>
            <button type="button" onClick={() => handleDelete(member._id)}> <IoClose /> </button>
        </div>
    )
}

export default Member