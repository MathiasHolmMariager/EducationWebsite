import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { auth } from "./firebase";
import { getDatabase, ref, set } from "firebase/database";
import Select from "react-select";
import { highSchoolDiplomaDict } from "./high_school_diploma";
import { bachelorDiplomaDict } from "./bachelor_diploma";

Modal.setAppElement("#root");

type UserModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [highSchoolText, setHighSchoolText] = useState('Hent gymnasiebevis');
  const [bachelorText, setBachelorText] = useState('Hent bachelorbevis');
  const [highSchoolDiploma, setHighSchoolDiploma] = useState({});
  const [bachelorDiploma, setBachelorDiploma] = useState({});
  
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user.uid;
      const db = getDatabase();
      const userData = {
        email: email,
      };
      set(ref(db, "users/" + user), userData);
      set(ref(db, "users/" + user+ "/diploma"), {
        highSchoolDiploma: highSchoolDiploma,
        bachelorDiploma: bachelorDiploma
      })
      localStorage.setItem("UID", JSON.stringify(user));
      handleCloseModal();
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

  const interests = [
    { value: "matematik", label: "Matematik" },
    { value: "fysik", label: "Fysik" },
    { value: "programmering", label: "Programmering" },
  ];

  const highSchoolClick = () => {
    if (highSchoolText === 'Hent gymnasiebevis') {
      setHighSchoolText('Gemt');
      setHighSchoolDiploma(highSchoolDiplomaDict);
    } else {
      setHighSchoolText('Hent gymnasiebevis');
      setHighSchoolDiploma({});
    }
  };

  const bachelorClick = () => {
    if (bachelorText === 'Hent bachelorbevis') {
      setBachelorText('Gemt');
      setBachelorDiploma(bachelorDiplomaDict);
    } else {
      setBachelorText('Hent bachelorbevis');
      setBachelorDiploma({});
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
            <div style={{ width: "60%", margin: "auto", marginTop: "20px" }}>
              <Select
                options={interests}
                placeholder="Vælg interesser (valgfri)"
                isMulti
                
              />
            </div>
            <button
              type="button"
              onClick={highSchoolClick}
              style={{ margin: "20px", width: "60%" }}
            >
              {highSchoolText}
            </button>
            <button
              type="button"
              onClick={bachelorClick}
              style={{ margin: "20px", width: "60%" }}
            >
              {bachelorText}
            </button>
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