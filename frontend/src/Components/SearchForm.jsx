import { useState } from 'react'
import { IoSearch } from "react-icons/io5"

const SearchForm = () => {
    const [search, setSearch] = useState("")

    const handleSearch = e => {
        setSearch(e.target.value)
    }
    return (
        <div className="searchForm-container">
            <form className="searchForm">
                <input type="text" placeholder="Search..." value={search} onChange={handleSearch} />
                <button type="submit"><IoSearch /></button>
            </form>
        </div>
    )
}

export default SearchForm