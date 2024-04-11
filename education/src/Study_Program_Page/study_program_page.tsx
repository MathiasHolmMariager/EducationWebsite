import { useEffect, useState } from "react";
import Interaction_Design from "../assets/Interaction_Design.jpg";
import Star from "../assets/Star.png";
import StarGold from "../assets/Star_Gold.png";
import "./study_program_page.css";
import dropdownContent from "./Dictionaries/IxdBach";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import Chatbox from "../Components/ChatBox/chatbox";
import GoogleMaps from "./Maps/IxdBachMaps";

function StudyProgramPage() {
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);
  const [dropdown3Visible, setDropdown3Visible] = useState(false);
  const [dropdown4Visible, setDropdown4Visible] = useState(false);
  const [dropdown5Visible, setDropdown5Visible] = useState(false);
  const [dropdown6Visible, setDropdown6Visible] = useState(false);
  const [dropdown7Visible, setDropdown7Visible] = useState(false);
  const [isStarClicked, setIsStarClicked] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUid(user.uid);
        const db = getDatabase();
        const title = "Interaktionsdesign, Bachlor";
        const favRef = ref(db, `users/${user.uid}/favorites/${title}`);
        get(favRef).then((snapshot: { exists: () => any; }) => {
          if (snapshot.exists()) {
            setIsStarClicked(true);
          }
        }).catch((error) => {
          console.error("Error fetching data:", error);
        });
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);
  //#####################LAST_SEEN_STUDY_PROGRAMS############################
  useEffect(() => {
    const pairToSave = { title: "Interaktionsdesign, Bachlor", code: "study" };
    const savedListString = localStorage.getItem("LAST_SEEN");
    let existingList = savedListString ? JSON.parse(savedListString) : [];
    let index = -1;
    for (let i = 0; i < existingList.length; i++) {
      if (
        existingList[i].title === pairToSave.title &&
        existingList[i].code === pairToSave.code
      ) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      existingList.splice(index, 1);
    }
    existingList.unshift(pairToSave);
    if (existingList.length > 5) {
      existingList = existingList.slice(0, 5);
    }
    localStorage.setItem("LAST_SEEN", JSON.stringify(existingList));
  }, []);
  //#####################LAST_SEEN_STUDY_PROGRAMS############################

  const toggleDropdown = (dropdownNumber: number) => {
    switch (dropdownNumber) {
      case 1:
        setDropdown1Visible(!dropdown1Visible);
        break;
      case 2:
        setDropdown2Visible(!dropdown2Visible);
        break;
      case 3:
        setDropdown3Visible(!dropdown3Visible);
        break;
      case 4:
        setDropdown4Visible(!dropdown4Visible);
        break;
      case 5:
        setDropdown5Visible(!dropdown5Visible);
        break;
      case 6:
        setDropdown6Visible(!dropdown6Visible);
        break;
      case 7:
        setDropdown7Visible(!dropdown7Visible);
        break;
      default:
        break;
    }
  };

  const handleStarClick = () => {
    if (uid) {
      const title = "Interaktionsdesign, Bachlor";
      const code = "study";
      const db = getDatabase();
      const favRef = ref(db, `users/${uid}/favorites/${title}`);
      
      if (isStarClicked) {
        remove(favRef).then(() => {
          setIsStarClicked(false);
        }).catch((error) => {
          console.error("Error removing data:", error);
        });
      } else {
        set(favRef, { code: code, title: title }).then(() => {
          setIsStarClicked(true);
        }).catch((error) => {
          console.error("Error adding data:", error);
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Interaktionsdesign - Aalborg - Bachelor</h1>
        <img
          src={isStarClicked ? StarGold : Star}
          onClick={handleStarClick}
          className="star"
        />
      </div>
      <div className="content">
        <div className="text">
          <p>
            {dropdownContent["Beskrivelse"]}
          </p>
        </div>
        <div className="picture">
          <img src={Interaction_Design}/>
        </div>
      </div>
      <div className="dropdowns">

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(1)}>
            Adgangskrav
          </button>
          {dropdown1Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Adgangskrav"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(2)}>
            Adgangskvotient
          </button>
          {dropdown2Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Adgangskvotient"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(3)}>
            Kandidat muligheder
          </button>
          {dropdown3Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Kandidat muligheder"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(4)}>
            Lokation
          </button>
          {dropdown4Visible && (
            <div className="dropdown-content">
              <GoogleMaps/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(5)}>
            Semestre
          </button>
          {dropdown5Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Semestre"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(6)}>
            Frafald
          </button>
          {dropdown6Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Frafald"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(7)}>
            Tidsforbrug
          </button>
          {dropdown7Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Tidsforbrug"] }}/>
            </div>
          )}
        </div>
        
      </div>
      <Chatbox />
    </div>
  );
}

export default StudyProgramPage;
