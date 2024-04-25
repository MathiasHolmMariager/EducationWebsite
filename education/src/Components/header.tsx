import { useState, useEffect } from "react";
import home_icon from "../assets/home.png";
import search_icon from "../assets/search.png";
import chat_icon from "../assets/chat.png";
import profile_icon from "../assets/profile.png";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import UserModal from "./login_create_user";
import profileIcon from "../assets/profileLogo.png"
import loginIcon from "../assets/loginIcon.png"
import logoutIcon from "../assets/logoutIcon.png"
import compare_Icon from "../assets/compare.png"

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.profileDropdown')) {
        setShowDropdown(false);
      }
    };
  
    window.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const openDropdown = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
    setShowDropdown(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const signInButtonClick = () => {
    if (!user) {
      openModal();
    }
  };

  const signOutButtonClick = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0px",
        right: "0px",
        zIndex: 9999,
        display: "flex",
        height: "8vh",
        justifyContent: "left",
        alignItems: "center",
        width: "calc(100% + 16px)",
        backgroundColor: "rgb(33, 26, 82)",
        margin: "auto",
        marginTop: "-0px",
        marginLeft: "-8px"
      }}
    >
      <div style={{ width: "2.5%", height: "70%", marginLeft: "2.5%", marginRight:"75%", display:"flex", justifyContent: "center", alignItems:"center"}}>
        <a href="/" style={{ width: "100%", height: "100%", display:"flex", justifyContent: "center", alignItems:"center"}}>
          <img
            src={home_icon}
            style={{ width: "90%", height: "90%",}}
          />
        </a>
      </div>
      <div style={{ width: "2.5%", height: "70%", marginLeft: "2%", display:"flex", justifyContent: "center", alignItems:"center"}}>
        <a href="/search" style={{ width: "100%", height: "100%", display:"flex", justifyContent: "center", alignItems:"center"}}>
          <img
            src={search_icon}
            style={{ width: "90%",}}
          />
        </a>
      </div>
      <div style={{ width: "2.5%", height: "70%", marginLeft: "2%", display:"flex", justifyContent: "center", alignItems:"center"}}>
        <a href="/compare" style={{ width: "100%", height: "100%", display:"flex", justifyContent: "center", alignItems:"center"}}>
          <img
            src={compare_Icon}
            style={{ width: "90%"}}
          />
        </a>
      </div>
      <div style={{ width: "2.5%", height: "70%", marginLeft: "2%", display:"flex", justifyContent: "center", alignItems:"center"}}>
        <a href="/chat" style={{ width: "100%", height: "100%", display:"flex", justifyContent: "center", alignItems:"center"}}>
          <img
            src={chat_icon}
            style={{ width: "100%",}}
          />
        </a>
      </div>
        <div className="profileDropdown" style={{ width: "2.5%", height: "70%", marginLeft: "2%", marginRight:"0%", display:"flex", justifyContent: "center", alignItems:"center"}}>
          <img
            src={profile_icon}
            style={{
              width: "100%",
              height: "90%",
              cursor: "pointer",
            }}
            onClick={!showDropdown ? openDropdown : closeDropdown}
            alt="Profile"
          />
          {showDropdown && (
            <div
              className="dropdown"
              style={{
                position: "absolute",
                backgroundColor: "white",
                minWidth: "200px",
                boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
                zIndex: 1,
                right: "1vh",
                top: "8vh",
                border:"none",
                borderRadius:"0px 0px 6px 6px"
              }}
            >
              {user ? (
                <div>
                  <a href="/profile">
                    <button
                      style={{
                        marginLeft: "10%",
                        width: "80%",
                        marginTop: "10px",
                        marginBottom: "5px",
                        background: "white",
                        display:"flex",
                        justifyContent:"left",
                        alignItems:"center",
                        padding:"0%"
                      }}

                    >
                      <img src={profileIcon} style={{width:"20%", marginLeft:"10%"}} />
                      <p style={{width:"", height:"100%", textAlign:"left", paddingLeft:"20%"}}>Profil</p>
                      
                    </button>
                  </a>
                  <button
                    onClick={signOutButtonClick}
                    style={{
                      marginLeft: "10%",
                      width: "80%",
                      marginTop: "5px",
                      marginBottom: "13px",
                      background: "white",
                      display:"flex",
                      justifyContent:"left",
                      alignItems:"center",
                      padding:"0%"
                    }}
                  >
                      <img src={logoutIcon} style={{width:"20%", marginLeft:"11%"}} />
                      <p style={{width:"", height:"100%", textAlign:"left", paddingLeft:"19%"}}>Log ud</p>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={signInButtonClick}
                    style={{
                      marginLeft: "10%",
                      width: "80%",
                      marginTop: "5px",
                      marginBottom: "7px",
                      background: "white",
                      display:"flex",
                      justifyContent:"left",
                      alignItems:"center",
                      padding:"0%"
                    }}
                  >
                      <img src={loginIcon} style={{width:"20%", marginLeft:"11%"}} />
                      <p style={{width:"", height:"100%", textAlign:"left", paddingLeft:"19%"}}>Log ind</p>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      {user ? null : (
        <div
          style={{
            display: modalIsOpen ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserModal onRequestClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
