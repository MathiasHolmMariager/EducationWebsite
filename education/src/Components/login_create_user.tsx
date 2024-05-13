import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { getDatabase, ref, set } from "firebase/database";
import Select from "react-select";
import { highSchoolDiplomaDict } from "./high_school_diploma";
import { bachelorDiplomaDict } from "./bachelor_diploma";

type UserModalProps = {
  onRequestClose: () => void;
};

type OptionType = { value: string; label: string };

const UserModal: React.FC<UserModalProps> = ({ onRequestClose}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [highSchoolText, setHighSchoolText] = useState("Hent gymnasiebevis");
  const [bachelorText, setBachelorText] = useState("Hent bachelorbevis");
  const [highSchoolDiploma, setHighSchoolDiploma] = useState({});
  const [bachelorDiploma, setBachelorDiploma] = useState({});
  const [selectedInterests, setSelectedInterests] = useState<OptionType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsSigningUp(false);
    setEmail("");
    setPassword("");
    setError("");
  }, [onRequestClose]);

  

  const handleToggleForm = () => {
    setIsSigningUp(!isSigningUp);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user.uid;
      const db = getDatabase();
      const userData = {
        interests: selectedInterests.map((interest) => interest.value),
      };
      set(ref(db, "users/" + user), userData);
      set(ref(db, "users/" + user + "/diploma"), {
        highSchoolDiploma: highSchoolDiploma,
        bachelorDiploma: bachelorDiploma,
        bachelorTitel: "Interaktionsdesign"
      });
      localStorage.setItem("UID", JSON.stringify(user));
      handleCloseModal();
    } catch (error) {
      if (password.length < 6) {
        setError("Password skal være mindst 6 tegn");
      } else {
        setError("Email skal være i et navn@email.com format");
      }
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
    } catch (error) {
      setError("Login mislykkedes ");
    }
  };

  const handleCloseModal = () => {
    onRequestClose();
    setIsSigningUp(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      isSigningUp ? handleSignup(e) : handleLogin(e);
    }
  };

  const interests = [
    { value: "Matematik", label: "Matematik" },
    { value: "Fysik", label: "Fysik" },
    { value: "Programmering", label: "Programmering" },
    { value: "Design", label: "Design" },
    { value: "Psykologi", label: "Psykologi" },
    { value: "Engelsk", label: "Engelsk" },
    { value: "Dansk", label: "Dansk" },
    { value: "Historie", label: "Historie" },
    { value: "Spiludvikling", label: "Spiludvikling" },
    { value: "Entreprenørskab", label: "Entreprenørskab" },
  ];


  const highSchoolClick = () => {
    if (highSchoolText === "Hent gymnasiebevis") {
      setHighSchoolText("Gemt");
      setHighSchoolDiploma(highSchoolDiplomaDict);
    } else {
      setHighSchoolText("Hent gymnasiebevis");
      setHighSchoolDiploma({});
    }
  };

  const bachelorClick = () => {
    if (bachelorText === "Hent bachelorbevis") {
      setBachelorText("Gemt");
      setBachelorDiploma(bachelorDiplomaDict);
    } else {
      setBachelorText("Hent bachelorbevis");
      setBachelorDiploma({});
    }
  };

  return (
    <div className="modal-content" style={{width:"60vh", padding:"30px", margin:"0px",borderRadius:"8px", background:"white", paddingBottom:"0px"}}>
      <div style={{ width:"100%", height:"100%"}}>
      {isSigningUp ? (
        <>
          <h2 style={{ width: "100%", marginTop: "25px" }}>
            Opret konto for at sammenligne uddannelser
          </h2>
          <form onSubmit={handleSignup} onKeyPress={handleKeyPress}>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="email"
                placeholder="Email (test1@email.com)"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "250px",
                  height: "30px",
                  padding: "10px",
                  border: "1px solid",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="password"
                placeholder="Password (123456)"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "250px",
                  height: "30px",
                  padding: "10px",
                  border: "1px solid",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ width: "60%", margin: "auto", marginTop: "20px" }}>
              <Select
                options={interests}
                placeholder="Vælg interesser (valgfri)"
                isMulti
                value={selectedInterests} // Set value prop to selectedInterests state
                onChange={(selectedOptions) =>
                  setSelectedInterests(selectedOptions as OptionType[])
                } // Update selectedInterests state
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={highSchoolClick}
                style={{
                  margin: "20px",
                  width: "60%",
                  backgroundColor: "rgba(100, 100, 100, 0.1)",
                }}
              >
                {highSchoolText}
              </button>
              <button
                type="button"
                onClick={bachelorClick}
                style={{
                  width: "60%",
                  backgroundColor: "rgba(100, 100, 100, 0.1)",
                }}
              >
                {bachelorText}
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "25px",
                }}
              >
                <button
                  onClick={handleCloseModal}
                  style={{
                    margin: "15px",
                    width: "130px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    backgroundColor: "rgba(100, 100, 100, 0.1)",
                  }}
                >
                  Forsæt uden
                </button>
                <button
                  type="submit"
                  style={{
                    margin: "15px",
                    backgroundColor: "rgb(33, 26, 82)",
                    color: "white",
                    width: "130px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                >
                  Opret
                </button>
              </div>
            </div>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ padding: "5px" }}>Har du allerede en konto? </p>
            <p
              onClick={handleToggleForm}
              style={{ padding: "5px", color: "blue", cursor: "pointer" }}
            >
              Login
            </p>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ marginTop: "25px" }}>
            Login for at sammenligne uddanelser
          </h2>
          <form onSubmit={handleLogin} onKeyPress={handleKeyPress} style={{marginBottom:"-10px"}}>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "250px",
                  height: "30px",
                  padding: "10px",
                  border: "1px solid",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "250px",
                  height: "30px",
                  padding: "10px",
                  border: "1px solid",
                  borderRadius: "8px",
                }}
              />
            </div>
            <button
              onClick={handleCloseModal}
              style={{
                margin: "20px",
                width: "120px",
                backgroundColor: "rgba(100, 100, 100, 0.1)",
              }}
            >
              Annuller
            </button>
            <button
              type="submit"
              style={{
                margin: "20px",
                marginTop:"39px",
                backgroundColor: "rgb(33, 26, 82)",
                color: "white",
                width: "120px",
              }}
            >
              Log ind
            </button>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ padding: "5px" }}>Har du ikke allerede en konto? </p>
            <p
              onClick={handleToggleForm}
              style={{ padding: "5px", color: "blue", cursor: "pointer" }}
            >
              Opret bruger
            </p>
          </div>
        </>
      )}
      </div>
      <div style={{ width:"calc(100% + 60px)", height:"40px", marginLeft:"-30px", marginTop:"0px", borderRadius: "0 0 8px 8px", }}>
      {error && (
        <div
          style={{
            width: "100%",
            height:"100%  ",
            backgroundColor: "#FF5252",
            color: "black",
            borderRadius: "0 0 8px 8px",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
          }}
        >
          {error}
        </div>
      )}
      </div>
    </div>
  );
};

export default UserModal;
