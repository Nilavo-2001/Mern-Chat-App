import { createContext, useContext, useEffect, useState } from "react";
import { decObj } from "../utils/encrypt";

export const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    //  console.log("chat prov called");
    let userInfo = null;
    if (localStorage.getItem("userInfo"))
      userInfo = decObj(JSON.parse(localStorage.getItem("userInfo")));
    setUser(userInfo);
    setUserLoading(false);
    // console.log("user token from chatProvider", userInfo.token);
  }, []);
  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        globalLoading,
        setGlobalLoading,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
      }}
    >
      {!userLoading && children}
    </chatContext.Provider>
  );
};

export default ChatProvider;
