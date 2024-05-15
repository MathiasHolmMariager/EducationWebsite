import { useEffect, useRef, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";
import React from "react";
import { OpenAIchat } from "../Components/Openai/openai";
import "../Chat_Page/chat_page.css";
import sendButton from "../assets/send.png";
import searchIcon from "../assets/searchIcon.png";
import trashIcon from "../assets/trash.png";
import goToIcon from "../assets/goTo.png";
import arrowIcon from "../assets/arrow.png";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [chatBotID, setchatBotID] = useState("");
  const [createChatQuery, setCreateChatQuery] = useState("");
  const [createUser, setCreateUser] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  const createChats = [
    "Interaktionsdesign, Bachelor",
    "Interaktionsdesign, Kandidat",
    "Informationsteknologi, Bachelor",
    "Computerscience, Kandidat",
    "Medialogi, Bachelor",
    "Medialogy, Kandidat",
  ];

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
      const chatRef = ref(
        db,
        `users/${user.uid}/chat/${chatBotID}/chatHistorik`
      );

      const fetchConversationHistory = async () => {
        try {
          const snapshot = await get(chatRef);
          if (snapshot.exists()) {
            const conversationHistoryFromFirebase = snapshot.val();
            setConversationHistory(conversationHistoryFromFirebase);
            scrollToBottom();
          } else {
            setConversationHistory([]);
          }
        } catch (error) {
          console.error("Error fetching conversation history:", error);
        }
      };

      fetchConversationHistory();
    }
  }, [chatBotID]);

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

    setCreateUser(false);
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
      const chatRef = ref(db,`users/${user.uid}/chat/${chatBotID}/chatHistorik`
      );
      set(chatRefTime, { timestamp: tidspunkt });
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
        const confirmDelete = window.confirm(
          "Er du sikker på du vil slette denne chat?"
        );

        if (confirmDelete) {
          const db = getDatabase();
          const chatRef = ref(db, `users/${user.uid}/chat/${chatBotID}`);
          await remove(chatRef);
          const updatedFilteredChats = filteredChats.filter(
            (id) => id !== chatBotID
          );
          if (updatedFilteredChats.length === 0) {
            setShowChat(false);
            setchatBotID("");
          } else {
            setchatBotID(updatedFilteredChats[0]);
          }
        }
      }
    } catch (error) {}
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
          keysArray.sort((a, b) => {
            const timestampA = data[a].timestamp;
            const timestampB = data[b].timestamp;
            return timestampB - timestampA;
          });
          setChats(keysArray);
          setchatBotID(keysArray[0]);
        } else {
          setChats([]);
          setShowChat(false);
        }
      });
    }
  }, [user]);

  //chat list valg
  const handleListItemClick = (selectedPageID: string) => {
    setchatBotID(selectedPageID);
  };

  //chat search:
  const filteredChats = chats.filter((chatID) =>
    chatID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //ændringer i input
  const handleSearchInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
  };

  //###########################################################################

  //##############################create chat##################################

  const filteredCreateChats = createChats.filter((createChatID) =>
    createChatID.toLowerCase().includes(createChatQuery.toLowerCase())
  );

  const createChatsList = filteredCreateChats.filter(
    (createChatID) => !filteredChats.includes(createChatID)
  );

  const handleCreateChatInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCreateChatQuery(event.target.value);
  };

  //click på create chat liste
  const handleCreateChatItemClick = (selectedPageID: string) => {
    setchatBotID(selectedPageID);
    setShowChat(true);
  };

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
      {/*############################højre side################################ */}
      <div
        style={{
          width: "22.5%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "fixed",
          background: "white",
          boxShadow: "0px 0px 8px 1px rgba(0,0,0,0.1)",
          zIndex: 12,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: createUser === true ? "0%" : "92%",
            transition: "height 0.4s ease-in-out",
          }}
        >
          {/*#################################søg################################### */}
          {!createUser && (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "6%",
                  width: "95%",
                  borderRadius: "2px",
                  boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)",
                  marginTop: "2%",
                  padding: "2% 0% 1.75% 0%",
                }}
              >
                <input
                  type="text"
                  placeholder="Søg efter chats..."
                  style={{
                    border: "none",
                    paddingLeft: "2%",
                    outline: "none",
                    fontSize: "20px",
                  }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <div
                  style={{
                    width: "15%",
                    height: "100%",
                    borderRadius: "0px 2px 2px 0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={searchIcon} style={{ width: "55%" }} />
                </div>
              </div>
              {/*####################################################################### */}
              {/*#############################chat liste################################ */}
              <div
                className="chatChoices"
                style={{
                  overflowY: "auto",
                  width: "95%",
                  height: "100%",
                  marginTop: "3%",
                }}
              >
                <ul
                  style={{
                    listStyleType: "none",
                    padding: "0%",
                    marginTop: "1%",
                  }}
                >
                  {filteredChats.map((chatID) => (
                    <li
                      key={chatID}
                      onClick={() => handleListItemClick(chatID)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0% 2% 0% 3%",
                          marginBottom: "2%",
                          borderLeft:
                            chatID === chatBotID
                              ? "10px solid rgb(33, 26, 82)"
                              : "",
                          outline: "none",
                        }}
                      >
                        <p style={{}}>{chatID}</p>
                        <img src={arrowIcon} style={{ width: "10%" }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                style={{
                  background: "rgb(33, 26, 82)",
                  color: "white",
                  marginTop: "-37%",
                  outline: "none",
                  width: "50%",
                }}
                onClick={() => setCreateUser(true)}
              >
                Opret ny chat
              </button>
            </div>
          )}
          {/*####################################################################### */}
        </div>
        <div
          style={{
            width: "95%",
            height: createUser === true ? "92%" : "0%",
            transition: "height 0.4s ease-in-out",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {createUser && (
            <div
              style={{
                marginTop: "4%",
                display: "flex",
                width: "100%",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <button
                style={{ width: "100%", borderRadius: "2px" }}
                onClick={() => {
                  setCreateUser(false);
                  setchatBotID(filteredChats[0]);
                  if (filteredChats.length === 0) {
                    setShowChat(false);
                  }
                }}
              >
                Annuller
              </button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "2px",
                  boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)",
                  marginTop: "3%",
                  padding: "2% 0% 1.75% 0%",
                }}
              >
                <input
                  type="text"
                  placeholder="Søg efter uddannelse..."
                  style={{
                    border: "none",
                    paddingLeft: "2%",
                    outline: "none",
                    fontSize: "20px",
                  }}
                  value={createChatQuery}
                  onChange={handleCreateChatInputChange}
                />
                <div
                  style={{
                    width: "15%",
                    height: "10%",
                    borderRadius: "0px 2px 2px 0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={searchIcon} style={{ width: "55%" }} />
                </div>
              </div>
              <div
                className="chatChoices"
                style={{
                  overflowY: "auto",
                  width: "100%",
                  height: "",
                  marginTop: "3%",
                }}
              >
                <ul
                  style={{
                    listStyleType: "none",
                    padding: "0%",
                    marginTop: "0%",
                  }}
                >
                  {createChatsList.map((createChatID) => (
                    <li
                      key={createChatID}
                      onClick={() => handleCreateChatItemClick(createChatID)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0% 2% 0% 3%",
                          marginBottom: "2%",
                          borderLeft:
                            createChatID === chatBotID
                              ? "10px solid rgb(33, 26, 82)"
                              : "",
                          outline: "none",
                        }}
                      >
                        <p style={{}}>{createChatID}</p>
                        <img src={arrowIcon} style={{ width: "10%" }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      {/*####################################################################### */}
      {/*højre side */}
      <div
        style={{
          width: "80%",
          height: "100%",
          marginLeft: "25%",
          background: "white",
        }}
      >
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
            {!showChat ? (
              <div></div>
            ) : (
              <div
                style={{
                  width: "90%",
                  height: "82.6%",
                  borderRadius: "2px",
                  display: "flex",
                  boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)",
                }}
              >
                <input
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
                  <img
                    src={sendButton}
                    style={{ width: "55%", height: "80%", marginTop: "3%" }}
                  />
                </button>
              </div>
            )}
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
                {!showChat ? (
                  <div>
                    <p>Søg efter en ny uddannelse</p>
                  </div>
                ) : (
                  <div>
                    <p>Stil et spørgsmål for at starte chatten</p>
                  </div>
                )}
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
            {!showChat ? (
              <div>
                <h2>Ingen igangværende chats</h2>
              </div>
            ) : (
              <div style={{ width: "100%", display: "flex" }}>
                <h2 style={{ marginLeft: "2%", width: "83%" }}>{chatBotID}</h2>
                <a
                  href={`${chatBotID}`}
                  style={{
                    width: "5%",
                    height: "80%",
                    margin: "0% 1% 0% 0%",
                    padding: "0%",
                    background: "white",
                  }}
                >
                  <button
                    style={{
                      width: "110%",
                      height: "100%",
                      margin: "30% 1% 0% 0%",
                      padding: "0%",
                      background: "white",
                    }}
                  >
                    <img
                      src={goToIcon}
                      style={{ width: "80%", height: "95%", marginTop: "2.5%" }}
                    />
                  </button>
                </a>
                <button
                  style={{
                    width: "5.5%",
                    height: "80%",
                    margin: "1.3% 2% 0% 0%",
                    padding: "0%",
                    background: "white",
                  }}
                  onClick={handleDeleteChat}
                >
                  <img
                    src={trashIcon}
                    style={{ width: "70%", height: "75%", marginTop: "6%" }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
