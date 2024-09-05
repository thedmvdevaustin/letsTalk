import { IoSearch } from "react-icons/io5"
import { IoClose } from "react-icons/io5"

const SearchInput = (props) => {
    const handle = e => {
        props.setSearch("")
    }
    return (
        <div className="searchForm-container">
            <div className="searchForm">
                <input type="text" placeholder="Search Users" value={props.search} onChange={props.handleSearch} />
                {props.search?.length===0 ? <IoSearch /> : <IoClose className="close-button" onClick={handle} />}
            </div>
        </div>
    )
}

export default SearchInput