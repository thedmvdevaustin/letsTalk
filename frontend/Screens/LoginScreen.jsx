import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from "react-icons/fa6";
import { FaLock, FaUnlock } from "react-icons/fa";


const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePassword = e => {
        setPassword(e.target.value)
    }

    const handleShowPassword = e => {
        setShowPassword(e.target.checked)
    }

    return (
        <section className="login-container">
            <h2>Login</h2>
            <form className="login-form">
                <div className="input-container">
                    <input type="text" placeholder="Email" value={email} onChange={handleEmail} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
                    {showPassword ? <FaUnlock /> : <FaLock />}
                </div>
                <div className="password-container">
                    <div className="show-password">
                        <input type="checkbox" value={showPassword} onChange={handleShowPassword} />
                        <span>Show password</span>
                    </div>
                    <Link to="#" data-tool-tip="Reset your password">Forgot password?</Link>
                </div>
                <div className="button-container">
                    <button type="submit">Login</button>
                </div>
                <div className="toRegister">
                    <p>Need to register? <Link to="/register" data-tool-tip="Go to Registration">Register</Link></p>
                </div>
            </form>
            
        </section>
    )
}

export default LoginScreen