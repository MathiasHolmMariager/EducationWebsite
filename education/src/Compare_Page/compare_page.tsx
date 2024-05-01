import { useEffect, useState} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import "./compare_page.css"
import aboutIcon from "../assets/abouticon.png"
import greyAboutIcon from "../assets/abouticonGray.png"
import expandIcon from "../assets/expand1.png"
import collapseIcon from "../assets/collapseWhite1.png"
import whiteSearch from "../assets/search.png"
import greySearch from "../assets/searchGrey.png"
import BarChartCompare from "../Components/Compare/barchart_compare";
import { getDatabase, onValue, ref } from "firebase/database";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import uddannelseDataBach from "./uddannelseDataBach";
import uddannelseData from "./uddannelseData";
import {OpenAIchat} from "./openaiS";
import sendButton from "../assets/send.png"
import checkedIcon from "../assets/checked.png"
import uncheckedIcon from "../assets/unchecked.png"


function ComparePage() {
    const [underPage, setUnderPage] = useState<string>('0');
    const [inputValue, setInputValue] = useState<string>("");
    const [outputValue, setOutputValue] = useState<string>("");
    const [options, setOptions] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [favoritesStudy, setFavoritesStudy] = useState<string[]>([]);
    const favoritesKandidat = uddannelseData.filter(item => favoritesStudy.includes(item.title)).flatMap(index => index.title);
    const favoritesBachelor = uddannelseDataBach.filter(item => favoritesStudy.includes(item.title)).flatMap(index => index.title);
    const [optionSelect, setOptionSelect] = useState('');
    const barColors = ['#09214C', '#FAA712', '#FBD607', '#DBDE4F', '#4FA169'];

    //bachelor data
    const [accesStatus, setAccesStatus] = useState<"true" | "partly" | "false" | "na">("na");
    const [firebaseData, setFirebaseData] = useState<any[]>([]);
    const adgangskravBach = uddannelseDataBach.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.Adgangskrav?.flatMap(adgangskrav => adgangskrav)}));
    const kandMuligheder = uddannelseDataBach.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.kandidater?.flatMap(kandidater => kandidater) }));
    const semesterBach = uddannelseDataBach.filter(item=> favoritesStudy.includes(item.title)).map(item => ({name: item.title, data: item.Semestrene})); 
    const tidsforbrugDataBach = uddannelseDataBach.filter(item => favoritesStudy.includes(item.title)).flatMap(item => item.tidsforbruget).map((tidsforbrug, index) => ({ ...tidsforbrug, fill: barColors[index % barColors.length], unit: "timer"}));
    const tidsfordelingDataBach = uddannelseDataBach.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.Tidsfordelingen.map(({ name, value, fill }) => ({ name, value, fill }))}));

    //kandidater data
    const lønData = uddannelseData.filter(item => favoritesStudy.includes(item.title)).flatMap(item => item.FørsteÅrLøn).map((FørsteÅrLøn, index) => ({ ...FørsteÅrLøn, fill: barColors[index % barColors.length] }));
    const lønTiData = uddannelseData.filter(item => favoritesStudy.includes(item.title)).flatMap(item => item.TiÅrLøn).map((TiÅrLøn, index) => ({ ...TiÅrLøn, fill: barColors[index % barColors.length] }));
    const tidsforbrugData = uddannelseData.filter(item => favoritesStudy.includes(item.title)).flatMap(item => item.tidsforbrug).map((tidsforbrug, index) => ({ ...tidsforbrug, fill: barColors[index % barColors.length], unit: "timer"}));
    const tidsfordelingData = uddannelseData.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.Tidsfordeling.map(({ name, value, fill }) => ({ name, value, fill }))}));
    const jobmuligheder = uddannelseData.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.Jobs?.flatMap(jobs => jobs) }));
    const adgangskrav = uddannelseData.filter(item => favoritesStudy.includes(item.title)).map(item => ({id: item.title, data: item.Adgangskrav?.flatMap(adgangskrav => adgangskrav)}));  
    const socialrating = uddannelseData.filter(item=> favoritesStudy.includes(item.title)).map((item, index) => ({name: item.title, value: item.socialBedømmelse, fill: barColors[index % barColors.length], unit: "%" })); 
    const jobrating = uddannelseData.filter(item=> favoritesStudy.includes(item.title)).map((item, index) => ({name: item.title, value: item.jobbedømmelse, fill: barColors[index % barColors.length], unit: "%" })); 
    const semesterKand = uddannelseData.filter(item=> favoritesStudy.includes(item.title)).map(item => ({name: item.title, data: item.Semestrene})); 
  
  //henter UID fra firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();

  }, []);
  
  //få list over favoritter
  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favsRef = ref(db, `users/${user.uid}/favorites`);

      onValue(favsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const titles = Object.keys(data);
            setFavoritesStudy(titles);
          } else {
            setFavoritesStudy([]);
          }
      });
    }
  }, [user]);

