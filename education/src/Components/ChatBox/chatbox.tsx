import { useState, useEffect, useRef } from "react";
import { OpenAIchat } from "../Openai/openai";
import "../ChatBox/chatbox.css";
import React from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import chat_icon from "../../assets/chat.png";
import close_icon from "../../assets/close.png";
import sendButton from "../../assets/send.png";

interface Message {
  role: string;
  content: string;
}

interface ChatBot {
  chatBotID: string;
}

function Chatbox({chatBotID}: ChatBot) {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [, setAssistantReply] = useState<string | null>(null);
  const conversationHistoryRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const splitPageID = chatBotID ? chatBotID.split(",")[0] : null;

  useEffect(() => {
    if (isChatboxOpen && user) {
      const db = getDatabase();
      const chatRef = ref(db, `users/${user.uid}/chat/${chatBotID}/chatHistorik`);

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
  }, [isChatboxOpen, user, chatBotID]);

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
        behavior: "smooth",
      });
    }
  };

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  const handleUserInput = async () => {
    if (userInput.trim() === "") return;
    const tidspunkt = Date.now();
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userInput },
    ];
    setConversationHistory(updatedHistory);
    setUserInput("");

    setIsLoading(true);
    const { assistantReply } = await OpenAIchat(userInput, updatedHistory, chatBotID);
    setAssistantReply(assistantReply);
    if (user) {
      const db = getDatabase();
      const chatRefTime = ref(db, `users/${user.uid}/chat/${chatBotID}`);
      const chatRef = ref(db,`users/${user.uid}/chat/${chatBotID}/chatHistorik`);
      set(chatRefTime, { timestamp: tidspunkt });
      set(chatRef, updatedHistory);
    }
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

  useEffect(() => {
    if (isLoading) {
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
    <div style={{ height: isChatboxOpen ? "100%" : "100%" }}>
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
            height: "80px",
            width: "80px",
            cursor: "pointer",
          }}
          onClick={toggleChatbox}
        >
          <img
            src={chat_icon}
            style={{
              width: "43px",
              height: "43px",
              marginLeft: "auto",
              marginTop: "10%",
            }}
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
            width: "21%",
            height: "71%",
            backgroundColor: "#fff",
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
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "white",
                marginTop: "5%",
                fontSize: "90%",
                marginRight: "auto",
                marginLeft: "4%",
              }}
            >
              {splitPageID}
            </h2>

            <button
              onClick={toggleChatbox}
              style={{
                background: "rgb(33, 26, 82)",
                width: "12%",
                height: "80%",
                padding: "0%",
                marginTop: "-1%",
                marginLeft: "auto",
                marginRight: "2%",
              }}
            >
              <img
                src={close_icon}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "-0.05%",
                  marginTop: "0%",
                  padding: "0%",
                }}
                alt="Close"
              />
            </button>
          </h2>
          <div
            className="chat"
            style={{
              background: "white",
              height: "82%",
              overflowY: "auto",
              paddingTop: "0px",
              display: "flex",
              flexDirection: "column-reverse",
            }}
            ref={conversationHistoryRef}
          >
            {isLoading && (
              <div >
                <p
                  style={{
                    background: "rgba(75, 75, 75, 0.1)",
                    margin: 0,
                    padding: "2%",
                    borderRadius: "5px",
                    marginTop: "2%",
                    display: "inline-block",
                    maxWidth: "80%",
                    marginBottom: "-0.3%",
                  }}
                >
                  Skriver...
                </p>
              </div>
            )}
            {conversationHistory.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>Stil spørgsmål til uddannelsen</p>
              </div>
            ) : (
              conversationHistory.slice().reverse().map((message, index) => (
                <div style={{}}>
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
                          background: "rgba(75, 75, 75, 0.1)",
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
                </div>
              ))
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "10%",
              background: "white",
            }}
          >
            <div
              style={{
                width: "95.8%",
                margin: "auto",
                height: "82.6%",
                borderRadius: "2px",
                padding: "0px",
                display: "flex",
                boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)",
                marginBottom:"2.2%"
              }}
            >
              <input
                type="text"
                placeholder="Skriv din besked..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  width: "80%",
                  border: "none",
                  borderRadius: "2px 0px 0px 2px",
                  paddingLeft: "2%",
                  outline: "none",
                }}
                onKeyPress={handleKeyPress}
              />
              <button
                style={{
                  width: "20%",
                  height: "100%",
                  borderRadius: "0px 2px 2px 0px",
                  background: "white",
                  outline: "none",
                }}
              >
                <img
                  src={sendButton}
                  style={{ width: "80%", height: "80%", marginTop: "10%" }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbox;
