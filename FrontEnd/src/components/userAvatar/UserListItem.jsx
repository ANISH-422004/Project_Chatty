import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { FaUserCircle } from 'react-icons/fa'

const UserListItem = ({user,handelFunction}) => {
   
    return (
        <div
        onClick={()=>{handelFunction()}}
        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg shadow-md w-full max-w-md mt-3 hover:bg-teal-500">
        {/* Avatar */}
        <FaUserCircle className="text-gray-500 text-3xl" />
  
        {/* User Details */}
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email :</span> {user.email}
          </p>
        </div>
      </div>
  )
}

export default UserListItem