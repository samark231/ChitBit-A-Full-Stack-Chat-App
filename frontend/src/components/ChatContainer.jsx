import React, { useEffect, useRef } from 'react'
import useChatStore from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import ActualMessages from './ActualMessages';
import useAuthStore from '../store/useAuthStore';


const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessage, unsubscribeFromMessage } = useChatStore();
  
  const messageEndRef = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeToMessage();
    return ()=>{
      unsubscribeFromMessage();
    }
  },[selectedUser._id, getMessages, subscribeToMessage, unsubscribeFromMessage]);
  
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      {isMessagesLoading?<MessageSkeleton/>:<ActualMessages/>}
      <MessageInput/>
    </div> 
  )
}

export default ChatContainer
