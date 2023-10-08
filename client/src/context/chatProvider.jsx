import { createContext, useContext, useEffect, useState } from "react";
import { decObj } from "../utils/encrypt";

export const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const userInfo = decObj(JSON.parse(localStorage.getItem("userInfo")));
    setUser(userInfo);
    console.log(userInfo);
  }, []);
  return (
    <chatContext.Provider value={{ user, setUser }}>
      {children}
    </chatContext.Provider>
  );
};

export default ChatProvider;
