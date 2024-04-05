import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { auth } from "./firebase";
import { getDatabase, ref, set } from "firebase/database";

Modal.setAppElement("#root");

type UserModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  const handleToggleForm = () => {
    setIsSigningUp(!isSigningUp);
    setEmail("");
    setPassword("");
  };

  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user.uid;
          const db = getDatabase();
          set(ref(db, "users/" + user), {
            email: email,
          });
          localStorage.setItem("UID", JSON.stringify(user));
          handleCloseModal();
        }
      );
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          localStorage.setItem("UID", JSON.stringify(user));
          handleCloseModal();
        }
      );
    } catch (error) {}
  };

  const handleCloseModal = () => {
    onRequestClose();
    setIsSigningUp(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      isSigningUp ? handleSignup(e) : handleLogin(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Example Modal"
      style={{
        content: {
          width: "30%",
          height: "90%",
          margin: "auto",
          textAlign: "center",
        },
      }}
    >
      {isSigningUp ? (
        <>
          <h2>Opret konto for at sammenligne uddannelser</h2>
          <form onSubmit={handleSignup} onKeyPress={handleKeyPress}>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "250px", height: "30px", padding: "10px" }}
              />
            </div>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "250px", height: "30px", padding: "10px" }}
              />
            </div>
            <button
              onClick={handleCloseModal}
              style={{ margin: "20px", width: "120px" }}
            >
              Forsæt uden
            </button>
            <button
              type="submit"
              style={{
                margin: "20px",
                backgroundColor: "rgb(33, 26, 82)",
                color: "white",
                width: "120px",
              }}
            >
              opret
            </button>
          </form>
          <p>
            Har du allerede en konto?{" "}
            <button onClick={handleToggleForm}>Login</button>
          </p>
        </>
      ) : (
        <>
          <h2>Login for at sammenligne uddanelser</h2>
          <form onSubmit={handleLogin} onKeyPress={handleKeyPress}>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "250px", height: "30px", padding: "10px" }}
              />
            </div>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "250px", height: "30px", padding: "10px" }}
              />
            </div>
            <button
              onClick={handleCloseModal}
              style={{ margin: "20px", width: "120px" }}
            >
              Annuller
            </button>
            <button
              type="submit"
              style={{
                margin: "20px",
                backgroundColor: "rgb(33, 26, 82)",
                color: "white",
                width: "120px",
              }}
            >
              Log ind
            </button>
          </form>
          <p>
            Har du ikke allerede en konto?{" "}
            <button onClick={handleToggleForm}>Signup</button>
          </p>
        </>
      )}
    </Modal>
  );
};

export default UserModal;
