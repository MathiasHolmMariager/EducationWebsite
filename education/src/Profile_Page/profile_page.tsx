import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import "./profile_page.css"
import logoutIcon from "../assets/logoutIcon.png"
import checkIcon from "../assets/checked.png"
import uncheckIcon from "../assets/unchecked.png"


interface Diploma {
  highSchoolDiploma?: { [key: number]: any };
  bachelorDiploma?: { [key: number]: any };
  bachelorTitel?: string;
}


function ProfilePage() {
  const [underPage, setUnderPage] = useState<string>('pro');
  const [user, setUser] = useState<User | null>(null);
  const [pickedInterests, setPickedInterests] = useState<string[]>([]);
  const [diploma, setDiploma] = useState<Diploma>({});

  //henter UID fra firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  //logger ud fra firebase
  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      location.href = '/';      
    } catch (error) { 
    }
  };
  
  //henter data fra firebase
  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const interestsRef = ref(db, `users/${user.uid}/interests`);
      const diplomaRef = ref(db, `users/${user.uid}/diploma`);

      onValue(interestsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPickedInterests(data);
        } else {
          setPickedInterests([]);
        }
      });

      onValue(diplomaRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDiploma(data);
        } else {
          setDiploma({});
        }
      });
    }
  }, [user]);

  //##########################Ændre interest#############################

  //liste med mulige interreser:
  const [interests] = useState([
    'Matematik',
    'Fysik',
    'Programmering',
    'Interest 4',
    'Interest 5',
    'Interest 6',
    'Interest 7',
    'Interest 8',
    'Interest 9',
    'Interest 10',
  ]);

  //Ændring i firebase
  const handleInterestClick = (interest: string) => {
    const updatedInterests = pickedInterests.includes(interest)
      ? pickedInterests.filter((item) => item !== interest)
      : [...pickedInterests, interest];
    setPickedInterests(updatedInterests);

    const db = getDatabase();
    if (user) {
      const interestsRef = ref(db, `users/${user.uid}/interests`);
      set(interestsRef, updatedInterests);
    }
  };
  //#######################################################################

  return (
    <div style={{width:"90%",height:"100%", margin:"auto", display:"flex", flexDirection:"row", overflowY:"auto"}}>
      <div style={{width:"25%", height:"100%", display:"flex", alignItems:"center", flexDirection:"column", position:"fixed"}}>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === 'pro' ? "rgb(33, 26, 82)" : "", color: underPage === 'pro' ? "white" : "" }} onClick={() => setUnderPage('pro')}>Profiloplysninger</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === 'int' ? "rgb(33, 26, 82)" : "", color: underPage === 'int' ? "white" : ""}} onClick={() => setUnderPage('int')}>Dine interesser</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === 'gym' ? "rgb(33, 26, 82)" : "", color: underPage === 'gym' ? "white" : ""}} onClick={() => setUnderPage('gym')}>Gymnasium Bevis</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === 'bac' ? "rgb(33, 26, 82)" : "", color: underPage === 'bac' ? "white" : ""}} onClick={() => setUnderPage('bac')}>Bachelor bevis</button>
        <button style={{marginTop:"80%", display:"flex", width:"40%", height:"7%", alignItems:"center", justifyContent:"center"}} onClick={handleSignOut}>
          <img src={logoutIcon} style={{width:"20%",}} />
          <p style={{width:"", textAlign:"left", paddingLeft:"19%"}}>Log ud</p>
        </button>
      </div>
      <div style={{ marginLeft:"25%", width:"75%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", background:"white"}}>
        {underPage === 'pro' && (
          <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
            <h2 style={{marginTop:"-1.5%"}}>kontaktoplysninger:</h2>
            <p style={{width:"100%"}}><b>Email:</b> {user?.email}
            </p>
          </div>
        )}
        {underPage === 'int' && (
          <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
            <h2 style={{marginTop:"-1.5%"}}>Vælg dine interesser:</h2>
            <ul style={{listStyleType:"none", columnCount:"2", marginLeft:"-2%", width:"94%", height:""}}>
              {interests.map((interest, index) => (
                <li key={index} style={{cursor: 'pointer'}} onClick={() => handleInterestClick(interest)}>
                  <button style={{ marginBottom:"2%", borderRadius:"8px", width:"96%", padding:"0% 2% 0% 3%", display:"flex", justifyContent:"space-between", alignItems:"center", outline:"none"}}>
                    <b>{interest}</b>
                    <img src={pickedInterests.includes(interest) ? checkIcon : uncheckIcon } style={{width:"8%", height:"8%", margin:"3% 1% 3% 0%"}}/>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {underPage === 'gym' && (
          <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
            <h2 style={{marginTop:"-1.5%"}}>Karakterblad for gymnasiet:</h2>
            <ul style={{listStyleType:"none"}}>
              {diploma.highSchoolDiploma && Object.values(diploma.highSchoolDiploma).map((subject: any, index: number) => (
                <li key={index}>
                  <div style={{display:"flex", width:"95%", borderBottom: '0.5px solid rgb(75,75,75)',}}>
                  <p style={{ width:"60%"}}>{subject.fag} {subject.niveau}</p><p style={{ width:"20%" }}><b> Års karakter:</b> {subject.årsKarakter}</p><p style={{ width:"20%" }}><b> Prøve karakter: </b>{subject.prøveKarakter}</p>  
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {underPage === 'bac' && (
          <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
            <div style={{display:"flex", width:"100%", alignItems:"center", justifyContent:"space-between" , }}>
            <h2 style={{marginTop:"-1.5%",}}>Karakterblad for bachelor:</h2>
            <h2 style={{marginTop:"-1.5%",}}>{diploma.bachelorTitel}</h2>
            </div>
            <ul style={{listStyleType:"none"}}>
              {diploma.bachelorDiploma && Object.values(diploma.bachelorDiploma).map((subject: any, index: number) => (
                <li key={index}>
                  <div style={{display:"flex", width:"95%", borderBottom: '0.5px solid rgb(75,75,75)', flexDirection:"row"}}>
                    <p style={{ width:"55%"}}>{subject.fag}</p><p style={{ width:"13.5%" }}><b>Semester: </b>{subject.semester}</p><p style={{ width:"16.5%" }}><b> ECTS Points:</b> {subject.ectsPoint}</p><p style={{ width:"15%" }}><b> Karakter: </b>{subject.karakter}</p>  
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
