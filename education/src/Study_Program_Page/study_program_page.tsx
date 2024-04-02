import { useEffect, useState } from "react";
import Interaction_Design from "../assets/Interaction_Design.jpg";
import Star from "../assets/Star.png";
import StarGold from "../assets/Star_Gold.png";
import "./study_program_page.css";
import { getDatabase, ref, set } from "firebase/database";

function StudyProgramPage() {
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);
  const [dropdown3Visible, setDropdown3Visible] = useState(false);
  const [dropdown4Visible, setDropdown4Visible] = useState(false);
  const [isStarClicked, setIsStarClicked] = useState(false);

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
      default:
        break;
    }
  };

  const handleStarClick = () => {
    setIsStarClicked(!isStarClicked);
    const uid = localStorage.getItem("UID");
    const title = "interaktionsdesign, Bachlor";
    const code = "study";
    const db = getDatabase();
    set(ref(db, "users/" + uid + "/favorits/" + title), {
      code: code,
      title: title,
    });
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
            På uddannelsen lærer du at designe interaktive, digitale løsninger
            med fokus på brugeroplevelse, anvendelseskvalitet og æstetik. Du
            skal bl.a. fordybe dig i visuelt design, prototyping, usability og
            user experience. Du bliver en nøglespiller i fremtidens
            produktudvikling.
          </p>
        </div>
        <div className="picture">
          <img src={Interaction_Design} />
        </div>
      </div>
      <div className="dropdowns">
        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(1)}>
            Job muligheder
          </button>
          {dropdown1Visible && (
            <div className="dropdown-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              pellentesque faucibus molestie. Suspendisse id posuere ante, a
              porta mauris. Fusce sodales augue nec eros porta lobortis. Integer
              commodo erat vitae elit viverra, vehicula ornare ligula rhoncus.
              Aliquam hendrerit metus lectus, eu tincidunt dolor vestibulum id.
              Cras nec ex lectus. Sed at arcu sed enim facilisis consectetur nec
              nec turpis. Sed euismod dolor ac velit semper, ac blandit est
              consequat. Integer tincidunt molestie volutpat. Aliquam eget odio
              sed metus malesuada bibendum quis at dui. Mauris gravida, ipsum
              sed interdum varius, quam sem scelerisque diam, ut ornare neque
              mauris ut dui. Maecenas mollis mi magna, at volutpat libero
              viverra a. Phasellus sit amet risus rutrum, interdum tellus sit
              amet, mattis purus. Nam vehicula nisl velit, ac pellentesque ipsum
              lobortis et. Mauris scelerisque lectus sit amet nibh congue
              tempus.
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(2)}>
            Videre uddanelse
          </button>
          {dropdown2Visible && (
            <div className="dropdown-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              pellentesque faucibus molestie. Suspendisse id posuere ante, a
              porta mauris. Fusce sodales augue nec eros porta lobortis. Integer
              commodo erat vitae elit viverra, vehicula ornare ligula rhoncus.
              Aliquam hendrerit metus lectus, eu tincidunt dolor vestibulum id.
              Cras nec ex lectus. Sed at arcu sed enim facilisis consectetur nec
              nec turpis. Sed euismod dolor ac velit semper, ac blandit est
              consequat. Integer tincidunt molestie volutpat. Aliquam eget odio
              sed metus malesuada bibendum quis at dui. Mauris gravida, ipsum
              sed interdum varius, quam sem scelerisque diam, ut ornare neque
              mauris ut dui. Maecenas mollis mi magna, at volutpat libero
              viverra a. Phasellus sit amet risus rutrum, interdum tellus sit
              amet, mattis purus. Nam vehicula nisl velit, ac pellentesque ipsum
              lobortis et. Mauris scelerisque lectus sit amet nibh congue
              tempus.
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(3)}>
            De forskellige semestre
          </button>
          {dropdown3Visible && (
            <div className="dropdown-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              pellentesque faucibus molestie. Suspendisse id posuere ante, a
              porta mauris. Fusce sodales augue nec eros porta lobortis. Integer
              commodo erat vitae elit viverra, vehicula ornare ligula rhoncus.
              Aliquam hendrerit metus lectus, eu tincidunt dolor vestibulum id.
              Cras nec ex lectus. Sed at arcu sed enim facilisis consectetur nec
              nec turpis. Sed euismod dolor ac velit semper, ac blandit est
              consequat. Integer tincidunt molestie volutpat. Aliquam eget odio
              sed metus malesuada bibendum quis at dui. Mauris gravida, ipsum
              sed interdum varius, quam sem scelerisque diam, ut ornare neque
              mauris ut dui. Maecenas mollis mi magna, at volutpat libero
              viverra a. Phasellus sit amet risus rutrum, interdum tellus sit
              amet, mattis purus. Nam vehicula nisl velit, ac pellentesque ipsum
              lobortis et. Mauris scelerisque lectus sit amet nibh congue
              tempus.
            </div>
          )}
        </div>
        <div className="dropdown">
          <button className="dropdown-button" onClick={() => toggleDropdown(4)}>
            Statistikker
          </button>
          {dropdown4Visible && (
            <div className="dropdown-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              pellentesque faucibus molestie. Suspendisse id posuere ante, a
              porta mauris. Fusce sodales augue nec eros porta lobortis. Integer
              commodo erat vitae elit viverra, vehicula ornare ligula rhoncus.
              Aliquam hendrerit metus lectus, eu tincidunt dolor vestibulum id.
              Cras nec ex lectus. Sed at arcu sed enim facilisis consectetur nec
              nec turpis. Sed euismod dolor ac velit semper, ac blandit est
              consequat. Integer tincidunt molestie volutpat. Aliquam eget odio
              sed metus malesuada bibendum quis at dui. Mauris gravida, ipsum
              sed interdum varius, quam sem scelerisque diam, ut ornare neque
              mauris ut dui. Maecenas mollis mi magna, at volutpat libero
              viverra a. Phasellus sit amet risus rutrum, interdum tellus sit
              amet, mattis purus. Nam vehicula nisl velit, ac pellentesque ipsum
              lobortis et. Mauris scelerisque lectus sit amet nibh congue
              tempus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyProgramPage;
