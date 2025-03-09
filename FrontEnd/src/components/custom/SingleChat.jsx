import React from 'react'
import { ChatState } from '../../context/ChatProvider'

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user , selectedChat , setSelectedChat} =ChatState()

  return (
    <>
            {
                selectedChat ? 
                (
                 <div></div>    
                ) : 
                (
                   <h1>Click On User To Start Chatting</h1>     
                )
            }
    
    </>
  )
}

export default SingleChat