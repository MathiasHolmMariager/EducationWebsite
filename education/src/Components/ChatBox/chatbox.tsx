import { useState, useEffect, useRef } from "react";
import { OpenAIchat } from "../openai";
import "../ChatBox/chatbox.css";
import React from "react";

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
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999,
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={toggleChatbox}
      >
        Chat
      </button>
      {isChatboxOpen && (
        <div
          id="chatbox"
          style={{
            position: "fixed",
            bottom: "9%",
            right: "20px",
            width: "20%",
            height: "80%",
            backgroundColor: "#fff",
            border: "1px solid ",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            background: "red",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              background: "yellow",
              height: "7%",
              margin: "0%",
              textAlign: "center",
              justifyContent: "center",
              paddingTop: "0%"
            }}
          >
            Chat bot - Titel
          </h2>
          <div
            className="chat"
            style={{ background: "blue", height: "80%", overflowY: "auto", paddingTop: "0px"}}
            ref={conversationHistoryRef}
          >
            {conversationHistory.map((message, index) => (
              <div key={index} style={{ textAlign: message.role === "user" ? "right" : "left" }}>
                {message.role === "user" ? (
                  <p style={{ textAlign: "right", background: "lightgreen", margin: 0, padding: "2%", borderRadius: "5px", marginTop: "2%", display: "inline-block", maxWidth: "80%"   }}>{message.content}</p>
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
              style={{ width: "65%", height: "76%", marginRight: "4px", border:"1px solid transparent", borderRadius: "8px", margin:"auto", marginTop:"3.5%", paddingLeft: "2%" }}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleUserInput} style={{ height: "85%", margin: "auto", width: "25%", marginLeft: "0%", marginTop:"3.5%" }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbox;
