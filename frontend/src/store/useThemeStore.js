import {create} from "zustand";

const useThemeStore = create((set)=>({
    theme :localStorage.getItem("chat-theme")||"coffee",
    setTheme: (theme)=>{
        localStorage.setItem("chat-theme", theme);
        set({theme:theme});
    }
}));

export default useThemeStore;