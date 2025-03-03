import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/HomePage/Home'
import ChatPage from '../Pages/ChatPage/ChatPage'

const AppRoutes = () => {
  return (
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
     </Routes>
  )
}

export default AppRoutes