//###########################tidsforbrug side###########################
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

  const renderColorfulLegendText = (value: string) => {
    const color = "black";
  
    return <span style={{ color }}>{value}</span>;
  };
//##########################################################################

//###########################Reverse search#################################
const handleOpenAIRequest = async () => {
    try {
      const response = await OpenAIchat(inputValue);
      // Check if response is null
      if (response !== null) {
        // If it's not null, set the output value
        setOutputValue(response);
      } else {
        // Handle the case where response is null
        console.error("Response from OpenAI is null.");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error here
    }
};

//##########################################################################
const handleChosenEducation = (Subject: {
            id: string;
            data: {
                fag: string;
                niveau: string;
                n: number;
                avg: number;
                n2: number;
                avg2: number;
            }[];
        }) => {
        if (user) {
            const db = getDatabase();
            const diplomaRef = ref(db, `users/${user.uid}/diploma/highSchoolDiploma`);
        
            onValue(diplomaRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setFirebaseData(data);
                const adgangskravSubjects = Subject.data;
                console.log(data, adgangskravSubjects );
        
                const matchingData = adgangskravSubjects.map(subject => {
                  const filteredData = data.filter((item: { fag: string;}) => item.fag === subject.fag);
                  const dataN = filteredData.map((item: {n: number}) => [item.n]).flat();
                  const sumN = dataN.reduce((total: number, num: number) => total + num, 0);
                  const averageN = sumN / dataN.length;
                  const mappedData = filteredData.map((item: { årsKarakter: number; prøveKarakter: number; }) => [item.årsKarakter, item.prøveKarakter]).flat();
                  const noUndefined = mappedData.filter((item: number) => item !== undefined);
                  const sum = noUndefined.reduce((total: number, num: number) => total + num, 0);
                  const average = sum / noUndefined.length;
                  return {
                    fag: subject.fag,
                    n: averageN,
                    avg: average,
                  };
                });
      
                const allExist = adgangskravSubjects.every(subject => (
                  matchingData.some((item: any) => (
                    (item.fag === subject.fag && item.n >= subject.n && item.avg >= subject.avg) || (item.fag === subject.fag && item.n >= subject.n2 && item.avg >= subject.avg2 )  
                  ))
                ));
        
                const someExist = adgangskravSubjects.some(subject => (
                  matchingData.some((item: any) => (
                    item.fag === subject.fag && item.n >= subject.n && item.avg >= subject.avg
                  ))
                ));
        
                if (allExist) {
                  setAccesStatus("true");
                } else if (!allExist && someExist) {
                  setAccesStatus("partly");
                } else {
                  setAccesStatus("false");
                }
              } else {
                setAccesStatus("na");
      
              }
            });
          }
  };

  return (
    <div style={{width:"90%",height:"100%", margin:"auto", display:"flex", flexDirection:"row", overflowY:"auto"}}>
      <div style={{width:"20%", height:"100%", display:"flex", alignItems:"center", flexDirection:"column", position:"fixed", background:"white", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)"}}>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '0' && options === '' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: underPage === '0' && options === '' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center",}} onClick={() => {setUnderPage('0'); setOptions("");}}>Overblik<img src={underPage === '0' && options === '' ? aboutIcon : greyAboutIcon} style={{width:"9%", marginRight:"0%"}}/></button>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '1' && options === '' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: underPage === '1' && options === '' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center",}} onClick={() => {setUnderPage('1'); setOptions("");}}>Reverse search<img src={underPage === '1' && options === '' ? whiteSearch : greySearch} style={{width:"8%", marginRight:"0%"}}/></button>
        <button style={{marginTop:"5%", width:"90%", height:"7%", outline:"none", background: options === 'bachelor' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: options === 'bachelor' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={() => {setOptions(prevState => prevState === 'bachelor' ? '' : 'bachelor'); setUnderPage('2'); setOptionSelect(favoritesBachelor[0]); {adgangskravBach.map((subject) => handleChosenEducation(subject))};}}>Sammenlign bachelor <img src={options === 'bachelor' ? collapseIcon : expandIcon} style={{width:"7%", marginRight:"1%"}}/></button>
        {options === 'bachelor' && (
            <div style={{width:"90%", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"end", marginBottom:"-3%"}}>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '2' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('2'); setOptionSelect(favoritesBachelor[0]); {adgangskravBach.map((subject) => handleChosenEducation(subject))};}}>Bachelor adgangskrav</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '3' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('3'); setOptionSelect(favoritesBachelor[0]);}}>Kandidat muligheder</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '4' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('4'); setOptionSelect(favoritesBachelor[0]);}}>Bachelor semestre</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '5' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('5'); setOptionSelect(favoritesBachelor[0]);}}>Tidsforbrug på bachelor</button> 
            </div>
        )}
        <button style={{marginTop:"5%", width:"90%", height:"7%", outline:"none", background: options === 'kandidat' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: options === 'kandidat' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={() => {setOptions(prevState => prevState === 'kandidat' ? '' : 'kandidat'); setUnderPage('6'); setOptionSelect(favoritesKandidat[0])}}>Sammenlign kandidater <img src={options === 'kandidat' ? collapseIcon : expandIcon} style={{width:"7%", marginRight:"1%"}}/></button>
        {options === 'kandidat' && (
            <div style={{width:"90%", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"end" , marginBottom:"-3%"}}>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '6' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('6'); setOptionSelect(favoritesKandidat[0]);}}>Kandidat adgangskrav</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '7' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('7'); setOptionSelect(favoritesKandidat[0]);}}>Kandidat semestre</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '8' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('8'); setOptionSelect(favoritesKandidat[0]);}}>Tidsforbrug på kandidat</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '9' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => {setUnderPage('9'); setOptionSelect(favoritesKandidat[0]);}}>Jobmuligheder</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '10' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('10')}>løn niveau</button>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '11' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('11')}>Social miljø</button>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '12' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('12')}>Arbejdsløshed</button>
            </div>
        )}
      </div>
      <div style={{ marginLeft:"25%", width:"75%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
        {underPage === '0' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>               
                <p style={{width:"100%", textAlign:"center", fontWeight: 500}}>På denne side kan du bruge de forskellige undersider til at sammenligne dinde favorit uddannelser:</p>
                <h3 style={{margin:"0%"}}>Reverse search</h3>
                <p style={{marginLeft:"2%"}}>Brug reverse search til at finde din vej til et job. Denne underside kan finde den bachlor og/eller kandidat der giver adgang til dit drømme job.</p>
                <h3 style={{margin:"0%"}}>Sammenlign Bachelor</h3>
                <p style={{marginLeft:"2%"}}>Brug denne side til at få et hurtigt overblik over statestikken for dine favorit bachelor uddannelser.</p>
                <h3 style={{margin:"0%"}}>Sammenlign kandidater</h3>
                <p style={{marginLeft:"2%"}}>Brug denne side til at få et hurtigt overblik over statestikken for dine favorit kandidat uddannelser.</p>
            </div>
        )}
        {underPage === '1' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2 style={{textAlign:"center"}}>Indtast dit drømmejob eller beskrivelsen på dette</h2>
                <div style={{display: "flex", alignItems: "center", boxShadow: "0px 0px 1.5px 0px rgba(0,0,1)"}}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Hvad er dit drømmejob?"
                        style={{ height: "50px", flex: 1, marginRight: "10px", marginLeft: "10px", borderRadius: "8px", fontSize: "20px", border: "none", outline: "none"}}
                    />
                    <button
                        onClick={handleOpenAIRequest}
                        style={{ height: "56px", width: "100px", borderRadius: "0px 2px 2px 0px", background:"white"}}>
                        <img
                            src={sendButton}
                            style={{ width:"56%", height: "100%" }}/>
                    </button>
                </div>
                <div style={{height: "100%", width: "100%",marginTop: "10px", background:""}}>
                    <p style={{padding:"10px", background: "white"}}>{outputValue}</p>
                </div>                 
            </div>
        )}
        {underPage === '2' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <div style={{width:"100%", display:"flex", flexDirection:"row"}}>
                <div style={{width:"33%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {adgangskravBach.map((Subject) => (
                        <button onClick={() => {setOptionSelect(Subject.id); handleChosenEducation(Subject);}} style={{width:"90%", margin:"2%", borderLeft: Subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none", textAlign:"left"}}>{Subject.id}</button>
                    ))}
                </div>
                <div style={{width:"64%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    <h3 style={{marginTop:"-0%", width:"100%", textAlign:"left"}}>Adgangskrav for {optionSelect}:</h3>
                    <p>Bestået adgangsgivende eksamen:</p>
                    {optionSelect && (adgangskravBach.find(subject => subject.id === optionSelect)?.data || []).map((item, index) => {
                        const existsInFirebase = firebaseData.length > 0 && firebaseData.some(data => data.fag === item.fag && data.n >= item.n);
                        return (
                            <div style={{ width: "98%", margin: "auto" }}>
                                <ul style={{ listStyleType: "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "2%" }}>
                                        <img src={existsInFirebase ? checkedIcon : uncheckedIcon} style={{ width: "3%", marginTop: "0.2%" }} />
                                        <li key={index} style={{ marginLeft: "1%", fontSize: "20px" }}>
                                            {item.fag} {item.niveau}
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        );
                    })}
                    {accesStatus === "true" && <div><p>Du opfylder alle krav til denne uddanelse</p></div>}
                    {accesStatus === "partly" && <div><p>Du opfylder nogle af kravene til denne uddannelse</p></div>}
                    {accesStatus === "false" && <div><p>Du opfylder desværre ingen af kravene til denne uddannelse</p></div>}
                </div>
                </div>
            </div>
        )}
        {underPage === '3' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <div style={{width:"100%", display:"flex", flexDirection:"row"}}>
                <div style={{width:"33%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {kandMuligheder.map((Subject) => (
                        <button onClick={() => setOptionSelect(Subject.id)} style={{width:"90%", margin:"2%", borderLeft: Subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none",textAlign:"left"}}>{Subject.id}</button>
                    ))}
                </div>
                <div style={{width:"64%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    <h3 style={{marginTop:"-0%", width:"100%", textAlign:"left"}}>Kandidat muligheder for {optionSelect}:</h3>
                    {optionSelect && (kandMuligheder.find(subject => subject.id === optionSelect)?.data || []).map((item, index) => (
                        <div key={index} style={{marginLeft:"5%"}}>
                            <ul>
                                <li>
                                  <p>{item.name}, {item.location}</p>  
                                </li>
                            </ul>    
                        </div>
                    ))}
                </div>
                </div>
            </div>
        )}
        {underPage === '4' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                                <div style={{width:"100%", display:"flex", flexDirection:"row"}}>
                <div style={{width:"33%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {semesterBach.map((Subject) => (
                        <button onClick={() => setOptionSelect(Subject.name)} style={{width:"90%", margin:"2%", borderLeft: Subject.name === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none",textAlign:"left"}}>{Subject.name}</button>
                    ))}
                </div>
                <div style={{width:"64%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    <h3 style={{marginTop:"-0%", width:"100%", textAlign:"left"}}>Kandidat muligheder for {optionSelect}:</h3>
                    {optionSelect && (semesterBach.find(subject => subject.name === optionSelect)?.data || []).map((item, index) => (
                    <li key={index} style={{ fontSize: "20px", listStyleType:"none" }}>
                    <p style={{ fontWeight: 700}}>{item.name}</p>
                    {item.semester.map((subj, idx) => (
                      <div key={idx} style={{ marginLeft: "2%",}}>
                        <p style={{ fontSize: "20px", fontWeight:500 }}>{subj.track}</p>
                        <div style={{marginLeft: subj.track === '' ? "0%" : "3%" }}>
                        <p style={{ fontSize: "20px" }}>{subj.projektTitel}</p>
                        <ul style={{ listStyleType: "disc", marginLeft: "2%" }}>
                          {subj.projects.map((project, i) => (
                            <a href={project.href} target="none">
                            <li key={i} style={{ fontSize: "20px" }}>
                              {project.projectName}
                            </li>
                            </a>
                          ))}
                        </ul>
                          <div>
                            <p style={{ fontSize: "20px" }}>{subj.kursusTitel}</p>
                            <ul style={{ listStyleType: "disc", marginLeft: "2%" }}>
                              {subj.courses.map((course, i) => (
                                <a href={course.href} target="none">  
                                <li key={i} style={{ fontSize: "20px" }}>
                                  {course.courseName}
                                </li>
                                </a>
                              ))}
                            </ul>
                        </div>
                        </div>
                      </div>
                    ))}
                  </li>
                    ))}
                </div>
                </div>
            </div>
        )}
        {underPage === '5' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Gennemsnit arbejdstimer på dine favorit uddannelser</h2>
                <h3>ugentlige arbejdstimer:</h3>
                <BarChartCompare data = {tidsforbrugDataBach} width={300} height={200} />
                <h3>tidsfordeling af arbejdstimer:</h3>
                <div style={{display:"flex"}}>
                <div style={{width:"33%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {tidsfordelingDataBach.map((subject) => (
                        <button onClick={() => {setOptionSelect(subject.id);}} style={{width:"90%", margin:"2%", borderLeft: subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none", textAlign:"left"}}>
                            {subject.id}
                        </button>
                    ))}
                </div>
                <div style={{width:"64%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    {optionSelect && (
                        <ResponsiveContainer width="100%" height={336}>
                            <PieChart>
                                <Pie
                                    data={tidsfordelingDataBach.find(subject => subject.id === optionSelect)?.data || []}
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
                                    {(tidsfordelingDataBach.find(subject => subject.id === optionSelect)?.data || []).map((_entry, index) => (
                                        <Cell key={`cell-${index}`} />
                                    ))}
                                </Pie>
                                <Legend formatter={renderColorfulLegendText} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                </div>
            </div>
        )}
        {underPage === '6' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <div style={{width:"100%", display:"flex", flexDirection:"row"}}>
                <div style={{width:"30%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {adgangskrav.map((Subject) => (
                        <button onClick={() => setOptionSelect(Subject.id)} style={{width:"90%", margin:"2%", borderLeft: Subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none",textAlign:"left"}}>{Subject.id}</button>
                    ))}
                </div>
                <div style={{width:"67%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    <h3 style={{marginTop:"-0%", width:"100%", textAlign:"left"}}>Adgangsgivende bachelore for {optionSelect}:</h3>
                    {optionSelect && (adgangskrav.find(subject => subject.id === optionSelect)?.data || []).map((item, index) => (
                        <div key={index} style={{marginLeft:"5%"}}>
                            <ul>
                                <li>
                                  <p>{item.bachelor}, {item.location}</p>  
                                </li>
                            </ul>    
                        </div>
                    ))}
                </div>
                </div>
            </div>
        )}
        {underPage === '7' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"row"}}>
                <div style={{width:"30%", display:"flex", alignItems:"center", flexDirection:"column", borderRight:"1px solid rgba(100, 100, 100, 0.1)" }}>
                    {semesterKand.map((Subject) => (
                        <button onClick={() => setOptionSelect(Subject.name)} style={{width:"90%", margin:"2%", borderLeft: Subject.name === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none", textAlign:"left"}}>{Subject.name}</button>
                    ))}
                </div>
                <div style={{width:"67%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                <h3 style={{marginTop:"0%", marginBottom:"-2%"}}>Semester oversigt for dine favorit uddannelser</h3>
                <ul style={{marginLeft:"-2%"}}>
                {optionSelect && (semesterKand.find(subject => subject.name === optionSelect)?.data || []).map((item, index) => ( 
                  <li key={index} style={{ fontSize: "20px", listStyleType:"none" }}>
                    <p style={{ fontWeight: 700}}>{item.name}</p>
                    {item.semester.map((subj, idx) => (
                      
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
                        <p style={{ fontSize: "20px" }}>{item.ManName}</p>
                        <ul style={{ listStyleType: "disc", marginLeft: "2%" }}>
                          {subj.ManCourses.map((course, i) => (
                            <a href={course.href} target="_blank">
                            <li key={i} style={{ fontSize: "20px" }}>
                              {course.courseName}
                            </li>
                            </a>
                          ))}
                        <p style={{ fontSize: "20px", marginLeft:"-6.7%" }}>{item.OptName}</p>
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
        {underPage === '8' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Gennemsnit arbejdstimer på dine favorit uddannelser</h2>
                <h3>ugentlige arbejdstimer:</h3>
                <BarChartCompare data = {tidsforbrugData} width={300} height={200} />
                <h3>tidsfordeling af arbejdstimer:</h3>
                <div style={{display:"flex"}}>
                <div style={{width:"30%", display:"flex", flexDirection:"column", alignItems:"center"}}>
                    {tidsfordelingData.map((subject) => (
                        <button onClick={() => {setOptionSelect(subject.id);}} style={{width:"90%", margin:"2%", borderLeft: subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none", textAlign:"left"}}>
                            {subject.id}
                        </button>
                    ))}
                </div>
                <div style={{width:"70%"}}>
                    {optionSelect && (
                        <ResponsiveContainer width="100%" height={336}>
                            <PieChart>
                                <Pie
                                    data={tidsfordelingData.find(subject => subject.id === optionSelect)?.data || []}
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
                                    {(tidsfordelingData.find(subject => subject.id === optionSelect)?.data || []).map((_entry, index) => (
                                        <Cell key={`cell-${index}`} />
                                    ))}
                                </Pie>
                                <Legend formatter={renderColorfulLegendText} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                </div>
            </div>
        )}
        {underPage === '9' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <div style={{width:"100%", display:"flex", flexDirection:"row"}}>
                <div style={{width:"30%", display:"flex", flexDirection:"column", alignItems:"center", borderRight:"1px solid rgba(100, 100, 100, 0.1)"}}>
                    {jobmuligheder.map((Subject) => (
                        <button onClick={() => setOptionSelect(Subject.id)} style={{width:"90%", margin:"2%", borderLeft: Subject.id === optionSelect ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)", outline:"none", textAlign:"left"}}>{Subject.id}</button>
                    ))}
                </div>
                <div style={{width:"67%",marginLeft:"2%", display:"flex",flexDirection:"column"}}>
                    <h3 style={{marginTop:"-0%", width:"100%", textAlign:"left"}}>Mulige job for {optionSelect}:</h3>
                    {optionSelect && (jobmuligheder.find(subject => subject.id === optionSelect)?.data || []).map((item, index) => (
                        <div key={index} style={{marginLeft:"5%"}}>
                            <ul>
                                <li>
                                  <p>{item.name}</p>  
                                </li>
                            </ul>    
                        </div>
                    ))}
                </div>
                </div>
            </div>
        )}
        {underPage === '10' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Gennemsnit løn niveau for dine favorit uddannelser</h2>
                <h3>Første års løn:</h3>
                <BarChartCompare data = {lønData} width={300} height={200} />
                <h3>Løn efter 10 år:</h3>
                <BarChartCompare data = {lønTiData} width={300} height={200} />
            </div>
        )}
        {underPage === '11' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Social bedømmelser for dine favorit udddannelser</h2>
                <BarChartCompare data={socialrating} width={300} height={200}/>
            </div>
        )}
        {underPage === '12' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>gennemsnitlig arbejdsløshed for dine favorit udddannelser</h2>
                <BarChartCompare data={jobrating} width={300} height={200}/>
            </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;
