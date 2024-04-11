import { useState, useEffect, useRef } from "react";
import { OpenAIchat } from "../openai";
import "../ChatPageComponent/chatpagecomponent.css";
import React from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";

interface Message {
  role: string;
  content: string;
}

function ChatPageComponent() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [, setAssistantReply] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const pageID = localStorage.getItem("PAGE_ID");
  const conversationHistoryRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    if (user) {
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
  }, [ user, pageID]);

  const scrollToBottom = () => {
    if (conversationHistoryRef.current) {
      conversationHistoryRef.current.scrollTo({
        top: conversationHistoryRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
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
    <div
      style={{
        background: "blue",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ background: "grey", width: "100%", height: "5%" }}>
      <h2
            style={{
              background: "yellow",
              height: "100%",
              width: "100%",
              margin: "0%",
              textAlign: "center",
              justifyContent: "center",
              paddingTop: "0%",
              fontSize: "150%"
            }}
          >
            {pageID} Chat
          </h2>
      </div>
      <div className="chat" style={{ background: "lightblue", height: "87%", overflowY: "auto" }} ref={conversationHistoryRef}>
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
      <div style={{ background: "grey", width: "100%", height: "8%", textAlign:"center", display: "flex", }}>
        <input
          type="text"
          placeholder="Type your message..."
          style={{ width: "65%", height: "76%", marginRight: "5px", border:"1px solid transparent", borderRadius: "8px", margin:"auto", paddingLeft: "2%", marginTop:"0.3%" }}
          onKeyPress={handleKeyPress}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          style={{ height: "85%", margin: "auto", width: "25%", marginLeft: "0%", marginTop:"0.3%" }}
          onClick={handleUserInput} disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPageComponent;
