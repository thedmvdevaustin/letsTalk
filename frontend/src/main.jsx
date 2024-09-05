import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store.jsx'
import LoginScreen from './Screens/LoginScreen.jsx'
import RegisterScreen from './Screens/RegisterScreen.jsx'
import DashboardScreen from './Screens/DashboardScreen.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import NoChatSelectedDisplay from './Components/NoChatSelectedDisplay.jsx'
import Chat from './Components/Chat.jsx'
import { SocketProvider } from './Context/SocketContext.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />}>
        <Route index={true} path="/dashboard" element={<NoChatSelectedDisplay />} />
        <Route path="/dashboard/:id" element={<Chat />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  </StrictMode>,
)
