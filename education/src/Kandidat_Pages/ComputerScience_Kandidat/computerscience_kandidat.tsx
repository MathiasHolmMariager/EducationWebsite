import { useEffect, useState } from "react";
import Star from "../../assets/Star.png";
import StarGold from "../../assets/Star_Gold.png";
import "./computerscience_kandidat.css";
import dropdownContent from "./Dictionaries/ComputerscienceKand";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { child, get, getDatabase, ref, remove, set } from "firebase/database";
import Chatbox from "../../Components/ChatBox/chatbox";
import collapseLogo from "../../assets/collapse.png";
import expandLogo from "../../assets/expand.png";
import BarChart from "../../Components/barchart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import redExIcon from "../../assets/redExMark.png"
import checkIcon from "../../assets/checkmark.png"

function ComputerscienceKandidat() {
  const [dropdown1Visible, setDropdown1Visible] = useState(false);
  const [dropdown2Visible, setDropdown2Visible] = useState(false);
  const [dropdown3Visible, setDropdown3Visible] = useState(false);
  const [dropdown4Visible, setDropdown4Visible] = useState(false);
  const [dropdown5Visible, setDropdown5Visible] = useState(false);
  const [dropdown6Visible, setDropdown6Visible] = useState(false);
  const [dropdown7Visible, setDropdown7Visible] = useState(false);
  const [dropdown8Visible, setDropdown8Visible] = useState(false);
  const [dropdown9Visible, setDropdown9Visible] = useState(false);
  const [isStarClicked, setIsStarClicked] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

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
        const title = `${dropdownContent.urlCode}`;
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
    const pairToSave = { title: `${dropdownContent.urlCode}`, code: `${dropdownContent.urlCode}` };
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
    localStorage.setItem("PAGE_ID", `${dropdownContent.urlCode}`);
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
      case 9:
        setDropdown9Visible(!dropdown9Visible);
        break;
      default:
        break;
    }
  };

  const handleStarClick = () => {
    if (uid) {
      const title = `${dropdownContent.urlCode}`;
      const code = `${dropdownContent.urlCode}`;
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

  const [accesStatus, setAccesStatus] = useState<"true" | "false" | "na">("na");

  useEffect(() => {
    if (uid) {
      const db = getDatabase();
      const diplomaRef = ref(db, `users/${uid}/diploma/`);
  
      get(child(diplomaRef, "bachelorTitel")).then((snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          console.log(value);
          if (value){
            const adgangskravSubjects = dropdownContent.Adgangskrav;
            
            const Exist = adgangskravSubjects.some(subject => (
              value === subject.bachelor
            ))

            if (Exist) {
              setAccesStatus("true");
            } else {
              setAccesStatus("false");              
            }

          }
        } else {
          setAccesStatus("na");
        }
      });
    }
  }, [uid]);

  return (
    <div className="container">
      <div className="header">
        <h1>{dropdownContent.studyTitel}</h1>
        <img
          src={isStarClicked ? StarGold : Star}
          onClick={handleStarClick}
          className="star"
        />
      </div>
      <div >
        <div
        className="content"
        style={{
          background: "white",
          border: "0px",
          boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          height:"40vh",
          display:"flex", 
          justifyContent:"center",
          alignItems:"center",

        }}>
        <div className="text" style={{display:"flex", flexDirection:"row", height:"100%"}}>
          <div style={{width:"60%"}}>
          {accesStatus === "true" && <div style={{marginTop:"0%",marginBottom:"7%", display: "flex", alignItems:"center"}}><img src={checkIcon} style={{width:"4%", marginRight:"1%"}}/><p >  You meet all requirements for this education </p></div>}
          {accesStatus === "false" && <div style={{marginTop:"0%",marginBottom:"7%", display: "flex", alignItems:"center"}}><img src={redExIcon} style={{width:"4%", marginRight:"1%"}}/><p >  Unfortunately, you do not meet any of the requirements for this education </p></div>}
          {accesStatus === "na" && <div style={{marginTop:"0%",marginBottom:"13.7%", display: "flex", alignItems:"center"}}></div>}
          <div>
          <p style={{marginTop:"0%", fontSize:"20px",paddingRight:"1%", fontWeight:500}}>{dropdownContent["Beskrivelse"]}</p>
          </div>
          </div>
          <div style={{width:"40%"}}>
          <img
            className="iframe-container"
            width="100%"
            height="100%"
            src= {dropdownContent.headerSrcLink}
            style={{ border: "0px" }}
          ></img>
          </div>
        </div>
        </div>
        <div className="picture">
        </div>
      </div>
      <div className="dropdowns">

      <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(1)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown1Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Description
              </p>
              <img
                src={!dropdown1Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown1Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown1Visible && (
            <div className="dropdown-content">
              <div dangerouslySetInnerHTML={{ __html: dropdownContent.langBeskrivelse}}/>
            </div>
          )}
        </div>

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(2)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown2Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Admission requirements
              </p>
              <img
                src={!dropdown2Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown2Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown2Visible && (
            <div style={{ width:"98%", margin:"auto"}}><p style={{fontSize:"20px"}}>Bachelor’s degrees that qualify for admission</p><ul>
            {dropdownContent.Adgangskrav.map((subject, index) => (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "2%" }}>
                  <a style={{width:"100%"}} href={subject.href} target="_blank">
                  <li key={index} style={{ marginLeft: "1%", fontSize:"20px" }}>
                    {subject.bachelor}, {subject.location}
                  </li>
                  </a>
                </div>
            ))}
          </ul><p style={{fontSize:"20px"}}>All qualified applicants who apply before the application deadline 1 March will be offered admission.</p></div>
          )}
        </div>

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(3)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown3Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Location
              </p>
              <img
                src={!dropdown3Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown3Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown3Visible && (
            <div className="dropdown-content">
              <iframe className="iframe-container"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2599.3901224246843!2d9.988981277169266!3d57.0123952942769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464eccdc3b849cf3%3A0xf858a47b27302972!2sCassiopeia%20-%20Institut%20for%20Datalogi%2C%20Selma%20Lagerl%C3%B8fs%20Vej%20300%2C%209220%20Aalborg!5e1!3m2!1sda!2sdk!4v1712823764726!5m2!1sda!2sdk"
                width= "99%"
                height="500px"
              ></iframe>
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
                  color: "rgb(75,75,75)",
                }}
              >
                Semesters
              </p>
              <img
                src={!dropdown4Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown4Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown4Visible && (
            <div className="dropdown-content">
              <div style={{ width: "98%", margin: "auto" }}>
                <ul>
                  {dropdownContent.Semestrene.map((semester, index) => (
                    <li key={index} style={{ fontSize: "20px", listStyleType:"none" }}>
                      <p style={{ fontWeight: 700}}>{semester.name}</p>
                      {semester.semester.map((subj, idx) => (
                        
                        <div key={idx} style={{ marginLeft: "2%",}}>
                          <p style={{ fontSize: "20px", fontWeight:500 }}>{subj.track}</p>
                          <div style={{marginLeft: subj.track === '' ? "0%" : "3%" }}>
                          <p style={{ fontSize: "20px" }}>Projects:</p>
                          <ul style={{ listStyleType: "disc", marginLeft: "2%" }}>
                            {subj.projects.map((project, i) => (
                              <a href={project.href} target="_blank">
                              <li key={i} style={{ fontSize: "20px" }}>
                                {project.projectName}
                              </li>
                              </a>
                            ))}
                          </ul>
                          <p style={{ fontSize: "20px" }}>{semester.ManName}</p>
                          <ul style={{ listStyleType: "disc", marginLeft: "2%" }}>
                            {subj.ManCourses.map((course, i) => (
                              <a href={course.href} target="_blank">
                              <li key={i} style={{ fontSize: "20px" }}>
                                {course.courseName}
                              </li>
                              </a>
                            ))}
                          <p style={{ fontSize: "20px", marginLeft:"-6.7%" }}>{semester.OptName}</p>
                              {subj.OptCourses.map((course, i) => (
                              <a href={course.href} target="_blank">
                              <li key={i} style={{ fontSize: "20px" }}>
                                {course.courseName}
                              </li>
                              </a>
                            ))}
                          </ul>
                          </div>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(5)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown5Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Time consumption
              </p>
              <img
                src={!dropdown5Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown5Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown5Visible && (
            <div className="dropdown-content">
              <div style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: "auto" }}>Weekly working hours:</h4>
                  <h4 style={{ margin: "auto" }}>Distribution of working hours:</h4>
                </div>
                <div
                  style={{
                    fontSize:"18px",
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
                    <BarChart data={dropdownContent.tidsforbrug} width={200} height={250} />
                  </div>
                  <div           >
                    <div style={{ marginBottom: "20px" }}>
                      <ResponsiveContainer width="100%" height={336}>
                        <PieChart >
                          <Pie
                            data={dropdownContent.Tidsfordeling}
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
                            {dropdownContent.Tidsfordeling.map((_entry, index) => (
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
                        marginTop: "-47px",
                        marginLeft: "0%",
                        width: "100%",
                      }}
                    >
                      {dropdownContent.Tidsfordeling.map((item, index) => (
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

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(6)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown6Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Possible jobs
              </p>
              <img
                src={!dropdown6Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown6Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown6Visible && (
            <div style={{ width:"98%", margin:"auto"}}><p style={{fontSize:"20px"}}>Some of the possible future jobs are:</p><ul>
            {dropdownContent.Jobs.map((subject, index) => (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "2%" }}>
                  <li key={index} style={{ marginLeft: "1%", fontSize:"20px" }}>
                    {subject.name}
                  </li>
                </div>
            ))}
          </ul>
          </div>
          )}
        </div>

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(7)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown7Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Wages
              </p>
              <img
                src={!dropdown7Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown7Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
          {dropdown7Visible && (
            <div className="dropdown-content">
              <div style={{ pointerEvents: 'none', display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",}}>
                <div
                  style={{
                    width:"100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{marginRight:"10%",}}>Wage after graduation:</h4>
                  <h4 style={{marginLeft:"10%"}}>Wage after 10 years:</h4>
                </div>
                <div style={{display:"flex"}}>
                  <div>
                    <BarChart data={dropdownContent.FørsteÅrLøn} width={200} height={250} />
                  </div>
                  <div style={{ marginBottom: "20px", width:"100%" }}>
                    <BarChart data={dropdownContent.TiÅrLøn} width={200} height={250} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(8)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown8Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Social evaluation
              </p>
              <img
                src={!dropdown8Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown8Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
        {dropdown8Visible && (
          <div className="dropdown-content">
            <div>
              <p>Social aspects evaluated by the students on the study program</p>
              <progress className="progress-bar" value={dropdownContent.socialBedømmelse} max="500"></progress>
            </div>
          </div>
        )}
      </div>

      <div className="dropdown" style={{ background: "white", border: "0px", width: "100%" }}>
      <button className="dropdown-button" onClick={() => toggleDropdown(9)}>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "0%",
                  width: dropdown9Visible ? "90%" : "calc(90% - 5px)",
                  color: "rgb(75,75,75)",
                }}
              >
                Job possibility evaluation
              </p>
              <img
                src={!dropdown9Visible ? expandLogo : collapseLogo}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: !dropdown9Visible ? "75px" : "100px",
                  marginTop: "0.5%",
                }}
              />
            </div>
          </button>
        {dropdown9Visible && (
          <div className="dropdown-content">
            <div>
              <p>Unemployment rate among recent graduated students from the study program</p>
              <progress className="progress-bar" value={dropdownContent.jobbedømmelse} max="500"></progress>
            </div>
          </div>
        )}
      </div>
        
      </div>
      <Chatbox />
    </div>
  );
}

export default ComputerscienceKandidat;