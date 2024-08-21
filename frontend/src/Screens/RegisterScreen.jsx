import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from "react-icons/fa6";
import { FaLock, FaUnlock } from "react-icons/fa";
import { MdEmail } from "react-icons/md"
import { useRegisterMutation } from '../slices/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import SyncLoader from 'react-spinners/SyncLoader'


const RegisterScreen = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [register, { isLoading, isError, isSuccess }] = useRegisterMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const registerUser = async e => {
        //figure out how to trim all inputs for validation reasons
        e.preventDefault()
        if (password!==password2){
            setPassword("")
            setPassword2("")
            toast.error("Passwords don't match. Try again!")
            return
        }
        try {
            const userData = await register({ firstName, lastName, email, password }).unwrap()
            dispatch(setCredentials(userData))
            navigate('/dashboard')
            toast.success("Registration successful. Welcome to letsTalk")
        } catch(err) {
            toast.error("Unable to register please refresh the page and try again!")
            console.error(err.message)
        }
    }

    if (isLoading){
        return (
            <section className="login-container">
                <h2>Register</h2>
                <form className="login-form">
                    <div className="input-container">
                        <input disabled type="text" placeholder="First Name" value={firstName} onChange={handleFirstName} />
                        <FaUser />
                    </div>
                    <div className="input-container">
                        <input disabled type="text" placeholder="Last Name" value={lastName} onChange={handleLastName} />
                        <FaUser />
                    </div>
                    <div className="input-container">
                        <input disabled type="email" placeholder="Email" value={email} onChange={handleEmail} />
                        <MdEmail />
                    </div>
                    <div className="input-container">
                        <input disabled type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
                        {showPassword ? <FaUnlock /> : <FaLock />}
                    </div>
                    <div className="input-container">
                        <input disabled type={showPassword ? "text" : "password"} placeholder="Confirm password" value={password2} onChange={handlePassword2} />
                        {showPassword ? <FaUnlock /> : <FaLock />}
                    </div>
                    <div className="password-container">
                        <div className="show-password">
                            <input disabled type="checkbox" value={showPassword} onChange={handleShowPassword} />
                            <span>Show password</span>
                        </div>
                    </div>
                    <div className="button-container">
                        <SyncLoader color="#ffffff" />
                    </div>
                    <div className="toRegister">
                        <p>Already Registerd? <Link to="#" data-tool-tip="Go to Login Page">Login</Link></p>
                    </div>
                </form>
            </section>
        )
    }
    if (isError) {
        toast.error("Unable to register please refresh the page and try again!")
    }
    return (
        <section className="login-container">
            <h2>Register</h2>
            <form onSubmit={registerUser} className="login-form">
                <div className="input-container">
                    <input required type="text" placeholder="First Name" value={firstName} onChange={handleFirstName} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input required type="text" placeholder="Last Name" value={lastName} onChange={handleLastName} />
                    <FaUser />
                </div>
                <div className="input-container">
                    <input required type="text" placeholder="Email" value={email} onChange={handleEmail} />
                    <MdEmail />
                </div>
                <div className="input-container">
                    <input required type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handlePassword} />
                    {showPassword ? <FaUnlock /> : <FaLock />}
                </div>
                <div className="input-container">
                    <input required type={showPassword ? "text" : "password"} placeholder="Confirm password" value={password2} onChange={handlePassword2} />
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