import { useState, useEffect, useRef } from "react";
import { OpenAIchat } from "../openai";
import "../ChatBox/chatbox.css";
import React from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import chat_icon from "../../assets/chat.png";
import close_icon from "../../assets/close.png";

interface Message {
  role: string;
  content: string;
}

function Chatbox() {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [, setAssistantReply] = useState<string | null>(null);
  const conversationHistoryRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const pageID = localStorage.getItem("PAGE_ID");

  useEffect(() => {
    if (isChatboxOpen && user) {
      const db = getDatabase();
      const chatRef = ref(db, `users/${user.uid}/chat/${pageID}`);
  
      const fetchConversationHistory = async () => {
        try {
          const snapshot = await get(chatRef);
          if (snapshot.exists()) {
            const conversationHistoryFromFirebase = snapshot.val();
            setConversationHistory(conversationHistoryFromFirebase);
            scrollToBottom();
          }
        } catch (error) {
          console.error("Error fetching conversation history:", error);
        }
      };
  
      fetchConversationHistory();
    }
  }, [isChatboxOpen, user, pageID]);
  



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    if (conversationHistoryRef.current) {
      conversationHistoryRef.current.scrollTo({
        top: conversationHistoryRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  const handleUserInput = async () => {
    if (userInput.trim() === "") return;
    setIsLoading(true);
    const { assistantReply, conversationHistory: updatedHistory } =
      await OpenAIchat(userInput, conversationHistory);
    setConversationHistory(updatedHistory);
    setAssistantReply(assistantReply);
    if (user) {
      const db = getDatabase();
      const chatRef = ref(db, `users/${user.uid}/chat/${pageID}`);
      set(chatRef, updatedHistory); 
    }
    setUserInput("");
    setIsLoading(false);
  };

  useEffect(() => {
    if (isChatboxOpen) {
      const chatbox = document.getElementById("chatbox");
      if (chatbox) {
        scrollToBottom();
      }
    }
  }, [isChatboxOpen]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); 
      handleUserInput(); 
    }
  };

 
  return (
    <div>
      {!isChatboxOpen && (
      <button
        style={{
          position: "fixed",
          bottom: "2%",
          right: "1%",
          zIndex: 999,
          backgroundColor: "rgb(33, 26, 82)",
          color: "#fff",
          border: "none",
          borderRadius: "40px",
          height:"80px",
          width:"80px",
          cursor: "pointer",
        }}
        onClick={toggleChatbox}
      >
          <img
            src={chat_icon}
            style={{ width: "43px", height: "43px", marginLeft: "auto", marginTop:"10%" }}
            alt="Chat"
          />
      </button>
      )}
      {isChatboxOpen && (
        <div
          id="chatbox"
          style={{
            position: "fixed",
            bottom: "2%",
            right: "1%",
            width: "20%",
            height: "70%",
            backgroundColor: "#fff",
            border: "1px solid ",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            background: "lightgrey",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              background: "rgb(33, 26, 82)",
              height: "7%",
              margin: "0%",
              textAlign: "center",
              justifyContent: "center",
              paddingTop: "0%",
              fontSize: "150%",
              display:"flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <h2 style={{color:"white", marginTop:"5%", fontSize:"90%", marginRight:"auto", marginLeft:"auto"}}>{pageID} Chat</h2>
            
            <button onClick={toggleChatbox} style={{background:"rgb(33, 26, 82)", width:"12%", height:"80%", padding:"0%", marginTop:"-1%", marginLeft:"auto", marginRight:"2%"}}>
            <img
            src={close_icon}
            style={{ width: "30px", height: "30px", marginLeft: "-0.05%", marginTop:"0%", padding:"0%" }}
            alt="Close"
          />
            </button>
          </h2>
          <div
            className="chat"
            style={{ background: "white", height: "80%", overflowY: "auto", paddingTop: "0px"}}
            ref={conversationHistoryRef}
          >
            {conversationHistory.map((message, index) => (
              <div key={index} style={{ textAlign: message.role === "user" ? "right" : "left" }}>
                {message.role === "user" ? (
                  <p style={{ textAlign: "left", background: "lightgreen", margin: 0, padding: "2%", borderRadius: "5px", marginTop: "2%", display: "inline-block", maxWidth: "80%"   }}>{message.content}</p>
                ) : (
                  <p style={{ background: "lightgrey", margin: 0, padding: "2%", borderRadius: "5px", marginTop: "2%", display: "inline-block", maxWidth: "80%"   }} >{message.content}</p>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "10%",
              
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              style={{ width: "65%", height: "76%", marginRight: "4px", border:"1px solid transparent", borderRadius: "8px", margin:"auto", marginTop:"3%", paddingLeft: "2%" }}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleUserInput} disabled={isLoading} style={{ height: "85%", margin: "auto", width: "25%", marginLeft: "0%", marginTop:"3%" }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbox;
