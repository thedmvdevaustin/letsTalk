import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer />
        <div className="wrapper">
            <div className="app-container"><Outlet /></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
            <div className="bubble"><span className="dot"></span></div>
          </div>
    </>
  )
}

export default App
