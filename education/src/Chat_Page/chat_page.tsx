import { useEffect, useRef, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";
import React from "react";
import { OpenAIchat } from "../Components/Openai/openai";
import "../Chat_Page/chat_page.css";
import sendButton from "../assets/send.png";
import searchIcon from "../assets/searchIcon.png"
import trashIcon from "../assets/trash.png"
import goToIcon from "../assets/goTo.png"
import arrowIcon from "../assets/arrow.png"

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
  const conversationHistoryRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [createChatQuery, setCreateChatQuery] = useState('');
  const [pageID, setPageID] = useState<string | null>(
    localStorage.getItem("PAGE_ID")
  );
  const [showChat, setShowChat] = useState<boolean>(true); // Add state to control whether to show chat or not
  const createChats = ["Interaktionsdesign, Bachelor", "Interaktionsdesign, Kandidat", "Informationsteknologi, Bachelor", "Computerscience, Kandidat", "Medialogi, Bachelor", "Medialogy, Kandidat"];


  //finder firebase user:
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  //##############################Chat-del#####################################
 
  //finder chat historik i firebase:
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
  }, [user, pageID]);
  
  //scroll til bunden af chat
  const scrollToBottom = () => {
    if (conversationHistoryRef.current) {
      conversationHistoryRef.current.scrollTo({
        top: conversationHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  //omsæt user input til ai output (openai.js)
  const handleUserInput = async () => {
    if (userInput.trim() === "") return;

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userInput },
    ];
    setConversationHistory(updatedHistory);
    setUserInput("");

    setIsLoading(true);
    const { assistantReply } = await OpenAIchat(userInput, updatedHistory);
    setAssistantReply(assistantReply);
    if (user) {
      const db = getDatabase();
      const chatRef = ref(db, `users/${user.uid}/chat/${pageID}`);
      set(chatRef, updatedHistory);
    }
    setIsLoading(false);
  };

  //send besked fra input felt med "Enter"
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleUserInput();
    }
  };

  //fjern chat fra firebase:
  const handleDeleteChat = async () => {
    try {
      if (user) {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Er du sikker på du vil slette denne chat?");
        
        if (confirmDelete) {
          const db = getDatabase();
          const chatRef = ref(db, `users/${user.uid}/chat/${pageID}`);
          await remove(chatRef);
          setConversationHistory([]);
        }
      }
    } catch (error) {
    }
  };

  //####################################################################

  //###################chat list########################################

  //finder liste af chat fra firebase
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

  //chat list valg
  const handleListItemClick = (selectedPageID: string) => {
    setPageID(selectedPageID);
    localStorage.setItem("PAGE_ID", selectedPageID);
  };

  const handleCreateChatItemClick = (selectedPageID: string) => {
    setPageID(selectedPageID);
    localStorage.setItem("PAGE_ID", selectedPageID);
    setShowChat(true);
  };

  //chat search:
  const filteredChats = chats.filter(chatID =>
    chatID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const filteredCreateChats = createChats.filter(createChatID =>
    createChatID.toLowerCase().includes(createChatQuery.toLowerCase())
  );

  const handleCreateChatInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCreateChatQuery(event.target.value);
  };
  
  useEffect(() => {
    if (chats.length === 0) {
      setShowChat(false);
      console.log("Ingen chats");
    } else {
      setShowChat(true);
    }
  }, [chats]);

  //#####################################################################
  

  return (
    <div
      style={{
        width: "90%",
        margin: "auto",
        height: "90vh",
        display: "flex",
        flexDirection: "row",
      }}
    > 
      {!showChat ? (<div style={{ width: "25%", boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)"}}><input
          type="text"
          placeholder="Søg efter chats..."
          style={{
            width: "85%",
            height:"10%",
            border: "none",
            borderRadius: "2px 0px 0px 2px",
            paddingLeft: "2%",
            outline: "none",
            fontSize: "100%"
          }}
          value={createChatQuery}
          onChange={handleCreateChatInputChange}
        />{createChatQuery === '' ? (<div></div>) : (<div
        className="chatChoices"
        style={{ overflow: "auto", height: "90%", padding: "0%" }}
      >
        <ul
          style={{
            listStyleType: "none",
            width: "100%",
            padding: "2.5%",
            height: "90%",
            marginTop: "0%",
            marginBottom: "0%",
          }}
        >
          {filteredCreateChats.map((createChatID) => (
            <li
              key={createChatID}
              onClick={() => handleCreateChatItemClick(createChatID)}
              style={{
                background: createChatID === pageID ? "rgba(100, 100, 100, 0.1)" : "rgba(100, 100, 100, 0.03)",
                color: "rgb(75,75,75)",
                marginBottom: "2.5%",
                cursor: "pointer",
                width: "95%",
                height: "10%",
                borderRadius: "8px",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                fontSize: "100%",
              }}
            >
              <p style={{ width:"80%", height:"100%", display:"flex", alignItems:"center", paddingLeft:"2%", borderRadius:"8px"}}>{createChatID}</p>   
              <div style={{width:"20%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}><img src={arrowIcon} style={{width:"40%"}}/></div>
                        
            </li>
          ))}
        </ul>
      </div>)}</div>) : (<div
        style={{ width: "25%", boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)" }}
      >
        <div style={{height:"6%", width:"94%", display:"flex", justifyContent:"center", alignItems:"center", padding:"3% 2% 2% 3%", marginTop:"1%"}}>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%", width:"100%", borderRadius:"2px",boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)"}}>
        <input
          type="text"
          placeholder="Søg efter chats..."
          style={{
            width: "85%",
            height:"95%",
            border: "none",
            borderRadius: "2px 0px 0px 2px",
            paddingLeft: "2%",
            outline: "none",
            fontSize: "100%"
          }}
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <div style={{width:"15%", height:"100%", borderRadius: "0px 2px 2px 0px", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <img src={searchIcon} style={{width:"55%", height:"60%",}} />
        </div>
        </div>
        </div>
        <div
          className="chatChoices"
          style={{ overflow: "auto", height: "90%", padding: "0%" }}
        >
          <ul
            style={{
              listStyleType: "none",
              width: "100%",
              padding: "2.5%",
              height: "90%",
              marginTop: "0%",
              marginBottom: "0%",
            }}
          >
            {filteredChats.map((chatID) => (
              <li
                key={chatID}
                onClick={() => handleListItemClick(chatID)}
                style={{
                  background: chatID === pageID ? "rgba(100, 100, 100, 0.1)" : "rgba(100, 100, 100, 0.03)",
                  color: "rgb(75,75,75)",
                  marginBottom: "2.5%",
                  cursor: "pointer",
                  width: "95%",
                  height: "10%",
                  borderRadius: "8px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "100%",
                }}
              >
                <p style={{ width:"80%", height:"100%", display:"flex", alignItems:"center", paddingLeft:"2%", borderRadius:"8px"}}>{chatID}</p>   
                <div style={{width:"20%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}><img src={arrowIcon} style={{width:"40%"}}/></div>
                          
              </li>
            ))}
          </ul>
        </div>
      </div>)}
      
      <div style={{ width: "75%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "10%",
              width: "100%",
            }}
          >
{/*Chat-skrivefelt*/}
            {!showChat ? (<div></div>) : (<div style={{
                width: "90%",
                height: "82.6%",
                borderRadius: "2px",
                display: "flex",
                boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)",
              }}><input
              type="text"
              placeholder="Skriv din besked..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              style={{
                width: "90%",
                border: "none",
                borderRadius: "2px 0px 0px 2px",
                paddingLeft: "2%",
                outline: "none",
                fontSize: "100%",
              }}
              onKeyPress={handleKeyPress}
            />
            <button
              style={{
                width: "10%",
                height: "100%",
                borderRadius: "0px 2px 2px 0px",
                background: "white",
                outline: "none",
              }}
            >
              <img src={sendButton} style={{ width: "55%", height: "80%", marginTop:"3%" }} />
            </button></div>)}
          </div>
          <div
            className="chat"
            style={{
              height: "80%",
              overflowY: "auto",
              width: "90%",
              display: "flex",
              flexDirection: "column-reverse",
            }}
            ref={conversationHistoryRef}
          >
            {isLoading && (
              <div>
                <p
                  style={{
                    background: "rgba(75, 75, 75, 0.1)",
                    margin: 0,
                    padding: "1%",
                    borderRadius: "5px",
                    marginTop: "1%",
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
                  flexDirection: "column-reverse",
                }}
              >
                {!showChat ? (<div><p>Søg efter en ny uddannelse</p></div>) : (<div><p>Stil et spørgsmål</p></div>)}
                
              </div>
            ) : (
              conversationHistory
                .slice()
                .reverse()
                .map((message, index) => (
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
                            padding: "1%",
                            borderRadius: "5px",
                            marginTop: "1%",
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
                            padding: "1%",
                            borderRadius: "5px",
                            marginTop: "1%",
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
              width: "100%",
              height: "calc(10% - 1px)",
              borderBottom: "1px solid rgba(100, 100, 100, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!showChat ? (<div><h2>Ingen igangværende chats</h2></div>) : (<div style={{width: "100%", display: "flex"}}>
              <h2 style={{ marginLeft: "2%", width: "85%" }}>{pageID}</h2>
              <a href={`${pageID}`} style={{ width: "5%", height: "80%", margin: "0% 1% 0% 0%", padding:"0%", background:"white" }}>
              <button
               style={{ width: "110%", height: "100%", margin: "30% 1% 0% 0%", padding:"0%", background:"white" }}
              >
                <img src={goToIcon} style={{ width: "80%", height: "95%",marginTop:"2.5%"}}/>
              </button>
              </a>
              <button
                style={{ width: "5.5%", height: "80%", margin: "1.3% 2% 0% 0%", padding:"0%", background:"white", }}
                onClick={handleDeleteChat}
              >
                <img src={trashIcon} style={{ width: "80%", height: "75%",marginTop:"4%"}}/>
              </button>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;