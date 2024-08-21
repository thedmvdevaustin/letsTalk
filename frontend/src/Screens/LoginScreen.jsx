import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from "react-icons/fa6";
import { FaLock, FaUnlock } from "react-icons/fa";
import { MdEmail } from "react-icons/md"
import { useLoginMutation } from '../slices/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import SyncLoader from 'react-spinners/SyncLoader'

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [login, { isLoading, isError }] = useLoginMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePassword = e => {
        setPassword(e.target.value)
    }

    const handleShowPassword = e => {
        setShowPassword(e.target.checked)
    }

    const loginUser = async e => {
        //come back and figure a way out to trim inputs for validation
        e.preventDefault()
        try {
            const userData = await login({ email, password }).unwrap()
            dispatch(setCredentials(userData))
            navigate('/dashboard')
            toast.success('login successful, welcome to letsTalk!')
        } catch(err) {
            toast.err("Unable to login, please refresh the page and try again!")
            console.error(err.message)
        }
    }

    if(isLoading){
        return (
            <section className="login-container">
                <h2>Login</h2>
                <form className="login-form">
                    <div className="input-container">
                        <input disabled type="email" placeholder="Email" value={email} onChange={handleEmail} />
                        <MdEmail />
                    </div>
                    <div className="input-container">
                        <input disabled type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
                        {showPassword ? <FaUnlock /> : <FaLock />}
                    </div>
                    <div className="password-container">
                        <div className="show-password">
                            <input disabled type="checkbox" value={showPassword} onChange={handleShowPassword} />
                            <span>Show password</span>
                        </div>
                        <Link to="#" data-tool-tip="Reset your password">Forgot password?</Link>
                    </div>
                    <div className="button-container">
                        <SyncLoader color="#ffffff" />
                    </div>
                    <div className="toRegister">
                        <p>Need to register? <Link to="#" data-tool-tip="Go to Registration">Register</Link></p>
                    </div>
                </form>
            </section>
        )
    }

    if (isError) {
        toast.error("Unable to login please refresh the page and try again!")
    }

    return (
        <section className="login-container">
            <h2>Login</h2>
            <form onSubmit={loginUser} className="login-form">
                <div className="input-container">
                    <input required type="text" placeholder="Email" value={email} onChange={handleEmail} />
                    <MdEmail />
                </div>
                <div className="input-container">
                    <input required type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
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