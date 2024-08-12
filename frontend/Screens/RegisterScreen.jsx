import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from "react-icons/fa6";
import { FaLock, FaUnlock } from "react-icons/fa";


const RegisterScreen = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleFirstName = e => {
        setFirstName(e.target.value)
    }
    const handleLastName = e => {
        setLastName(e.target.value)
    }
    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePassword = e => {
        setPassword(e.target.value)
    }
    const handlePassword2 = e => {
        setPassword2(e.target.value)
    }

    const handleShowPassword = e => {
        setShowPassword(e.target.checked)
    }

    return (
        <section className="login-container">
            <h2>Register</h2>
            <form className="login-form">
                <div className="input-container">
                    <input type="text" placeholder="First Name" value={firstName} onChange={handleFirstName} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Last Name" value={lastName} onChange={handleLastName} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Email" value={email} onChange={handleEmail} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
                    {showPassword ? <FaUnlock /> : <FaLock />}
                </div>
                <div className="input-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Confirm password" value={password2} onChange={handlePassword2} />
                    {showPassword ? <FaUnlock /> : <FaLock />}
                </div>
                <div className="password-container">
                    <div className="show-password">
                        <input type="checkbox" value={showPassword} onChange={handleShowPassword} />
                        <span>Show password</span>
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit">Register</button>
                </div>
                <div className="toRegister">
                    <p>Already Registerd? <Link to="/" data-tool-tip="Go to Login Page">Login</Link></p>
                </div>
            </form>
            
        </section>
    )
}

export default RegisterScreen