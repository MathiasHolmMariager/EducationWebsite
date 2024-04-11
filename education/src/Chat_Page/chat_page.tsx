import { useEffect, useRef, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import React from "react";
import { OpenAIchat } from "../Components/openai";
import "../Chat_Page/chat_page.css"


interface Message {
  role: string;
  content: string;
}

function ChatPage() {
  const [chats, setChats] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [, setAssistantReply] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pageID, setPageID] = useState<string | null>(localStorage.getItem("PAGE_ID"));
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
      const favsRef = ref(db, `users/${user.uid}/chat`);

      onValue(favsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const keysArray: string[] = Object.keys(data);
          setChats(keysArray);
        } else {
          setChats([]);
        }
      });
    }
  }, [user]);


//##############################Chat-del#####################################
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

  const handleListItemClick = (selectedPageID: string) => {
    setPageID(selectedPageID);
  };


  return (
    <div
      style={{
        width: "90%",
        background: "grey",
        margin: "auto",
        height: "90vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ background: "green", width: "25%"}}>
        <div className="chatChoices"style={{ background: "green", overflow: "auto", height:"100%", padding:"0%"  }}>
      <ul style={{ listStyleType: "none", background: "lightblue", width: "100%", padding:"0%", height: "100%", marginTop:"0%", marginBottom:"0%" }}>
      {chats.map((chatID) => (
          <li key={chatID} onClick={() => handleListItemClick(chatID)} style={{background: "orange", cursor: "pointer", marginTop:"9.5%", textAlign: "center", width:"80%", marginLeft:"10%", marginRight:"10%"}}>
            {chatID}
          </li>
        ))}
        </ul>
        </div>
      </div>
      <div style={{ background: "yellow", width: "75%" }}>
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
                fontSize: "150%",
              }}
            >
              {pageID} Chat
            </h2>
          </div>
          <div
            className="chat"
            style={{
              background: "blue",
              height: "87%",
              overflowY: "auto",
            }}
            ref={conversationHistoryRef}
          >
            {conversationHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.role === "user" ? "right" : "left",
                }}
              >
                {message.role === "user" ? (
                  <p
                    style={{
                      textAlign: "left",
                      background: "lightgreen",
                      margin: 0,
                      padding: "2%",
                      borderRadius: "5px",
                      marginTop: "2%",
                      display: "inline-block",
                      maxWidth: "80%",
                    }}
                  >
                    {message.content}
                  </p>
                ) : (
                  <p
                    style={{
                      background: "lightgrey",
                      margin: 0,
                      padding: "2%",
                      borderRadius: "5px",
                      marginTop: "2%",
                      display: "inline-block",
                      maxWidth: "80%",
                    }}
                  >
                    {message.content}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              background: "red",
              width: "100%",
              height: "8%",
              textAlign: "center",
              display: "flex",
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              style={{
                width: "65%",
                height: "76%",
                marginRight: "5px",
                border: "1px solid transparent",
                borderRadius: "8px",
                margin: "auto",
                paddingLeft: "2%",
                marginTop: "0.3%",
              }}
              onKeyPress={handleKeyPress}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              style={{
                height: "85%",
                margin: "auto",
                width: "25%",
                marginLeft: "0%",
                marginTop: "0.3%",
              }}
              onClick={handleUserInput}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
