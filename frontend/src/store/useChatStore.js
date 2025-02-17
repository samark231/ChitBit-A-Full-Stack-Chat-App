import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";


const useChatStore = create((set, get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    onlineUsers:[],

    getUsers: async ()=>{
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("messages/users");
            set({users:res.data});

        }catch(err){
            console.log("Error in getUsers handler in useChatStore: ",err);
            toast.error(err.message);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async (userId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async (MessageData)=>{
        const {selectedUser, messages} = get();

        try {
            const res = await axiosInstance.post(`/messages/${selectedUser._id}`, MessageData);
            set({messages:[...messages, res.data]})
        } catch (err) {
            console.log("Error is sendMessage in useChatStore: ",err);
            toast.error(err.message); 
        }
    },
    //optimise this one later
    setSelectedUser: (selectedUser)=>{
        set({selectedUser});
    },
    subscribeToMessage : ()=>{
        const {selectedUser}= get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        //to do: optimise this one later.
        socket.on("newMessage", (newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId===selectedUser._id;
            if(!isMessageSentFromSelectedUser){
                return;
            }
            set({messages:[...get().messages, newMessage ]})
        })
    },
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))

export default useChatStore;