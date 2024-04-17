import { useEffect, useState } from "react";
import Star from "../../assets/Star.png"
import StarGold from "../../assets/Star_Gold.png";
import "./medialogi_bachelor.css";
import dropdownContent from "./Dictionaries/MedialogiBach";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import Chatbox from "../../Components/ChatBox/chatbox";

function MedialogiBachelor() {
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);
  const [dropdown3Visible, setDropdown3Visible] = useState(false);
  const [dropdown4Visible, setDropdown4Visible] = useState(false);
  const [dropdown5Visible, setDropdown5Visible] = useState(false);
  const [dropdown6Visible, setDropdown6Visible] = useState(false);
  const [dropdown7Visible, setDropdown7Visible] = useState(false);
  const [dropdown8Visible, setDropdown8Visible] = useState(false);
  const [isStarClicked, setIsStarClicked] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUid(user.uid);
        const db = getDatabase();
        const title = "Medialogi, Bachelor";
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
    const pairToSave = { title: "Medialogi, Bachelor", code: "Medialogi, Bachelor" };
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
    localStorage.setItem("PAGE_ID", "Medialogi, Bachelor");
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
      case 8:
        setDropdown8Visible(!dropdown8Visible);
        break;
      default:
        break;
    }
  };

  const handleStarClick = () => {
    if (uid) {
      const title = "Medialogi, Bachelor";
      const code = "Medialogi, Bachelor";
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
        <h1>Medialogi - Aalborg - Bachelor</h1>
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
        <div>
        <iframe className="iframe-container"
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/DgJl6oxDY8o"
          ></iframe>
        </div>
      </div>
      <div className="dropdowns">

      <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(1)}>
            Beskrivelse
          </button>
          {dropdown1Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Længere beskrivelse"] }}/>
                <iframe className="iframe-container"
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/M2tW5UH21Po?si=glrP6o_xwRIrONZ4"
                ></iframe>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(2)}>
            Adgangskrav
          </button>
          {dropdown2Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Adgangskrav"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(3)}>
            Adgangskvotient
          </button>
          {dropdown3Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Adgangskvotient"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(4)}>
            Kandidat muligheder
          </button>
          {dropdown4Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Kandidat muligheder"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(5)}>
            Lokation
          </button>
          {dropdown5Visible && (
            <div className="dropdown-content">
              <iframe className="iframe-container"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2599.3901224246843!2d9.988981277169266!3d57.0123952942769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464eccdc3b849cf3%3A0xf858a47b27302972!2sCassiopeia%20-%20Institut%20for%20Datalogi%2C%20Selma%20Lagerl%C3%B8fs%20Vej%20300%2C%209220%20Aalborg!5e1!3m2!1sda!2sdk!4v1712823764726!5m2!1sda!2sdk"
                width= "99%"
                height="500px"
              ></iframe>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(6)}>
            Semestre
          </button>
          {dropdown6Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Semestre"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(7)}>
            Frafald
          </button>
          {dropdown7Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent["Frafald"] }}/>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(8)}>
            Tidsforbrug
          </button>
          {dropdown8Visible && (
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

export default MedialogiBachelor;