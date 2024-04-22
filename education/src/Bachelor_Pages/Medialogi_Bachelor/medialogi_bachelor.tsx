import { useEffect, useState } from "react";
import Star from "../../assets/Star.png";
import StarGold from "../../assets/Star_Gold.png";
import "./medialogi_bachelor.css";
import dropdownContent from "./Dictionaries/MedialogiBach";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import Chatbox from "../../Components/ChatBox/chatbox";
import collapseLogo from "../../assets/collapse.png";
import expandLogo from "../../assets/expand.png";
import BarChart from "../../Components/barchart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
  const value1 = parseFloat(dropdownContent.Tidsforbrug.split("-")[1]);
  const value2 = parseFloat(dropdownContent.Tidsforbrug.split("-")[2]);
  const value3 = parseFloat(dropdownContent.Tidsfordeling.split("-")[1]);
  const value4 = parseFloat(dropdownContent.Tidsfordeling.split("-")[2]);
  const value5 = parseFloat(dropdownContent.Tidsfordeling.split("-")[3]);

  const tidsforbrug = [
    { name: "Informationsteknologi", value: value2, fill: "lightgreen" },
    { name: "Gns. bachelor", value: value1, fill: "lightblue" },
  ];

  const Tidsfordeling = [
    { name: "Forberedelse", value: value3, fill: "orange" },
    { name: "Undervisning", value: value4, fill: "pink" },
    { name: "Opgaver", value: value5, fill: "yellow" },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
  }: any) => {
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUid(user.uid);
        const db = getDatabase();
        const title = "Medialogi, Bachelor";
        const favRef = ref(db, `users/${user.uid}/favorites/${title}`);
        get(favRef)
          .then((snapshot: { exists: () => any }) => {
            if (snapshot.exists()) {
              setIsStarClicked(true);
            }
          })
          .catch((error) => {
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
    const pairToSave = {
      title: "Medialogi, Bachelor",
      code: "Medialogi, Bachelor",
    };
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
        remove(favRef)
          .then(() => {
            setIsStarClicked(false);
          })
          .catch((error) => {
            console.error("Error removing data:", error);
          });
      } else {
        set(favRef, { code: code, title: title })
          .then(() => {
            setIsStarClicked(true);
          })
          .catch((error) => {
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
      <div
        className="content"
        style={{
          background: "white",
          border: "0px",
          boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <div className="text">
          <p>{dropdownContent["Beskrivelse"]}</p>
        </div>
        <div>
          <iframe
            className="iframe-container"
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/Z7UH2tTaqwY?autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fwww.aau.dk"
            style={{ border: "0px" }}
          ></iframe>
        </div>
      </div>
      <div className="dropdowns">
        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(1)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown1Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Beskrivelse
              </p>
              <img
                src={!dropdown1Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown1Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown1Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: dropdownContent["Længere beskrivelse"],
                }}
              />
              <iframe
                className="iframe-container"
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/VYHhhw2_5Rs?autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fwww.aau.dk"
                style={{ border: "0px" }}
              ></iframe>
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(2)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown2Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Adgangskrav
              </p>
              <img
                src={!dropdown2Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown2Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown2Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: dropdownContent["Adgangskrav"],
                }}
              />
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(3)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown3Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Adgangskvotient
              </p>
              <img
                src={!dropdown3Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown3Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown3Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: dropdownContent["Adgangskvotient"],
                }}
              />
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(4)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown4Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Kandidat muligheder
              </p>
              <img
                src={!dropdown4Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown4Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown4Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: dropdownContent["Kandidat muligheder"],
                }}
              />
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(5)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown5Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Lokation
              </p>
              <img
                src={!dropdown5Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown5Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown5Visible && (
            <div className="dropdown-content">
              <iframe
                className="iframe-container"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5193.746211569931!2d9.927234377171036!3d57.04840009146357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46493292e965474d%3A0xca60b6afd66137eb!2sRendsburggade%2014%2C%209000%20Aalborg!5e1!3m2!1sda!2sdk!4v1713776049680!5m2!1sda!2sdk"
                width="99%"
                height="500px"
                style={{ border: "0px" }}
              ></iframe>
            </div>
          )}
        </div>
        
        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(6)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown6Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Semestre
              </p>
              <img
                src={!dropdown6Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown6Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown6Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: dropdownContent["Semestre"],
                }}
              />
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(7)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown7Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Frafald
              </p>
              <img
                src={!dropdown7Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown7Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown7Visible && (
            <div className="dropdown-content">
              <div
                dangerouslySetInnerHTML={{ __html: dropdownContent["Frafald"] }}
              />
            </div>
          )}
        </div>

        <div
          className="dropdown"
          style={{ background: "white", border: "0px", width: "100%" }}
        >
          <button className="dropdown-button" onClick={() => toggleDropdown(8)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown8Visible ? "90%" : "calc(90% - 5px)",
                  color:"rgb(75,75,75)"
                }}
              >
                Tidsforbrug
              </p>
              <img
                src={!dropdown8Visible ? expandLogo : collapseLogo}
                style={{
                  width:"30px",
                  height:"30px",
                  marginLeft: !dropdown8Visible ? "75px": "100px",
                  marginTop:"0.5%",
                }}
              />
            </div>
          </button>
          {dropdown8Visible && (
            <div className="dropdown-content">
              <div style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: "auto" }}>Ugentlige arbejdstimer:</h4>
                  <h4 style={{ margin: "auto" }}>Fordeling af arbejdstimer:</h4>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "0px",
                      margin: "0px",
                      width: "50%",
                    }}
                  >
                    <BarChart data={tidsforbrug} width={200} height={250} />
                  </div>
                  <div
                    style={{
                      width: "50%",
                    }}
                  >
                    <div style={{ marginBottom: "20px" }}>
                      <ResponsiveContainer width="100%" height={336}>
                        <PieChart >
                          <Pie
                            data={Tidsfordeling}
                            cx="50%"
                            cy="50%"
                            innerRadius="20%"
                            outerRadius="70%"
                            paddingAngle={0}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                            isAnimationActive={false}
                          >
                            {Tidsfordeling.map((_entry, index) => (
                              <Cell key={`cell-${index}`} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "-45px",
                        marginLeft: "0%",
                        width: "100%",
                      }}
                    >
                      {Tidsfordeling.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            padding: "2%",
                            margin: "auto",
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              marginRight: "5px",
                              backgroundColor: item.fill,
                              marginTop: "11px",
                            }}
                          ></div>
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Chatbox />
    </div>
  );
}

export default MedialogiBachelor;
