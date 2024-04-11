import { useState, useEffect, useRef } from "react";
import home_icon from "../assets/home.png";
import search_icon from "../assets/search.png";
import chat_icon from "../assets/chat.png";
import profile_icon from "../assets/profile.png";
import UserModal from "./login_create_user";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const openDropdown = () => {
    setShowDropdown(false);
  };

  const closeDropdown = () => {
    setShowDropdown(true);
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
        justifyContent: "space-between",
        alignItems: "center",
        width: "calc(100% + 16px)",
        backgroundColor: "rgb(33, 26, 82)",
        margin: "auto",
        marginTop: "-0px",
        marginLeft: "-8px",
      }}
    >
      <div>
        <a href="/">
          <img
            src={home_icon}
            style={{ width: "40px", height: "40px", marginLeft: "40px" }}
            alt="Home"
          />
        </a>
      </div>
      <div>
        <a href="/search">
          <img
            src={search_icon}
            style={{ width: "40px", height: "40px", marginRight: "40px" }}
            alt="Search"
          />
        </a>
        <a href="/chat">
          <img
            src={chat_icon}
            style={{ width: "43px", height: "43px", marginRight: "40px" }}
            alt="Chat"
          />
        </a>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={profile_icon}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "40px",
              cursor: "pointer",
            }}
            onClick={showDropdown ? openDropdown : closeDropdown}
            alt="Profile"
          />
          {showDropdown && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                backgroundColor: "#f9f9f9",
                minWidth: "200px",
                boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                zIndex: 1,
                right: "40px",
                top: "52px",
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
                      }}
                    >
                      Se profil
                    </button>
                  </a>
                  <button
                    onClick={signOutButtonClick}
                    style={{
                      marginLeft: "10%",
                      width: "80%",
                      marginTop: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    Log ud
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
                      marginBottom: "5px",
                    }}
                  >
                    Log ind
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {user ? null : <UserModal isOpen={modalIsOpen} onRequestClose={closeModal} />}
    </div>
  );
}

export default Header;
